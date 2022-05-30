<style>
  section {
    padding-block-start: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    height: 100vh;
    bottom: 0px;
  }
  section #map-container {
    flex-grow: 1;
  }
  #search {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-self: end;
    align-items: center;
    gap: 10px;
    background: #f2f4f5;
    width: 50vw;
    height: 48px;
    padding-inline-end: 20px;
    padding-inline-start: 10px;

    border: 0;
    border-radius: 48px;

    margin: 0;

    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
  }
  #search input {
    flex-grow: 2;
    width: 16vw;
    height: 35px;
    background: #f2f4f5;
    padding-inline-start: 10px;
    border: none;
  }
  #search input:active {
    border-color: springgreen;
  }
  #deeds-container {
    position: relative;
    bottom: 0;
    overflow-y: hidden;
    overflow-x: auto;
    z-index: 10000;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import Deed from '$lib/moralisobjects/deed';
  import Map from '@components/Map.svelte';
  import Slider from '@components/Slider.svelte';
  import NavBar from '@components/NavBar.svelte';
  import Icon from '@components/Icon.svelte';
  import { backIcon, sprocketIcon, searchIcon, filterIcon } from '$lib/appicons.js';
  import BottomSheet from '@components/BottomSheet.svelte';

  const props = {
    color: '#979C9E',
    filled: false,
    width: '24',
    height: '24',
  };

  const searchProps = { ...props, ds: searchIcon, color: '#090A0A' };
  const backProps = { ...props, ds: backIcon, width: '8', height: '14' };
  const sprocketProps = { ...props, ds: sprocketIcon };
  const filterProps = { ...props, ds: filterIcon };

  let mapComponent, deedsComponent;
  let provider;
  let open = true;
  let deedList = [];

  onMount(() => {
    provider = window.Moralis;
  });

  async function setDeeds() {
    const deedObject = new Deed();
    const query = new provider.Query(deedObject);
    try {
      deedList = await query.find();
      if (deedList.length > 0) {
        mapComponent.setDeeds(deedList);
      }
    } catch (error) {
      console.error('Retrieving deed failed', error);
    }
  }

  function handleSearch(event) {
    if (event.keyCode === 13) {
      // TODO: Should be a cloud function to hide auth key
      fetch(`https://geocode.xyz/${event.target.value}?json=1&auth=622585789648730666409x45089`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not OK: ' + response.status);
          }
          return response.json();
        })
        .then(async (data) => {
          await searchDeeds(data.latt, data.longt);
        })
        .catch((error) => console.error('Forward geocoding failed', error));
    }
  }
  async function searchDeeds(lat, lon) {
    const deedObject = new Deed();
    const query = new provider.Query(deedObject);

    const geoPoint = new provider.GeoPoint();
    geoPoint.latitude = Number.parseFloat(lat);
    geoPoint.longitude = Number.parseFloat(lon);
    query.near('coordinates', geoPoint, { maxDistance: 50 });

    query.limit(20);

    try {
      let result = await query.find();
      if (result.length > 0) {
        deedList = result;
        mapComponent.setDeeds(deedList);
      }
    } catch (error) {
      console.error('Retrieving deed failed', error);
    }
  }

  function handleFilters() {}
</script>

<NavBar on:leftClick="{() => goto('/deeds/')}" leftProps="{backProps}" fixed="{true}">
  <div id="search">
    <input placeholder="Search" on:keypress="{(event) => handleSearch(event)}" />
    <Icon {...searchProps} />
  </div>
</NavBar>
<!--suppress CheckTagEmptyBody -->
<section>
  <div id="map-container">
    <Map bind:this="{mapComponent}" on:loaded="{setDeeds}" />
  </div>
  <div id="deeds-container">
    <Slider bind:deedList on:deedClick="{(event) => goto(`/deeds/${event.detail.id}`)}" />
  </div>
</section>
