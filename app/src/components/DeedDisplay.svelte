<style>
  .cover {
    max-height: 281px;

    justify-self: center;

    padding-inline-start: 15px;
    padding-inline-end: 15px;
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

  #category,
  #startdate,
  #reward,
  #address dt {
    display: flex;
    gap: 20px;
    justify-content: center;
    height: 20px;

    font-weight: 500;
    font-size: 16px;
    line-height: 20px;

    color: #090a0a;
  }

  #category span:first-child,
  #startdate span:first-child,
  #reward span:first-child,
  #address dt span:first-child,
  #address dd span:first-child {
    font-weight: 700;
  }

  #address dt {
    height: auto;
  }

  #description {
    width: 78vw;
    height: 115px;
    justify-self: center;

    font-size: 16px;
    line-height: 20px;

    overflow: scroll;

    color: #6c7072;
  }

  #address {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  hr {
    border-top: #f2f4f5 1px solid;
    border-bottom: 0;
  }
</style>

<script>
  export let deed;
</script>

{#if deed.cover}
  <img class="cover" src="{URL.createObjectURL(deed.cover[0])}" alt="Deed cover" />
{:else if deed.pictures}
  <img class="cover" src="{deed.pictures.ipfs()}" alt="Deed cover" />
{:else}
  <img class="cover" src="/ourworlds_transparent.png" alt="Deed cover" />
{/if}

<h1 id="title">{deed.title ? deed.title : 'No title'}</h1>
<p id="description">{deed.description ? deed.description : 'No description'}</p>
<p id="category"><span>Category:</span><span>{deed.category ? deed.category : 'None'}</span></p>

<dl id="address">
  <dt><span>Address:</span><pre>{deed.address ? deed.address : 'None'}</pre></dt>
  {#if deed.coordinates?.lat && deed.coordinates?.long}
    <dd><span>Coordinates:</span> <span>{deed.coordinates.lat}, {deed.coordinates.long}</span></dd>
  {/if}
</dl>
<p id="startdate">
  <span>Start date:</span>
  <span>{deed?.timeframe?.start ? new Date(deed?.timeframe.start).toLocaleString() : 'None'}</span
  ></p
>
<p id="reward"><span>Reward:</span> <span>{deed?.hasReward ? '0.1 AVAX' : 'None'}</span></p>
<hr />
