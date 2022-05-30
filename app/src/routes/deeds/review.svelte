<style>
  #grid {
    display: grid;
    grid-template: 280px 40px 115px 28px 1fr 28px 28px / 1fr;
    row-gap: 17px;
  }

  #action {
    display: flex;
    justify-content: space-between;
    gap: 10px;

    padding-inline: 24px;
  }

  #action button {
    flex-grow: 1;

    height: 48px;

    background-color: #4cd571;
    border-radius: 48px;

    font-weight: 500;
    font-size: 16px;
    line-height: 16px;

    border: 0;
    color: #ffffff;
  }

  #action #edit {
    background-color: #ff5247;
  }

  #action #create:disabled {
    background-color: #72d78d;
  }

  #message {
    justify-self: center;
  }

  #loader {
    justify-self: center;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import Deed from '$lib/moralisobjects/deed.js';
  import DeedDisplay from '@components/DeedDisplay.svelte';

  import { Jellyfish } from 'svelte-loading-spinners';

  import { authStore, isAuthenticated } from '$lib/auth.js';

  import { tempDeed } from '$lib/stateStore.js';

  const color = 'black';

  let provider;
  let message = '';

  $: loading = false;

  onMount(async () => {
    provider = window.Moralis;
  });

  function handleEdit() {
    $tempDeed.keep = true;
    goto('/deeds/create');
  }

  async function handleCreate() {
    message = 'Deed is being created. Please be patient...';
    loading = true;

    if (!$isAuthenticated) {
      try {
        await authStore.connect();
      } catch (error) {
        console.error('Connecting to wallet failed', error);
        return;
      }
    }

    if ($tempDeed.cover) {
      const file = new provider.File($tempDeed.cover.item(0).name, $tempDeed.cover.item(0));
      try {
        await file.saveIPFS();
        $tempDeed.pictures = file;
      } catch (error) {
        throw new Error(`creating deed failed, ${error}`);
      }
    }

    // temporary flags
    delete $tempDeed.keep;
    delete $tempDeed.cover;

    console.log($tempDeed);

    const stored = await $tempDeed.save();

    console.log(stored);

    const userRelation = provider.User.current().relation('createdDeeds');
    console.log(userRelation);
    userRelation.add($tempDeed);
    await provider.User.current().save();

    console.log('New deed stored', stored);
    $tempDeed = new Deed();
    loading = false;

    goto('/deeds');
  }

  function isValidDeed() {
    if ($tempDeed?.title.length === 0) {
      message = 'Title is empty';
      return false;
    }

    if ($tempDeed?.description.length === 0) {
      message = 'Description is empty';
      return false;
    }

    if ($tempDeed?.category.length === 0) {
      message = "Category isn't set";
      return false;
    }

    if ($tempDeed?.address.length === 0) {
      message = "Address isn't set";
      return false;
    }

    if (!$tempDeed.timeframe || $tempDeed.timeframe.start.length === 0) {
      message = "Start time isn't set";
      return false;
    }

    return true;
  }
</script>

<section id="grid">
  <DeedDisplay deed="{$tempDeed}" />
  <div id="action">
    <button id="edit" on:click="{handleEdit}" disabled="{loading}">Edit</button>
    <button
      id="create"
      on:click="{handleCreate}"
      disabled="{!isValidDeed() || message?.length > 0 || loading}">Create</button
    >
  </div>

  {#if message.length > 0}
    <p id="message">{message}</p>
  {/if}

  {#if loading}
    <div id="loader">
      <Jellyfish color="{color}" />
    </div>
  {/if}
</section>
