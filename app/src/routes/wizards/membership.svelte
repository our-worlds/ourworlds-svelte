<style>
  h2 {
    color: white;

    font-weight: bold;
    font-size: 32px;

    line-height: 36px;
    text-align: center;

    padding-inline-start: 45px;
    padding-inline-end: 45px;
  }

  p {
    color: white;

    padding-inline-start: 45px;
    padding-inline-end: 45px;
    margin-block-start: 9px;

    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;

    width: 390px;
  }

  p#buttons {
    width: 300px;
  }

  #membership-benefits li {
    display: flex;
    align-items: center;
    gap: 10px;

    color: white;

    line-height: 18px;
    font-size: 27px;
    font-weight: 500;

    padding-block-start: 18px;
    padding-block-end: 18px;
  }

  ul {
    list-style-type: none;
    padding-inline-end: 30px;
    /* margin-block-start: 30px; */
  }

  button {
    width: 215px;
    height: 48px;

    background: #ab9eff;
    border: 0;
    border-radius: 48px;

    font-weight: 500;
    font-size: 16px;
    line-height: 16px;

    color: #ffffff;
  }

  form {
    width: 300px;
  }

  form div {
    margin-block-end: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    align-content: center;

    color: #72777a;
  }

  form label {
    margin-inline-start: 20px;
    margin-block-end: -10px;
    padding-inline-start: 9px;

    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.37) 10%,
      rgba(255, 255, 255, 0.801) 20%,
      white 70%
    );

    border-radius: 9px;

    width: 96px;
    color: black;

    z-index: 5;
  }

  form input {
    width: 300px;
  }

  /* iframe {
        display: none;
        width: 90vw;
        height: 650px;

        margin-block-end: 24px;
        border: 0;
    } */

  #content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    align-self: start;
  }

  #content #membership-info div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #review {
    width: 200px;
  }

  #review dt {
    margin-block-start: 10px;
    font-weight: 700;
  }

  #review dd button {
    width: fit-content;
    height: initial;
  }

  #action {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-block-start: 45px;
  }

  button:disabled {
    margin-block-end: 10px;
    background-color: #aabedc;
  }

  #action div {
    margin-block-start: 12px;
  }

  .confetti {
    margin-block-start: 45px;
    margin-block-end: 60px;
  }

  section {
    background-color: inherit;
  }

  dt,
  dd {
    color: white;
  }

  #fund_wallet {
    margin-block-start: 24vh;
  }

  #fund_walletID {
    font-weight: bold;
    margin-block-end: 10px;
  }

  /*     
    #avax-faucet {
        margin-block-start: 24vh;
    }
    */
</style>

<script>
  import { onDestroy, onMount } from 'svelte';

  import { Jellyfish } from 'svelte-loading-spinners';
  import Clipboard from 'svelte-clipboard';

  import { currentPage, pageCount } from '$lib/stateStore.js';
  import { authStore, isAuthenticated } from '$lib/auth.js';

  import tokenMetadata from '/src/token/metadata.json';
  import { upgradableAbi, CONTRACT_ADDRESS } from '$lib/contract.js';

  import Icon from '@components/Icon.svelte';
  import { nftIcon, chatBubbleIcon, giftIcon, markerPinIcon, starIcon } from '$lib/appicons.js';
  import { goto } from '$app/navigation';

  const NFT_STATE = Object.freeze({
    UNMINTED: 'unminted',
    MINTING: 'minting',
    MINTED: 'minted',
    FAILED: 'failed',
  });

  const props = {
    color: '#fff',
    filled: false,
    width: '32',
    height: '32',
  };

  const nftIconProps = { ...props, ds: nftIcon };
  const chatBubbleIconProps = { ...props, ds: chatBubbleIcon };
  const giftIconProps = { ...props, ds: giftIcon };
  const markerIconProps = { ...props, ds: markerPinIcon };
  const starIconProps = { ...props, ds: starIcon };

  const color = 'white'; // spinner color

  let provider;
  let payment;
  let isMetamaskInstalled;
  let unsubscribeChainChanged;
  let unsubscribeAccountChanged;

  let firstName = '';
  let lastName = '';
  let email = '';

  let validWallet = null;
  const tokens = [];

  $: mintingNftState = NFT_STATE.UNMINTED;
  $: isMember = provider?.User.current()?.isMember;
  $: $pageCount = isMember ? 1 : 5;

  $: {
    if ($currentPage === 5) {
      isValidWallet().then((result) => (validWallet = result));
    }
  }

  $: {
    // Will go away soon
    if ($currentPage === 7) {
      const options = {
        chain: 'avalanche testnet',
        address: provider?.User.current()?.get('ethAddress'),
        token_address: CONTRACT_ADDRESS,
      };

      provider?.Web3API.account.getNFTsForContract(options).then((nfts) => {
        nfts.result.forEach((nft) => {
          const tokenUri = nft.token_uri;
          const encoded = tokenUri.split(',')[1];
          const data = decodeURIComponent(encoded);
          tokens.push(JSON.parse(data));
        });
        console.log(nfts);
      });
    }
  }

  $: {
    provider?.isMetaMaskInstalled().then((result) => (isMetamaskInstalled = result));
  }

  onMount(async () => {
    provider = window.Moralis;

    isMetamaskInstalled = await provider.isMetaMaskInstalled();

    unsubscribeChainChanged = provider.onChainChanged(async () => {
      if ($currentPage === 5) {
        validWallet = await isValidWallet();
      }
    });
    unsubscribeAccountChanged = provider.onAccountsChanged(async () => {
      if ($currentPage === 5) {
        validWallet = await isValidWallet();
      }
    });
  });

  onDestroy(() => {
    if (unsubscribeChainChanged) unsubscribeChainChanged();
    if (unsubscribeAccountChanged) unsubscribeAccountChanged();
  });

  async function buyTokens() {
    const response = await provider.Plugins.fiat.buy(
      {},
      { disableTriggers: true, defaultAmount: 10 },
    );

    payment.style.display = 'block';
    payment.src = response.data;
  }

  async function swapTokens() {
    payment.style.display = 'block';
    payment.src = '/swap.html';
  }

  function isValidContact() {
    return (
      firstName &&
      firstName.length > 0 &&
      lastName &&
      lastName.length > 0 &&
      email &&
      email.length > 0
    );
  }

  async function isValidWallet() {
    if (!provider?.User.current()) {
      console.log('wallet check: user not logged in');
      return false;
    }

    await provider.enableWeb3();

    const chainId = await provider?.getChainId();
    if (chainId !== 43114 && chainId !== 43113) {
      console.log('wallet check: wrong chain');
      return false;
    }

    const chainString = chainId === 43114 ? 'avalanche' : 'avalanche testnet';
    const options = { chain: chainString, address: provider.User.current()?.get('ethAddress') };
    const balance = await provider?.Web3API.account.getNativeBalance(options);
    return balance.balance.length > 1;
  }

  async function handleAddAvalanche() {
    // TODO Switch when we deploy to main-net
    // await provider.addNetwork( 43114, "Avalanche Mainnet", "AVAX", "AVAX",
    //     "https://api.avax.network/ext/bc/C/rpc", "https://cchain.explorer.avax.network/"
    // );

    await provider.addNetwork(
      43113,
      'Avalanche Testnet',
      'AVAX',
      'AVAX',
      'https://api.avax-test.network/ext/bc/C/rpc',
      'https://testnet.snowtrace.io/',
    );
  }

  async function handleSubmit() {
    // assuming all validations are true
    mintingNftState = NFT_STATE.MINTING;

    const user = provider.User.current();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.xp = 0;
    user.maxXp = 0;

    tokenMetadata.name = `Membership NFT for ${firstName} ${lastName}`;
    tokenMetadata.description =
      'Dynamic NFT representing owners reputation in "Our Worlds" platform';

    const options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: 'mintToken',
      abi: upgradableAbi,
      params: {
        owner: user.get('ethAddress'),
        metadataURI: `data:text/plain,${encodeURIComponent(JSON.stringify(tokenMetadata))}`,
      },
    };

    const receipt = await provider.executeFunction(options);

    console.log(receipt);

    if (receipt?.status === true) {
      isMember = true;
      user.isMember = true;
      user.save();

      mintingNftState = NFT_STATE.MINTED;
      $currentPage++;
    } else {
      mintingNftState = NFT_STATE.FAILED;
    }
  }
  function shortEthAddress(ethAddress) {
    if (ethAddress) {
      return `${ethAddress.slice(0, 5)}...${ethAddress.slice(-4)}`;
    }
    return null;
  }
</script>

<section id="content">
  {#if $currentPage === 1 && isMember === true}
    <h2>Existing Membership</h2>
    <ul id="membership-benefits">
      <li><Icon {...nftIconProps} /><span>Get your own NFT</span></li>
      <li><Icon {...chatBubbleIconProps} /><span>Join a community</span></li>
      <li><Icon {...giftIconProps} /><span>Get rewarded</span></li>
      <li><Icon {...markerIconProps} /><span>Create Kind Deeds</span></li>
      <li><Icon {...starIconProps} /><span>Track your impact</span></li>
    </ul>
    <p> You're already a member, thank you very much! So what are you waiting for? </p>
    <button on:click="{() => goto('/deeds')}">Find deeds</button>
  {:else if $currentPage === 1}
    <h2>ourworlds<sup>+</sup></h2>
    <p id="membership"> By becoming a member, you will: </p>
    <ul id="membership-benefits">
      <li><Icon {...nftIconProps} /><span>Get your own NFT</span></li>
      <li><Icon {...chatBubbleIconProps} /><span>Join a community</span></li>
      <li><Icon {...giftIconProps} /><span>Get rewarded</span></li>
      <li><Icon {...markerIconProps} /><span>Create Kind Deeds</span></li>
      <li><Icon {...starIconProps} /><span>Track your impact</span></li>
    </ul>
    <p> To take advantage of them, a bit of preparation is needed. </p>
  {:else if $currentPage === 2}
    <h2>We want to get to know you</h2>
    <p>We want to get to know you a bit, please fill in the form below.</p>
    <form title="membership-info">
      <div>
        <label for="firstname">First Name</label>
        <input type="text" id="firstname" bind:value="{firstName}" />
      </div>
      <div>
        <label for="lastname">Last Name</label>
        <input type="text" id="lastname" bind:value="{lastName}" />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" bind:value="{email}" />
      </div>
    </form>
  {:else if $currentPage === 3}
    <h2>Connect your wallet</h2>
    <p>
      Your crypto wallet securely stores your digital goods. Connect to one of our wallet providers
      or create a new one.
    </p>
    <p id="buttons"> First, please connect your wallet with us. </p>
    <button disabled="{$isAuthenticated}" on:click="{() => authStore.connect()}">
      {#if !$isAuthenticated}
        Connect wallet
      {:else}
        Connected
      {/if}
    </button>
    <p id="buttons"> Then, let's switch to the Avalanche chain. </p>
    <button on:click="{handleAddAvalanche}"> Add Avalanche to wallet </button>
  {:else if $currentPage === 4}
    <h2>Fund your wallet</h2>
    <p>
      You are going to need some AVAX tokens to mint your NFT. Don't worry it's not real money just
      test crypto.
    </p>
    <p
      >Click on Copy Wallet Address, followed by Request AVAX. When complete, come back to continue.</p
    >
    <div id="fund_wallet">
      <div id="fund_walletID">
        <Clipboard
          text="{provider?.User.current()?.get('ethAddress')}"
          let:copy
          on:copy="{() => {
            console.log('Has Copied');
          }}"
        >
          <button on:click="{copy}">Copy Wallet Address</button>
        </Clipboard>
      </div>
      <a
        id="avax-faucet"
        href="https://faucet.avax-test.network/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>Request AVAX</button>
      </a>
    </div>

    <!-- TODO Add once we deploy on main-net -->
    <!-- <button on:click={buyTokens}>Buy AVAX tokens</button> -->
    <!-- <button on:click={swapTokens}>Swap AVAX tokens</button> -->
    <!-- <iframe title="buy-fiat-onramp" bind:this={payment}></iframe> -->
  {:else if $currentPage === 5}
    <h2>ourworlds<sup>+</sup></h2>
    <p>
      Now we are going to mint your ourworlds NFT! Please review that your details are correct and
      hit apply.
    </p>
    <dl id="review">
      <dt>Contact</dt>
      {#if isValidContact() === true}
        <dd>{firstName} {lastName}</dd>
        <dd>{email}</dd>
      {:else}
        <dd>
          <span>Not valid</span>
          <button on:click="{() => ($currentPage = 2)}">fix</button>
        </dd>
      {/if}

      <dt>Wallet</dt>
      {#if validWallet}
        <dd>Wallet connected</dd>
        <dd>Funded on Avalanche</dd>
      {:else if validWallet === false}
        <dd>
          <span>Wallet not connected to Avalanche or no funds available</span>
          <button on:click="{() => ($currentPage = 3)}">fix</button>
        </dd>
      {:else}
        <p>...waiting</p>
      {/if}
    </dl>
    <div id="action">
      <button
        on:click="{handleSubmit}"
        disabled="{!isValidContact() || !isValidWallet() || isMember}"
      >
        Apply for ourworlds<sup>+</sup>
      </button>
      {#if mintingNftState == NFT_STATE.MINTING}
        <div>
          <Jellyfish color="{color}" />
        </div>
      {:else if mintingNftState == NFT_STATE.FAILED}
        <p>Transaction failed</p>
      {/if}
    </div>
  {:else if $currentPage === 6}
    <h2>Hooray! You've minted your ourworlds NFT!</h2>
    <img class="confetti" src="../confetti.svg" alt="confetti" width="300px" height="300px" />
    <button on:click="{() => goto('/yourworld')}">Go see your world</button>
  {/if}
</section>
