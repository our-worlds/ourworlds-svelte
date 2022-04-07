<script lang="ts">
    import { goto } from "$app/navigation";
    import NavBar from "@components/NavBar.svelte";

    const SCREEN = Object.freeze({
        HOME: "home",
        ABOUT_US: "about-us",
        TEAM: "team"
    });

    let currentScreen = SCREEN.HOME;
</script>

<style>
    section {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        padding-block-start:80px;
        padding-block-end: 50px;
        height: 100vh;

        background: linear-gradient(to top, #7434B2, #7434B2 20%, rgb(20, 20, 20), rgb(20, 20, 20));

        color: white;

        align-items: center;
    }

    #home-container {
        display: flex;
        flex-direction: row;
    }
    
    #call-to-action-container {
        margin-inline: 5px;
    }

    #yourworld-container {
        margin-inline: 5px;
    }
</style>

<section>
    <h1>Home</h1>
    <div id="home-container">
        <div id="call-to-action-container">
            <h2>Turning kind deeds into freedom</h2>
            <p>Create a platform that empowers individuals to participate in deeds to help the planet and offer them a community and rewards, all power by the blockchain</p>
        </div>
        <div id="yourworld-container">
            <p>IMAGE OF YOURWORLD</p>
        </div>
    </div>
</section>
