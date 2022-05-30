<style>
  hr {
    height: 1px;

    border: 1px solid #f2f4f5;
  }
  section {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: stretch;
    gap: 20px;

    margin-block-end: 50px;
    padding-block-start: 100px;
    padding-inline-start: 20px;
    padding-inline-end: 20px;
  }

  #category {
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #category button {
    display: grid;
    justify-items: center;
    align-items: center;
    border: 0;
    background-color: transparent;
    border-radius: 15px;
  }

  #category button:hover {
    cursor: pointer;
  }

  #category-label {
    display: flex;
    flex-direction: column;
  }

  #category-label span:first-child {
    font-weight: 700;
  }

  #category-label span:nth-child(2) {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #72777a;
  }

  #category-menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding-left: 0;
  }

  #category-menu button {
    width: 40vh;
    height: 48px;
    border: 0;
    background-color: transparent;
    border-bottom: 0.5px solid gray;
    text-align: left;
  }

  .input,
  .location,
  .area {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    align-content: center;

    color: #72777a;
  }

  .list button {
    border: 0;
    background-color: white;
  }

  .input input,
  .location button,
  .upload label,
  .area textarea,
  .list dt button,
  #action {
    height: 48px;

    padding-inline-start: 10px;

    border: 1px solid #e3e5e6;
    border-radius: 8px;

    font-size: 16px;
    line-height: 16px;
  }

  .input #startdate {
    width: 100%;
    background-color: white;
  }

  .upload input {
    position: absolute;
    left: -10000px;
  }

  .location button {
    display: flex;
    align-items: center;
    gap: 10px;

    background-color: white;
  }

  #action {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;

    margin-block-start: 50px;
    margin-block-end: 50px;
    padding: 0;

    background-color: white;
  }

  #action button {
    height: inherit;
    border-radius: inherit;

    font-weight: 700;

    border: 0;
    background-color: #8d76ff;
  }

  .area textarea {
    height: 170px;
    padding: 10px;
  }

  .upload label,
  .list dt button,
  .list dd {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-weight: 700;

    border: 0;
  }

  .list dd {
    margin-block-end: 5px;
  }

  .input label,
  .location label,
  .area label {
    width: fit-content;

    margin-inline-start: 20px;
    margin-block-end: -12px;
    padding-inline: 2px;

    background-color: white;
    z-index: 5;
  }

  .list dt button {
    width: 100%;
  }

  .list dd input {
    flex-grow: 2;

    height: 36px;
    font-weight: normal;
    border: 1px solid #e3e5e6;
  }
</style>

<script>
  import { onMount } from 'svelte';

  import { tempDeed } from '$lib/stateStore.js';

  import Deed from '$lib/moralisobjects/deed.js';

  import NavBar from '@components/NavBar.svelte';
  import Switch from '@components/Switch.svelte';

  import { crossIcon, downIcon, upIcon, markerIcon, plusIcon, minusIcon } from '$lib/appicons.js';
  import Icon from '@components/Icon.svelte';
  import { goto } from '$app/navigation';

  let provider;
  let showMenu = false;

  let categoryTitles;

  const props = {
    color: 'black',
    filled: false,
    width: '24',
    height: '24',
  };

  const crossProps = { ...props, ds: crossIcon };
  const downProps = { ...props, ds: downIcon };
  const upProps = { ...props, ds: upIcon };
  const markerProps = { ...props, ds: markerIcon };
  const plusProps = { ...props, ds: plusIcon };
  const minusProps = { ...props, ds: minusIcon, color: '#FF5247' };

  onMount(async () => {
    provider = window.Moralis;

    const rows = await provider.Cloud.run('sortedCategories');
    categoryTitles = rows.map((row) => row.title);

    // keep is set to true in selectlocation to make sure the deed is kept to make it possible
    // to continue editing from the state before selectlocation was opened
    if ($tempDeed === null || $tempDeed.keep === false) {
      $tempDeed = new Deed();
    }

    $tempDeed.keep = false;
  });

  function handleCategory(c) {
    $tempDeed.category = c;
    showMenu = false;
  }

  function handleSteps(event) {
    const { target } = event;

    if (
      target.dataset.action === '+' ||
      target.parentElement.dataset.action === '+' ||
      target.parentElement.parentElement.dataset.action === '+' ||
      event.key === 'Enter'
    ) {
      $tempDeed.steps = [...$tempDeed.steps, ''];
    } else if (event.target.parentElement.dataset.action === '-') {
      const toDelete = event.target.parentElement.parentElement.dataset.index;
      if (toDelete !== undefined) {
        $tempDeed.steps.splice(parseInt(toDelete), 1);
        $tempDeed.steps = [...$tempDeed.steps];
      }
    } else if (event.target.parentElement.parentElement.dataset.action === '-') {
      const toDelete = event.target.parentElement.parentElement.parentElement.dataset.index;
      if (toDelete !== undefined) {
        $tempDeed.steps.splice(parseInt(toDelete), 1);
        $tempDeed.steps = [...$tempDeed.steps];
      }
    }
  }

  function submitStep(event) {
    if (event.key === 'Enter') {
      handleSteps(event);
    }
  }
</script>

<NavBar on:leftClick="{() => goto('/deeds')}" leftProps="{crossProps}" fixed="{true}" />

<section>
  <div id="category" on:click="{() => (showMenu = !showMenu)}">
    <label id="category-label" for="category">
      <span>Category</span>
      <span>{$tempDeed.category}</span>
    </label>
    <button>
      {#if showMenu === false}
        <Icon {...downProps} />
      {:else}
        <Icon {...upProps} />
      {/if}
    </button>
  </div>
  {#if showMenu === true}
    <ul id="category-menu">
      {#each categoryTitles as title}
        <button on:click="{() => handleCategory(title)}">
          <span>{title}</span>
          <span id="radio-button"></span>
        </button>
      {/each}
    </ul>
  {/if}

  <div class="input">
    <label for="title">Title</label>
    <input id="title" bind:value="{$tempDeed.title}" />
  </div>
  <hr />

  <div class="location">
    <label for="location">Location</label>
    <button id="location" on:click="{() => goto('/deeds/selectlocation')}">
      <Icon {...markerProps} />
      <span
        >{$tempDeed.address
          ? `${$tempDeed.coordinates.latitude}, ${$tempDeed.coordinates.longitude}`
          : 'Tap to set location'}</span
      >
    </button>
  </div>
  <div class="upload">
    <label for="picture">
      <span>{$tempDeed.cover ? $tempDeed.cover.item(0).name : 'Set cover image'}</span>
      <Icon {...plusProps} />
    </label>
    <input id="picture" type="file" bind:files="{$tempDeed.cover}" />
  </div>
  <div class="area">
    <label for="description">Description</label>
    <textarea id="description" bind:value="{$tempDeed.description}"></textarea>
  </div>
  <div class="input">
    <label for="startdate">Start date</label>
    <input id="startdate" type="datetime-local" bind:value="{$tempDeed.timeframe.start}" />
  </div>
  <hr />

  <dl class="list" on:click="{handleSteps}">
    <dt
      ><button data-action="+">
        <span>Steps</span>
        <span><Icon {...plusProps} /></span>
      </button></dt
    >
    {#each $tempDeed.steps as step, index}
      <dd data-index="{index}">
        <input bind:value="{$tempDeed.steps[index]}" on:keydown="{submitStep}" />
        <button data-action="-"><Icon {...minusProps} /></button></dd
      >
    {/each}
  </dl>
  <div>
    <Switch bind:value="{$tempDeed.hasReward}" label="Reward" />
  </div>
  <div>
    <Switch bind:value="{$tempDeed.allowChat}" label="Chat" />
  </div>
  <div id="action">
    <button on:click="{() => goto('/deeds/review')}">Review input</button>
  </div>
</section>
