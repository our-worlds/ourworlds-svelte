<script>
    import { goto } from '$app/navigation';
    import { currentPage, pageCount } from "$lib/stateStore.js";

    import NavBar from "@components/NavBar.svelte";

    import Icon from "@components/Icon.svelte";
    import { backIcon, nextIcon, crossIcon } from "$lib/appicons.js";


    const props = {
        color: "#fff",
        filled: false,
        width: "8",
        height: "13"
    }

    const leftProps = {...props, ds: backIcon}
    const rightProps = {...props, ds: nextIcon}

    const crossProps = {
        color: "white",
        filled: false,
        width: "24",
        height: "24",
        ds: crossIcon,
    };

    const blankProp = {...crossProps, color: "transperant" };
</script>


<style>
    section {
        display: grid;
        grid-template-rows: 125px 1fr;
        row-gap: 30px;
        align-items: center;
        justify-items: center;

        min-height: 100vh;

        background: #7434b2;

        padding-block-start: 120px;
    }

    #action {
        position: absolute;
        bottom: 30px;

        width: 100vw;

        display: flex;
        align-items: center;
        justify-content: space-between;

        padding-inline-start: 18px;
        padding-inline-end: 18px;
    }

    #action button {
        width: 3rem;
        height: 3rem;
        display: grid;
        justify-items: center;
        align-items: center;
        border: 0;
        background-color: rgba(128, 128, 128, 0.2);
        border-radius: 15px;
    }

    :global(button:disabled path) {
        stroke: #888;
    }

    #action.hidden {
        display: none;
    }

    .right {
        align-self: end;
    }
</style>

<NavBar
    on:leftClick={() => goto('/')}
    leftProps={crossProps}
    rightProps={blankProp}
    backgroundColor={"purple"}
    fixed={true}>
    <h1>ourworlds</h1>
</NavBar>


<section>
    <slot />
</section>

<div id="action" class:hidden={$pageCount === 1}>
    <button class="left" disabled="{$currentPage === 1}" on:click={() => $currentPage--}><Icon {...leftProps} /></button>
    <button class="right" disabled="{$currentPage >= $pageCount}" on:click={() => $currentPage++}><Icon {...rightProps} /></button>
</div>
