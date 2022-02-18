<script>
    import { createEventDispatcher } from "svelte";

    import Icon from "@components/Icon.svelte";

    export let title = null;
    export let leftAction = "";
    export let rightAction = "";
    export let fixed = false;
    export let leftProps = null;
    export let midProps = null;
    export let rightProps = null;
    export let backgroundColor = "white";

    const dispatch = createEventDispatcher();
</script>


<style>
    navbar {
        top: 0px;
        display: block;
        align-items: center;
        z-index:100;
        background-color: white;
    }
    navbar[fixed=true]{
        position: sticky;
    }

    div[backgroundColor=purple] {
        background-color: #6B4EFF;
    }

    div[backgroundColor=black] {
        background-color: black;
    }

    div{
        position: absolute;
        background-color: white;
        height: 80px;
        width: 100vw;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 1000;
    }

    aside {
        position: absolute;
        background-color: white;
        height: 48px;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding-inline-start: 18px;
        padding-inline-end: 18px;
        z-index: 1000;
    }

    aside[backgroundColor=purple] {
        background-color: #6B4EFF;
        color: white;
    }

    aside[backgroundColor=black] {
        background-color: black;
        color: white;
    }

    aside button {
        padding: 10px;
        display: grid;
        justify-items: center;
        align-items: center;
        border: 0;
        background-color: transparent;
        border-radius: 15px;
    }
    aside button:hover {
        cursor:pointer;
    }

    h3 {
        color: #6B4EFF;
    }


</style>

<navbar {fixed}>
    <div id="navbar-container" {backgroundColor}>
        <aside {backgroundColor}>
            {#if leftProps}
                <button 
                    on:click={() => dispatch('leftClick')}
                    >
                    {#if leftAction === "text"}
                        <h3>{leftProps}</h3>
                    {:else}
                        <Icon {...leftProps} />
                    {/if}
                </button>
            {/if}
            {#if title}
                <h1>{title}</h1>
            {:else}
                <slot></slot>
            {/if}
            {#if rightProps}
                <button on:click={() => dispatch('rightClick')}>
                    {#if rightAction === "text"}
                        <h3>{rightProps}</h3>
                    {:else}
                        <Icon {...rightProps} />
                    {/if}
                </button>
            {/if}
        </aside>
    </div>
</navbar>