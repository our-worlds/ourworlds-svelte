<style>
  textarea {
    height: 48px;

    padding-inline-start: 10px;

    border: 1px solid #e3e5e6;

    font-size: 16px;
    line-height: 16px;
  }

  nav {
    position: absolute;
    top: 44px;

    width: 100vw;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-inline-start: 18px;
    padding-inline-end: 18px;
  }

  nav button {
    display: grid;
    align-items: center;
    justify-items: center;

    width: 3rem;
    height: 3rem;

    border: 0;
    border-radius: 15px;

    background-color: rgba(128, 128, 128, 0.2);
  }

  #wrapper {
    display: grid;
    grid-template: 140px 48px 24px 1fr auto / 1fr;

    height: 100vh;
  }

  #status {
    text-align: center;
  }

  #status-ball {
    font-size: 32px;
  }

  #cover {
    height: 100%;
    justify-self: center;
  }

  #title {
    justify-self: center;
    text-align: center;

    width: 90vw;
    height: 36px;

    font-weight: bold;
    font-size: 32px;
    line-height: 36px;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    color: #090a0a;
  }

  #chat {
    display: flex;
    flex-direction: column;

    overflow-y: scroll;

    padding-inline: 5px;
  }

  :global(#chat .remote) {
    align-self: end;
  }

  #chat dt {
    width: max-content;

    margin-inline: 20px;
    margin-block-end: -11px;
    padding: 0 10px;

    border-radius: 10px;
    background-color: #f0f8ff;

    z-index: 1;
  }

  #chat dd {
    border-radius: 10px;
    padding: 10px;
  }

  :global(#chat dd.local),
  :global(#chat dd.remote) {
    min-width: 40vw;
    max-width: 60vw;
    height: max-content;

    margin-block-end: 5px;

    background-color: #ededed;
  }

  #chatInput {
    max-height: 150px;

    padding: 0;
    -moz-box-sizing: content-box;
  }
</style>

<!--
    Unfortunately, the IPFS npm package can't be used with vite, because it uses node.js features.

    This component is based on `https://docs.ipfs.io/how-to/create-simple-chat-app/#getting-the-code`.
    I'm sure there are better ways to implement this functionality by now, but I considered it
    appropriate to get the chat functionality started.

    Additional information:
        https://github.com/ipfs/js-ipfs#readme
        https://docs.libp2p.io/concepts/publish-subscribe/
-->
<script>
  import { onDestroy, onMount, tick } from 'svelte';

  import Deed from '$lib/moralisobjects/deed.js';

  import Icon from '@components/Icon.svelte';
  import { backIcon } from '$lib/appicons.js';
  import { authStore, isAuthenticated } from '$lib/auth.js';
  import { page } from '$app/stores';

  const deedId = $page.params.room;

  const bootstraps = [
    '/dns6/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
    '/dns4/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
  ];

  const ipfsOptions = {
    repo: `ok${Math.random()}`, // random so we get a new peerid every time, useful for testing
    relay: {
      enabled: true,
      hop: {
        enabled: true,
      },
    },
    config: {
      Addresses: {
        Swarm: [
          '/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
          '/dns6/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star',
        ],
      },
      // FIXME Announce: [ '/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt/p2p-circuit' ],
    },
  };

  const prefix = 'ourworldschat-';

  const props = {
    color: '#979C9E',
    filled: false,
    width: '24',
    height: '24',
  };

  const backProps = { ...props, ds: backIcon, width: '8', height: '14' };

  let deed;
  let provider;

  let keepInterval;
  let checkInterval;
  let peerInterval;
  let peerCountTimeout;
  let chatContainer;
  let chats = [];

  let lastAlive = 0; // last keep-alive we saw from a relay
  let lastPeer = 0; // last keep-alive we saw from another peer
  let lastBootstrap = 0; // used for tracking when we last attempted to bootstrap (likely to reconnect to a relay)
  let ipfs;
  let peerCount = 0; // this is kind of a janky way to track peer count. really it'd be better to store the peers
  // in a map, along with their last "peer-alive", to track peer count in a stable way.

  onMount(async () => {
    if (deedId !== undefined) {
      provider = window.Moralis;

      if (!$isAuthenticated) {
        try {
          await authStore.connect();
        } catch (error) {
          console.error('Connecting to wallet failed', error);
          return;
        }
      }

      const query = new provider.Query(new Deed());
      query.equalTo('objectId', deedId);
      const deeds = await query.find();

      console.log(deeds);

      if (deeds.length > 0) {
        deed = deeds[0];
        return startChat();
      }
      console.error('no deed found');
    }
  });

  onDestroy(() => {
    clearInterval(keepInterval);
    clearInterval(checkInterval);
    clearInterval(peerInterval);

    clearTimeout(peerCountTimeout);

    bootstraps.forEach(async (bootstrap) => await ipfs.swarm.disconnect(bootstrap));
  });

  // out is used for processing recieved messages and outputting them both to console and the message box.
  async function displayMessage(input) {
    let type = 'remote';
    let data;

    if (typeof input.data === 'string') {
      type = 'local';
      data = JSON.parse(input.data);
      data.from = 'me';
    } else {
      data = JSON.parse(input.data.toString());
    }

    console.log(data, type);

    chats = [
      ...chats,
      {
        type,
        from: data.from,
        message: data.message,
      },
    ];

    tick().then(() => {
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }

  // usage: await send("Hello", "example_channel");
  async function send(message, channel) {
    await ipfs.pubsub.publish(prefix + channel, message);
  }

  // used for triggering a send from user input
  async function sendInput() {
    const displayName = provider.User.current().lastName?.toLowerCase();
    const message = document.getElementById('chatInput').value?.trim();
    if (displayName === '' || message === '') {
      return true;
    }

    send(`{ "from": "${displayName}", "message": "${message}"}`, 'global');
    document.getElementById('chatInput').value = '';
  }

  // usage: await joinchan("example_channel");
  async function joinchan(chan) {
    await ipfs.pubsub.subscribe(prefix + chan, displayMessage);
  }

  // check if we're still connected to the circuit relay (not required, but let's us know if we can see peers who may be stuck behind NAT)
  function checkalive() {
    const now = new Date().getTime();
    if (now - lastAlive >= 35000) {
      if (now - lastPeer >= 35000) {
        document.getElementById('status-ball').style.color = 'red';
      } else {
        document.getElementById('status-ball').style.color = 'yellow';
      }
      dobootstrap(true); // sometimes we appear to be connected to the bootstrap nodes, but we're not, so let's try to reconnect
    } else {
      document.getElementById('status-ball').style.color = 'lime';
    }
  }

  // processes a circuit-relay announce over pubsub
  async function processAnnounce(addr) {
    // get our peerid
    let me = await ipfs.id();
    me = me.id;

    // not really an announcement if it's from us
    if (addr.from === me) {
      return;
    }

    // process the recieved address
    addr = new TextDecoder().decode(addr.data);

    const pcDisplay = document.getElementById('peerCount');
    if (!pcDisplay) return;

    if (addr === 'peer-alive') {
      peerCount += 1;
      pcDisplay.innerHTML = peerCount.toString();
      peerCountTimeout = setTimeout(() => {
        peerCount -= 1;
        pcDisplay.innerHTML = peerCount.toString();
      }, 15000);

      lastPeer = new Date().getTime();
      return;
    }

    // keep-alives are also sent over here, so let's update that global first
    lastAlive = new Date().getTime();

    if (addr === 'keep-alive') return;

    const peer = addr.split('/')[9];
    console.log(`Peer: ${peer}`, `Me: ${me}`);
    if (peer === me) return;

    // get a list of peers
    const peers = await ipfs.swarm.peers();
    for (const i in peers) {
      // if we're already connected to the peer, don't bother doing a circuit connection
      if (peers[i].peer === peer) {
        return;
      }
    }

    // log the address to console as we're about to attempt a connection
    console.log('******* Address:', addr);

    // connection almost always fails the first time, but almost always succeeds the second time, so we do this:
    // Fixme: The address provided from IPFS is always invalid '{"timestamp":164353932876}'. Maybe something incorrect with the setup
    try {
      if (addr.charAt(0) === '/') await ipfs.swarm.connect(addr);
    } catch (err) {
      console.log(err);
      await ipfs.swarm.connect(addr);
    }
  }

  // if reconnect is true, it'll first attempt to disconnect from the bootstrap nodes
  async function dobootstrap(reconnect) {
    const now = new Date().getTime();
    if (now - lastBootstrap < 60000) {
      // don't try to bootstrap again if we just tried within the last 60 seconds
      return;
    }
    lastBootstrap = now;
    for (const i in bootstraps) {
      if (reconnect) {
        try {
          await ipfs.swarm.disconnect(bootstraps[i]);
        } catch (e) {
          console.log(e);
        }
      } else {
        await ipfs.bootstrap.add(bootstraps[i]);
      }
      await ipfs.swarm.connect(bootstraps[i]);
    }
  }

  async function startChat() {
    if (ipfs) return;

    ipfs = await window.Ipfs.create(ipfsOptions);

    // add bootstraps for next time, and attempt connection just in case we're not already connected
    await dobootstrap(false);

    // join a global channel, because we don't have real chat channels implemented yet
    joinchan('global');

    // publish and subscribe to keepalive to help keep the sockets open
    await ipfs.pubsub.subscribe(`${prefix}keepalive`);
    keepInterval = setInterval(() => send('1', `${prefix}keepalive`), 4000);
    checkInterval = setInterval(checkalive, 1000);

    // process announcements over the relay network, and publish our own keep-alives to keep the channel alive
    await ipfs.pubsub.subscribe('announce-circuit', processAnnounce);
    peerInterval = setInterval(() => ipfs.pubsub.publish('announce-circuit', 'peer-alive'), 15000);
  }

  function handleKey(event) {
    console.log(event.key, event.keyCode);
    if (event.keyCode === 229 || event.keyCode === 0) {
      const code = this.value.charCodeAt(this.value.length - 1);
      if (code === 10) {
        event.target.style.height = 'auto';
        sendInput();
      } else {
        const element = this;
        setTimeout(() => (element.style.cssText = `height: ${element.scrollHeight + 2}px`), 0);
      }
      console.log(this.value, code);
    } else if (event.key === 'Enter' || event.keyCode === 13) {
      event.target.style.height = 'auto';
      sendInput();
    } else {
      const element = this;
      setTimeout(() => (element.style.cssText = `height: ${element.scrollHeight + 2}px`), 0);
    }
  }
</script>

<nav>
  <!-- TODO: Check that previous page is from this site -->
  <button on:click="{() => history.back()}"><Icon {...backProps} /></button>
  <p id="status-ball">⬤</p>
</nav>

<div id="wrapper">
  <img
    id="cover"
    src="{deed?.pictures ? deed.pictures.ipfs() : '/ourworlds_transparent.png'}"
    alt="deed cover"
  />

  <h1 id="title">{deed?.title}</h1>
  <p id="status"><span id="peerCount">0</span> <span>persons connected</span></p>
  <dl id="chat" bind:this="{chatContainer}">
    {#each chats as chat}
      <dt class="{chat.type}">{chat.from}</dt>
      <dd class="{chat.type}">{chat.message}</dd>
    {/each}
  </dl>
  <textarea id="chatInput" on:keyup|preventDefault="{handleKey}" placeholder="Chat here"></textarea>
</div>
