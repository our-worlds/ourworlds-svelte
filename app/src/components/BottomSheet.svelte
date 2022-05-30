<style>
  .root {
    position: fixed;
    background-color: #ffffff;
    width: 100vw;
    overflow-y: hidden;
    overflow-x: auto;
    left: 0px;
    bottom: var(--b, -100%);
    z-index: 7;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding: 10px;
  }
  .root[open='true'] {
    border-radius: 0;
  }
  .root[open='false'] {
    bottom: -88%;
  }
  .root[fullscreen='true'] {
    height: 100%;
  }
  .root[smooth='true'] {
    transition: bottom calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
  }
  #pill {
    content: '';
    background-color: #ccc;
    align-self: center;
    height: 8px;
    border-radius: 30px;
    width: 15%;
    margin: 0 0 20px 0;
  }
  #pill:hover {
    cursor: pointer;
  }
  .backdrop {
    pointer-events: none;
    position: fixed;
    left: 0px;
    top: 92px;
    width: 100vw;
    height: 80%;
    background-color: #212121;
    opacity: var(--o, 0);
    z-index: 6;
  }
  .backdrop[smooth='true'] {
    transition: opacity calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
  }
  .backdrop[open='true'] {
    pointer-events: all;
  }

  .shadow[open='true'] {
    box-shadow: 0px -2px 8px #21212144, 0px 0px 2px #21212144;
  }
</style>

<script>
  // edited from https://github.com/kroniapp/svelte-swipeable-sheets/blob/master/BottomSheet.svelte
  let dialog;
  let backdrop;
  let startX;
  let startY;
  let direction;
  export let fullscreen = false;
  export let open = false;
  export let threshold = 0.3;
  export let backdropOpacity = 0.5;
  export let speed = 0.2;
  export let maxHeight = -92;

  const touch = (e) => (e.changedTouches ? e.changedTouches[0] : e);
  const deltaX = (e) => startX - touch(e).clientX;
  const deltaY = (e) => startY - touch(e).clientY;
  const touchStart = (e) => {
    startX = touch(e).clientX;
    startY = touch(e).clientY;
  };
  const touchMove = (e) => {
    if (!direction) {
      direction = Math.abs(deltaY(e)) > Math.abs(deltaX(e)) ? 'vertical' : 'horizontal';
    }
    if (deltaY(e) < 0 && direction === 'vertical') {
      dialog.style.setProperty('--b', `${deltaY(e) + maxHeight}px`);
      backdrop.style.setProperty('--o', (1 + deltaY(e) / dialog.clientHeight) * backdropOpacity);
    }
  };
  const touchEnd = (e) => {
    if (direction === 'vertical') {
      open = -deltaY(e) / dialog.clientHeight < threshold;
    }
    startY = null;
    direction = null;
  };
  $: if (dialog && backdrop) {
    dialog.style.setProperty('--s', `${speed}s`);
    backdrop.style.setProperty('--s', `${speed}s`);
  }
  $: if (dialog && backdrop && !direction) {
    dialog.style.setProperty('--b', open ? `${maxHeight}px` : `${-dialog.clientHeight}px`);
    backdrop.style.setProperty('--o', open ? backdropOpacity : 0);
  }
</script>

<div
  bind:this="{backdrop}"
  class="backdrop"
  smooth="{!startY}"
  open="{open}"
  on:click="{() => (open = false)}"></div>

<div
  bind:this="{dialog}"
  class="root shadow"
  fullscreen="{fullscreen}"
  open="{open}"
  smooth="{!startY}"
  on:touchstart="{touchStart}"
  on:click="{touchStart}"
  on:drag="{touchMove}"
  on:touchmove="{touchMove}"
  on:touchend="{touchEnd}"
>
  <div id="pill"></div>
  <slot />
</div>
