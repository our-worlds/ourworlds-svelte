<script>
    import { createEventDispatcher } from "svelte";

    import Icon from "@components/Icon.svelte";

    export let leftProps;
    export let midProps;
    export let rightProps = null;

    export let style = "";


    const dispatch = createEventDispatcher();
</script>


<style>
    footer {
        position: fixed;
        bottom: 0;
        overflow-y: scroll;
        overflow-x: hidden;
        display: flex;
        justify-content: space-around;

        width: 100vw;
        height: 56px;

        background: #FFFFFF;
        box-shadow: 0 -1px 1px rgba(20, 20, 20, 0.02), 0 -2px 8px rgba(20, 20, 20, 0.04);
    }

    footer button {
        border: 0;
        background-color: transparent;
    }
    footer button:hover{
        cursor: pointer;
    }
</style>


<footer style="{style}">
    <button on:click={() => dispatch('leftClick')}><Icon {...leftProps} /></button>
    <button on:click={() => dispatch('midClick')}><Icon {...midProps} /></button>
    {#if rightProps}
        <button on:click={() => dispatch('rightClick')}><Icon {...rightProps} /></button>
    {/if}
</footer>

