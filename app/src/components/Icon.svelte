<style>
  .icon {
    position: relative;
    display: inline-block;
  }
</style>

<script>
  export let color = '#979C9E';
  export let stroke = color;
  export let filled = false;
  export let fill = filled ? color : 'none';
  export let width = '1em'; // default 1em match the parent element
  export let height = '1em'; // default 1em match the parent element
  // default heart icon
  export let ds = [
    'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  ];
</script>

<svg
  class="icon"
  viewBox="0 0 {width} {height}"
  fill="{fill}"
  width="{width}"
  height="{height}"
  xmlns="http://www.w3.org/2000/svg"
>
  {#each ds as d}
    <path
      d="{d}"
      stroke="{stroke}"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"></path>
  {/each}
</svg>
