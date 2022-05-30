<style>
  #grid {
    display: grid;
    grid-template: 280px 40px 115px 28px 1fr 28px 28px / 1fr;
    row-gap: 17px;
    padding-block-start: 90px;
  }

  #action {
    display: flex;
    gap: 15px;

    padding-inline-start: 24px;
    padding-inline-end: 24px;

    justify-content: center;
    align-items: center;
  }

  #action button {
    height: 48px;
    width: fit-content;
    min-width: 162px;

    background-color: #090a0a;
    border-radius: 48px;
    border-style: none;

    font-weight: 500;
    font-size: 16px;
    line-height: 16px;

    color: #ffffff;

    padding-inline-start: 18px;
    padding-inline-end: 18px;
  }

  #action button:disabled {
    background-color: #8a9999;
  }

  aside#chat {
    position: absolute;
    bottom: 70px;
    right: 10px;

    width: 60px;
    height: 60px;
  }

  #participants-container {
    margin-block-start: 9px;
    margin-block-end: 30px;
  }

  ul#participant-list {
    list-style-type: none;
    text-align: center;
    padding-inline-start: 0px;
    margin-inline-start: 15px;
  }

  li.card {
    justify-content: space-between;
  }

  .card button {
    border-radius: 21px;
    background: transparent;
  }

  span + button {
    margin-inline-start: 27px;
  }

  h3 {
    text-align: center;
  }

  p {
    padding-inline-start: 30px;
    padding-inline-end: 30px;
    margin-block-start: 15px;
    margin-block-end: 15px;
    text-align: center;
    align-self: center;
  }

  hr {
    border-top: #f2f4f5 1px solid;
    border-bottom: 0;
  }
</style>

<script>
  import { onMount, onDestroy } from 'svelte';

  import { authStore, isAuthenticated } from '$lib/auth.js';
  import { share } from '$lib/common.js';

  import { getURI, setNewURI } from '$lib/contract.js';

  import Deed from '$lib/moralisobjects/deed';
  import DeedDisplay from '@components/DeedDisplay.svelte';

  import NavBar from '@components/NavBar.svelte';

  import { backIcon, shareIcon } from '$lib/appicons.js';
  import Player from '$lib/moralisobjects/player.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  const deedId = $page.params.id;

  const USERSTATE = Object.freeze({
    user: 'user',
    member: 'member',
    participant: 'participant',
    participating: 'paricipating',
    cannotparticipate: 'cannotparticipate',
    creator: 'creator',
  });

  const props = {
    color: '#979C9E',
    filled: false,
  };

  const backProps = { ...props, ds: backIcon, width: '8', height: '14' };
  const shareProps = { ...props, ds: shareIcon, width: '18', height: '24' };

  let provider;
  let deed = {};
  let participants = [];
  let userState = null;
  let userSubscription;
  const tokens = [];
  const uri = {};

  onMount(async () => {
    provider = window.Moralis;

    const userObject = new Player();
    const userQuery = new provider.Query(userObject);
    userSubscription = await userQuery.subscribe();
    userSubscription.on('update', () => {
      console.log('updated');
      checkUserState();
    });

    if (!$isAuthenticated) {
      try {
        await authStore.connect();
      } catch (error) {
        console.error('Connecting to wallet failed', error);
        return;
      }
    }

    const deedObject = new Deed();
    const deedQuery = new provider.Query(deedObject);
    deedQuery.get(deedId).then(
      (result) => {
        deed = result;
        checkUserState();

        // console.log('deed retrieved', result)
      },
      (error) => {
        console.error('Retrieving deed failed', error);
      },
    );
  });

  onDestroy(() => {
    userSubscription?.unsubscribe();
  });

  async function checkUserState() {
    const user = provider.User.current();
    const creatorQuery = user.relation('createdDeeds').query();
    creatorQuery.equalTo('isActive', true);
    const creator = creatorQuery.find();

    const participant = user.fetch();
    console.log(participant);
    const participatingQuery = new provider.Query(new Player());
    participatingQuery.equalTo('participatingDeed', deed);
    const participating = participatingQuery.find();

    return Promise.all([creator, participant, participating]).then(async (values) => {
      const created = values[0].find((item) => item.id === deedId);
      if (created) {
        userState = USERSTATE.creator;
        getParticipants();
        console.log(userState);
        return;
      }
      // Currently, only one user can participate in a deed
      if (values[2].length > 0 && values[2][0].id !== user.id) {
        userState = USERSTATE.cannotparticipate;
        return;
      }

      const participating = await values[1].participatingDeed?.fetch();
      if (participating?.id === deedId) userState = USERSTATE.participant;
      else if (participating) userState = USERSTATE.participating;
      // Participating in another deed already
      else if (values[1].get('isMember')) userState = USERSTATE.member;
      // Only members can participate
      else userState = USERSTATE.user;

      console.log(userState);
    });
  }

  async function getParticipants() {
    const params = {
      deedObjectId: deed.id,
    };

    participants = await provider.Cloud.run('getDeedParticipants', params);
  }

  function handleDelete() {
    const user = provider.User.current();

    const creatorRelation = user.relation('createdDeeds');
    creatorRelation.remove(deed);
    user.save();

    deed.isActive = false;
    deed.save();

    goto('/deeds');
  }

  async function handleCancel() {
    const user = provider.User.current();
    user.unset('isRequestingCompletion');
    user.unset('participatingDeed');
    user.save();

    const relation = deed.relation('participants');
    relation.remove(user);
    deed.save();

    goto('/deeds');
  }

  async function handleParticipate() {
    const user = provider.User.current();

    await user.fetch();

    if (!user.participatingDeed) {
      user.participatingDeed = deed;
      user.isRequestingCompletion = false;
      user.save();
      const relation = deed.relation('participants');
      relation.add(user);
      deed.save();

      goto('/deeds');
    }
  }

  async function handleParticipantRequest() {
    console.log('completing deed');
    const user = provider?.User.current();

    await user.fetch();

    if (!user.isRequestingCompletion) {
      user.isRequestingCompletion = true;
      user.save();
    }
  }

  async function levelUpParticipant(participantEthAddress) {
    try {
      let r = await getURI(uri, tokens, participantEthAddress);
      r = await setNewURI(r.uri, r.tokens);
      // it seems that we do not have sufficient permissions to sign
      // the set the new token URI for the participant
      console.log(`Updated ${participantEthAddress} metadata to`);
      console.log(r.uri);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function handleDeedCompletion(participant) {
    console.log('deed completion');

    try {
      const success = await levelUpParticipant(participant.get('ethAddress'));
      if (success === true) {
        console.log('success!');
        const params = {
          participantObjectId: participant.get('id'),
        };

        participants = await provider.Cloud.run('resetIsRequestingCompletion', params);
      } else {
        console.log('Could not level up the participant.');
      }
    } catch (error) {
      console.log(error);
    }
  }
</script>

<NavBar
  on:leftClick="{() => history.back()}"
  leftProps="{backProps}"
  on:rightClick="{() => share({ url: `/deeds/${deedId}` })}"
  rightProps="{shareProps}"
  fixed="{true}"
/>

<section id="grid">
  <DeedDisplay deed="{deed}" />

  <div id="action">
    {#if userState === USERSTATE.cannotparticipate}
      <button disabled>Deed is taken</button>
    {:else if userState === USERSTATE.participating}
      <button disabled>You can only participate in one deed</button>
    {:else if userState === USERSTATE.creator}
      <button on:click="{handleDelete}">Delete</button>
    {:else if userState === USERSTATE.participant}
      <button on:click="{handleCancel}">Cancel</button>
      <button style="background-color: #79C679" on:click="{handleParticipantRequest}">
        Complete Deed</button
      >
    {:else if userState === USERSTATE.member}
      <!-- user can participate in one deed at a time only-->
      <button disabled="{userState === USERSTATE.participating}" on:click="{handleParticipate}"
        >Participate</button
      >
    {:else}
      <button on:click="{() => goto('/wizards/membership')}">Apply for membership</button>
    {/if}
  </div>

  <hr />

  {#if userState === USERSTATE.creator}
    <div id="participants-container">
      <h3>Current Participants</h3>
      <p>
        When the user request to compelte the deed, please confirm if they have completed the
        required steps.
      </p>
      <ul id="participant-list">
        {#if participants.length > 0}
          {#each participants as participant}
            <li class="card" data-id="{deed.id}">
              <span class="p-name">{participant.firstName} {participant.lastName}</span>
              <button
                disabled="{!participant.isRequestingCompletion}"
                on:click="{() => {
                  handleDeedCompletion(participant);
                }}"
              >
                <span>✔️</span>
              </button>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  {/if}
</section>

{#if deed?.allowChat}
  <aside id="chat">
    <img src="/chat.png" alt="speech bubbles" on:click="{() => goto(`/chat/${deedId}`)}" />
  </aside>
{/if}
