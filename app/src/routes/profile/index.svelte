<style>
  section {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    padding-block-start: 80px;
    padding-block-end: 50px;
    height: 100vh;
  }

  #profile-container {
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-rows: 100px 380px;
    /*
        grid-template-rows: 200px 330px 48px 65px;
        
        
        padding-block-start:92px;
        padding-block-end: 100px;
        height: 100vh;*/
  }
  #deeds-container {
    padding-inline-start: 20px;
    padding-inline-end: 20px;
  }
  .chart {
    position: relative;
    width: 100%;
    height: 300px;
    margin: 0 0 36px 0;
  }

  .background,
  .foreground {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 2em 1.5em 2em 1.5em;
    box-sizing: border-box;
  }

  .column {
    position: absolute;
    left: 0;
    width: 100%;
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    border-right: 1px solid rgba(255, 255, 255, 0.4);
    box-sizing: border-box;
    height: 100%;
    opacity: 0.6;
    border-radius: 2px 2px 0 0;
    background-color: #1f77b4;
  }

  .label {
    position: absolute;
    font-size: 12px;
    color: rgb(0, 0, 0);
    line-height: 1;
    white-space: nowrap;
  }

  .x.label {
    width: 4em;
    left: -2em;
    bottom: 21px;
    text-align: start;
  }

  .foreground .x.label {
    inset-block-end: -22px;
  }

  .background .x.label {
    transform: rotate(-90deg);
  }

  #chart-section {
    display: flex;
    align-items: flex-start;
    justify-items: center;
  }

  .grid-line.horizontal {
    position: relative;
    display: block;
    width: calc(100% + 2em);
    left: -2em;
    border-bottom: 1px dashed #ccc;
  }

  .grid-line span {
    position: absolute;
    left: 0;
    bottom: 2px;
    font-family: sans-serif;
    font-size: 14px;
    color: #999;
  }

  .x-label {
    position: absolute;
    width: 4em;
    left: -2em;
    bottom: -22px;
    font-family: sans-serif;
    font-size: 14px;
    color: #999;
    text-align: center;
  }

  path.data {
    stroke: rgba(0, 0, 0, 0.2);
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 1px;
    fill: none;
  }

  .annotation {
    position: absolute;
    white-space: nowrap;
    bottom: 1em;
    line-height: 1.2;
    /* background-color: rgba(255,255,255,0.9); */
    padding: 0.2em 0.4em;
    border-radius: 6px;
  }

  .annotation-point {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #decbf3;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<script>
  import * as Pancake from '@sveltejs/pancake';
  import { onMount } from 'svelte';

  import NavBar from '@components/NavBar.svelte';
  import Footer from '@components/Footer.svelte';
  import Slider from '@components/Slider.svelte';
  import { Tabs, TabList, TabPanel, Tab } from '@components/Tabs/tabs.js';

  import { globeIcon, markerIcon, userIcon } from '$lib/appicons.js';
  import { authStore, isAuthenticated, user } from '$lib/auth.js';
  import { goto } from '$app/navigation';

  let provider;
  let closest;
  let pastDeeds = [];

  const zeroAddress = `0x${range(0, 32)
    .map(() => '0')
    .join('')}`;

  $: ethAddress = $isAuthenticated ? $user.get('ethAddress') : zeroAddress;

  const props = {
    color: '#979C9E',
    filled: false,
    width: '24',
    height: '24',
  };

  const leftProps = { ...props, ds: globeIcon };
  const midProps = { ...props, ds: markerIcon };
  const rightProps = { ...props, ds: userIcon, color: '#6B4EFF' };

  const months = 'Jan Feb Mar Apr May June July Aug Sept Oct Nov Dec'.split(' ');
  const data_range = range(1, 12);
  // use https://stackoverflow.com/questions/6451655/how-to-convert-python-datetime-dates-to-decimal-float-years
  // to convert datetime to indexable value
  const data_impact = data_range.map((d) => ({
    x: d,
    y: d * (0.3 + Math.random()),
  }));
  const data_rewards = data_range.map((d) => ({
    x: d,
    y: d * (0.3 + Math.random()),
  }));
  const data_xp = data_range.map((d) => ({
    x: d,
    y: d * (0.3 + Math.random()),
  }));

  onMount(() => {
    provider = window.Moralis;
    console.log($isAuthenticated);
    searchPastDeeds();
  });

  function range(a, b, step = 1) {
    const array = [];
    for (; a <= b; a += step) array.push(a);
    return array;
  }

  function shortEthAddress(ethAddress) {
    return `${ethAddress.slice(0, 5)}...${ethAddress.slice(-4)}`;
  }

  async function searchPastDeeds() {
    if (provider.User?.current()) {
      const user = provider.User.current();
      const query = user.relation('pastDeeds').query();
      console.log(query);
      try {
        const result = await query.find();
        console.log(result);
        if (result.length > 0) {
          pastDeeds = result;
        }
      } catch (error) {
        console.error('Retrieving deed failed', error);
      }
    }
  }

  function handleLogin() {
    authStore.connect();
    console.log(isAuthenticated);
  }

  function handleLogout() {
    authStore.disconnect();
    pastDeeds = null;
  }
</script>

<NavBar fixed="{true}">
  <h1 id="navbar">Profile</h1></NavBar
>

<section>
  <div id="profile-container">
    <div id="header">
      <h2>
        Gm, {shortEthAddress(ethAddress)}
      </h2>
    </div>
    <div id="chart-section">
      <Tabs>
        <TabList>
          <Tab>Impact</Tab>
          <Tab>Rewards</Tab>
          <Tab>XP</Tab>
        </TabList>
        <TabPanel>
          <div class="chart impact">
            <div class="background">
              <Pancake.Chart x1="{0}" x2="{13}" y1="{0}" y2="{15}" clip>
                <Pancake.Columns data="{data_impact}" width="{1}">
                  <div class="column"></div>
                </Pancake.Columns>
                <Pancake.Grid vertical ticks="{data_range}" let:value>
                  <span class="x label">{months[value - 1]}</span>
                </Pancake.Grid>
              </Pancake.Chart>
            </div>
            <div class="foreground">
              <Pancake.Chart x1="1" x2="13" y1="0" y2="15">
                <Pancake.Grid vertical count="{13}" let:value>
                  {#if value === 7}
                    <span class="x label">Months</span>
                  {/if}
                </Pancake.Grid>
              </Pancake.Chart>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="chart rewards">
            <Pancake.Chart x1="{0}" x2="{13}" y1="{0}" y2="{15}">
              <Pancake.Grid horizontal count="{5}" let:value>
                <div class="grid-line horizontal">
                  <span>{value}</span>
                </div>
              </Pancake.Grid>

              <Pancake.Grid vertical count="{5}" let:value>
                <span class="x-label">{value}</span>
              </Pancake.Grid>

              <Pancake.Svg>
                <Pancake.SvgLine data="{data_rewards}" let:d>
                  <path class="data" d="{d}"></path>
                </Pancake.SvgLine>
              </Pancake.Svg>

              {#if closest}
                <Pancake.Point x="{closest.x}" y="{closest.y}">
                  <span class="annotation-point"></span>
                  <div class="annotation">
                    <strong>{closest.x}: {closest.y}</strong>
                  </div>
                </Pancake.Point>
              {/if}

              <Pancake.Quadtree data="{data_rewards}" bind:closest />
            </Pancake.Chart>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="chart xp">
            <Pancake.Chart x1="{0}" x2="{13}" y1="{0}" y2="{15}">
              <Pancake.Grid horizontal count="{5}" let:value>
                <div class="grid-line horizontal">
                  <span>{value}</span>
                </div>
              </Pancake.Grid>

              <Pancake.Grid vertical count="{5}" let:value>
                <span class="x-label">{value}</span>
              </Pancake.Grid>

              <Pancake.Svg>
                <Pancake.SvgLine data="{data_xp}" let:d>
                  <path class="data" d="{d}"></path>
                </Pancake.SvgLine>
              </Pancake.Svg>

              {#if closest}
                <Pancake.Point x="{closest.x}" y="{closest.y}">
                  <span class="annotation-point"></span>
                  <div class="annotation">
                    <strong>{closest.x}: {closest.y}</strong>
                  </div>
                </Pancake.Point>
              {/if}

              <Pancake.Quadtree data="{data_xp}" bind:closest />
            </Pancake.Chart>
          </div>
        </TabPanel>
      </Tabs>
    </div>
    {#if $isAuthenticated}
      <button on:click="{handleLogout}"> Log out </button>
    {:else}
      <button on:click="{handleLogin}"> Log in </button>
    {/if}
  </div>
  {#if pastDeeds?.length > 0}
    <div id="deeds-container">
      <h2>Past Deeds</h2>
      <Slider
        bind:deedList="{pastDeeds}"
        on:deedClick="{(event) => goto(`/deeds/${event.detail.id}`)}"
        columnOrientation="true"
      />
    </div>
  {/if}
</section>

<Footer
  on:leftClick="{() => goto('/yourworld')}"
  on:midClick="{() => goto('/deeds')}"
  leftProps="{leftProps}"
  midProps="{midProps}"
  rightProps="{rightProps}"
/>
