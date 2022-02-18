<script>
    import { createEventDispatcher } from 'svelte';


    const dispatch = createEventDispatcher();
    export let columnOrientation = false;
    export let deedList = [];
</script>


<style>
    section {
        height: max-content;

        padding-block: 10px;

        overflow-y: hidden;
        overflow-x: auto;
        z-index: 10000;
    }

    section ul {
        display: flex;
        gap: 16px;
        flex-direction: row;
        padding: 0;
        width: max-content;
        list-style: none;
    }
    section ul[columnOrientation=true]{
        flex-direction: column;
    }

    #list li {
        display: inline-flex;
    }

    .card {
        display: inline-flex;
        flex-direction: column;
        border-radius: 5px; /* 5px rounded corners */
        gap: 12px;
        transition: .2s ease-in-out;
    }
    .card img {
        display: inline;
        height: 141px;
        object-fit: cover;
        border-radius: 16px;
    }

    .card .title {
        font-weight: bold;
        font-size: 16px;
        line-height: 16px;
        color: #090A0A;
    }

    .card .starttime {
        display: block;
        height: 16px;

        font-size: 12px;
        line-height: 16px;

        color: #090A0A;
    }
</style>


<section id="deeds">
    <ul id="list" 
        on:click={(event) => dispatch('deedClick', { id: event.target.parentElement.dataset.id})}
        {columnOrientation}
        >
        {#each deedList as deed}
            <li class="card" data-id="{deed.id}">
                <img src="{deed?.pictures ? deed.pictures.ipfs() : '/ourworlds_transparent.png'}" alt="" />
                <span>
                    <span class="title">{deed.title}</span>
                    <span class="starttime">{deed.timeframe.start}</span>
                </span>
            </li>
        {/each}
    </ul>
</section>
