<style>
  section {
    padding-block-end: 80px;
  }

  section #title {
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;

    color: #090a0a;
  }

  section #empty-container {
    display: grid;
    padding-block-start: 85px;
    grid-template-rows: 350px 60px 75px;
    justify-items: center;
    align-items: center;
  }
  #login-container {
    display: grid;
    padding-block-start: 85px;
    grid-template-rows: 350px 60px 75px;
    justify-items: center;
    align-items: center;
  }

  #deeds-container {
    margin-inline: 24px;
    margin-block-end: 30px;
    padding-block-start: 80px;
  }

  #deeds-container h2 {
    margin-block-start: 15px;
    margin-block-end: 15px;
  }

  #deeds-container #activecover,
  #deeds-container #inactivecover {
    height: 141px;
    border-radius: 16px;
  }

  #deeds-container .title {
    height: 16px;

    margin-block: 5px;

    font-weight: bold;
    font-size: 16px;
    line-height: 16px;

    color: #090a0a;
  }

  #deeds-container .startdatetime {
    height: 16px;

    margin-block-end: 20px;

    font-size: 12px;
    line-height: 16px;

    color: #6c7072;
  }

  section #info {
    align-self: start;

    padding-inline-start: 80px;
    padding-inline-end: 80px;

    font-size: 14px;
    line-height: 20px;

    color: #090a0a;
  }

  #action {
    display: flex;
    gap: 15px;
    flex-direction: column;
    align-items: center;
  }

  #action button {
    width: 250px;
    height: 48px;

    background: #79c679;
    border-radius: 48px;
    border: 0;

    font-weight: 500;
    font-size: 16px;
    line-height: 16px;

    color: white;
  }

  #action #search {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;

    background-color: #090a0a;
  }

  .log-button {
    width: 100px;
    height: 35px;

    background: #7434b2;
    border-radius: 48px;
    border: 0;

    font-weight: 500;
    font-size: 16px;
    line-height: 16px;

    color: white;
  }
</style>

<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import Deed from '$lib/moralisobjects/deed.js';

  import Footer from '@components/Footer.svelte';
  import NavBar from '@components/NavBar.svelte';
  import Slider from '@components/Slider.svelte';
  import MainIcon from '@components/MainIcon.svelte';
  import { authStore, isAuthenticated, user } from '$lib/auth.js';

  import { globeIcon, markerIcon, searchIcon, userIcon } from '$lib/appicons.js';
  import Icon from '@components/Icon.svelte';

  const props = {
    color: '#979C9E',
    filled: false,
    width: '24',
    height: '24',
  };

  const searchProps = { ...props, ds: searchIcon };
  const leftProps = { ...props, ds: globeIcon };
  const midProps = { ...props, ds: markerIcon, color: '#6B4EFF' };
  const rightProps = { ...props, ds: userIcon };
  let loggedIn = false;
  let provider;
  let activeDeed = null;
  let deedsCreated = [];

  onMount(() => {
    provider = window.Moralis;
    if (provider.User?.current() !== null) loggedIn = true;
    if (loggedIn) {
      searchActiveDeed();
      searchDeedsCreated();
    }
  });

  function searchActiveDeed() {
    if (provider.User?.current()) {
      provider.User.current()
        .fetch()
        .then((user) => user.participatingDeed?.fetch())
        .then((deed) => (activeDeed = deed));
    }
  }

  function searchDeedsCreated() {
    if (provider.User?.current()) {
      const user = provider.User.current();
      console.log(user);
      const query = user.relation('createdDeeds').query();
      query.equalTo('isActive', true);
      query.find().then((deed) => (deedsCreated = deed));
    }
  }

  function searchDeedsAtLocation(lat, lon) {
    const deedObject = new Deed();
    const query = new provider.Query(deedObject);

    const geoPoint = new provider.GeoPoint();
    geoPoint.latitude = Number.parseFloat(lat);
    geoPoint.longitude = Number.parseFloat(lon);
    query.near('coordinates', geoPoint, { maxDistance: 5000 });

    query.limit(20);

    query
      .find()
      .then((result) => {
        deedsCreated = result;
      })
      .catch((error) => {
        console.error('Retrieving deed failed', error);
      });
  }

  function handleLogin() {
    authStore.connect();
  }

  function handleLogout() {
    authStore.disconnect();
    goto('/');
  }
</script>

<NavBar fixed="{true}">
  <h1>Explore</h1>
  {#if loggedIn}
    <button class="log-button" on:click="{handleLogout}"> Log out </button>
  {:else}
    <button class="log-button" on:click="{handleLogin}"> Log in </button>
  {/if}
</NavBar>

<section>
  {#if loggedIn === true}
    {#if activeDeed || deedsCreated.length !== 0}
      <div id="deeds-container">
        {#if activeDeed}
          <h2>Active Deed</h2>
          <img
            on:click="{() => goto(`/deeds/${activeDeed.id}`)}"
            id="activecover"
            src="{activeDeed.pictures ? activeDeed.pictures.ipfs() : '/inactivedeed.jpg'}"
            alt="deed cover"
          />
          <p class="title">{activeDeed.title}</p>
          <p class="startdatetime">{activeDeed.timeframe.start}</p>
        {:else}
          <h2>No Active Deed</h2>
          <img id="inactivecover" src="/inactivedeed.jpg" alt="deed cover" />
          <p class="title">&nbsp;</p>
          <p class="startdatetime">&nbsp;</p>
        {/if}

        {#if deedsCreated?.length > 0}
          <h2>Created Deeds</h2>
          <Slider
            bind:deedList="{deedsCreated}"
            on:deedClick="{(event) => goto(`/deeds/${event.detail.id}`)}"
          />
        {/if}
      </div>
    {:else}
      <div id="empty-container">
        <img src="cart.png" alt="shopping cart" />
        <p id="title">No deeds near you</p>
        <p id="info">You can either search for deeds or create one.</p>
      </div>
    {/if}
  {:else}
    <div id="login-container">
      <div id="logo-container">
        <MainIcon height="100px" width="300px" />
      </div>
      <p id="title">Not logged in</p>
      <p id="info">You can either search for deeds or create one.</p>
    </div>
  {/if}

  <div id="action">
    <button id="search" on:click="{() => goto('/deeds/map')}"
      ><Icon {...searchProps} /><span>Discover Deeds</span></button
    >
    <button on:click="{() => goto('/deeds/create')}">Create deed</button>
  </div>
</section>

<Footer on:leftClick="{() => goto('/yourworld')}" leftProps="{leftProps}" midProps="{midProps}" />
<!--on:rightClick={() => goto('/profile')}{rightProps}-->
