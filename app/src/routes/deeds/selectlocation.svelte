<style>
  #info {
    padding: 20px;
    display: flex;
    z-index: 4;
    flex-direction: column;
    width: 100%;
    background-color: white;
    gap: 5px;
  }

  #info div:first-child {
    display: flex;
    gap: 5px;
  }

  #content-container {
    padding-block-start: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    height: 100vh;
    bottom: 0px;
  }

  #map {
    flex-grow: 1;
  }

  .input {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    align-content: center;

    color: #72777a;
  }

  .input input {
    height: 48px;

    padding-inline-start: 10px;

    border: 1px solid #e3e5e6;
    border-radius: 8px;

    font-size: 16px;
    line-height: 16px;
  }

  .input label {
    width: fit-content;

    margin-inline-start: 20px;
    margin-block-end: -16px;
    padding-inline: 2px;

    background-color: white;
    z-index: 5;
  }

  #save {
    position: fixed !important;
    left: 50%;
    transform: translate(-50%, -48px) !important;
    bottom: 20px;
    z-index: 10;
  }

  #save button {
    width: 170px;
    height: 48px;
    background: black;
    border-radius: 48px;
    border: 0;

    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    color: white;
    border-color: transparent;
  }
</style>

<script>
  import { onMount } from 'svelte';

  import Map from '@components/Map.svelte';
  import NavBar from '@components/NavBar.svelte';

  import { tempDeed } from '$lib/stateStore.js';
  import { backIcon } from '$lib/appicons.js';
  import { goto } from '$app/navigation';

  const props = {
    color: '#979C9E',
    filled: false,
    width: '24',
    height: '24',
  };

  const decimals = (number, decimals) => Number.parseInt(number * 10 ** decimals) / 10 ** decimals;

  const backProps = { ...props, ds: backIcon, width: '8', height: '14' };

  let mapComponent;
  let provider;

  let addressValue = '';
  let latitude = '';
  let longitude = '';

  onMount(() => {
    provider = window.Moralis;

    addressValue = $tempDeed.address;
    latitude = $tempDeed.lat;
    longitude = $tempDeed.long;
  });

  function handleMapClick(event) {
    latitude = decimals(event.detail.lat, 4);
    longitude = decimals(event.detail.lng, 4);
  }

  function handleSave() {
    $tempDeed.address = addressValue;
    $tempDeed.coordinates.latitude = latitude;
    $tempDeed.coordinates.longitude = longitude;

    $tempDeed.keep = true;
    goto('/deeds/create');
  }
</script>

<NavBar on:leftClick="{() => history.back()}" leftProps="{backProps}" />
<div id="content-container">
  <section id="info">
    <h3>Input address or place marker</h3>
    <div>
      <div class="input">
        <label for="address">Address</label>
        <input id="address" bind:value="{addressValue}" />
      </div>
    </div>
    <div>
      <div>
        <label for="latitude">Lat</label>
        <input bind:value="{latitude}" type="number" id="latitude" step=".00001" />
      </div>
      <div>
        <label for="lognitude">Lon</label>
        <input bind:value="{longitude}" type="number" id="lognitude" step="0.00001" />
      </div>
    </div>
  </section>
  <Map id="map" bind:this="{mapComponent}" on:mapClick="{handleMapClick}" />
</div>
<div id="save">
  <button on:click="{handleSave}">Save</button>
</div>
