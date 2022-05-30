<style>
  section {
    display: grid;
    height: 100vh;

    grid-template-rows: 125px 160px 1fr 48px 150px;
    align-items: end;
    justify-items: center;

    background: linear-gradient(to top, #7434b2, #7434b2 20%, rgb(20, 20, 20), rgb(20, 20, 20));
  }

  #title {
    color: white;

    font-weight: 600;
    font-size: 24px;
    line-height: 16px;

    letter-spacing: -0.04em;
  }

  #subtitle {
    width: 327px;

    color: white;
    text-align: center;

    font-weight: bold;
    font-size: 32px;
    line-height: 36px;
  }

  #logo {
    width: 220px;
    height: 220px;

    align-self: center;
  }

  #actions {
    align-self: center;
    text-align: center;
  }

  #start,
  #firststart,
  #skip,
  #member {
    background: #ffffff;
    border-radius: 48px;

    width: 325px;
    height: 55px;

    font-weight: 500;
    font-size: 16px;
    line-height: 16px;

    color: #090a0a;

    margin-block-start: 9px;
  }

  #firststart {
    border-radius: 48px 0 0 48px;
    width: 255px;
  }

  #skip {
    border-radius: 0 48px 48px 0;
    width: 70px;
  }

  #logo-container {
    position: relative;
    display: inline-block;
  }
</style>

<script>
  import { onMount } from 'svelte';

  import MainIcon from '@components/MainIcon.svelte';
  import { goto } from '$app/navigation';

  const firstTimeToken = 'intro_done';
  const firstTime =
    !localStorage.getItem(firstTimeToken) || localStorage.getItem(firstTimeToken) === 'false';

  let provider;

  onMount(() => {
    provider = window.Moralis;
  });

  function skipIntro() {
    localStorage.setItem(firstTimeToken, 'true');
    goto('/deeds');
  }
</script>

<section>
  <!--<h1 id="title">ourworlds</h1>-->
  <div id="logo-container">
    <MainIcon height="100px" width="200px" />
  </div>
  <h2 id="subtitle">Turning kind deeds into freedom</h2>
  <img src="ourworlds_transparent.png" id="logo" alt="stylized globe with house and garden" />

  <div id="actions">
    {#if !firstTime && !provider?.User.current()?.isMember}
      <button id="member" on:click="{() => goto('/wizards/membership')}">Become a member</button>
    {/if}
    {#if firstTime}
      <button id="firststart" class:firstTime on:click="{() => goto('/wizards/intro')}"
        >Introduction</button
      >
      <button id="skip" on:click="{skipIntro}">skip</button>
    {:else}
      <button id="start" class:firstTime on:click="{() => goto('/deeds')}">
        {localStorage.getItem('intro_done') ? "Let's continue" : "Let's get started"}
      </button>
    {/if}
  </div>
</section>
