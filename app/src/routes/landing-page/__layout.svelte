<script lang="ts">
    import { goto } from "$app/navigation";
    import NavBar from "@components/NavBar.svelte";

    const SCREEN = Object.freeze({
        HOME: "home",
        ABOUT_US: "about-us",
        TEAM: "team"
    });

    let currentScreen = SCREEN.HOME;

    function handleHomeScreen()
    {
        currentScreen = SCREEN.HOME;
        goto("/landing-page");
    }

    function handleAboutUsScreen()
    {
        currentScreen = SCREEN.ABOUT_US;
        goto("/landing-page/about-us");
    }

    function handleTeamScreen()
    {
        currentScreen = SCREEN.TEAM;
        goto("/landing-page/team");
    }
</script>

<style>
    button {
        width: 100px;
        height: 35px;

        background: #7434B2;
        border-radius: 48px;
        border: 0;

        font-weight: 500;
        font-size: 16px;
        line-height: 16px;

        color: white;
    }

</style>

<NavBar fixed={true}
    rightAction={"text"}
    rightProps={"Explore"}
    on:rightClick={() => {goto("/")}}
>
    <h1>ourworlds</h1>
    <button on:click={handleHomeScreen}>
        Home
    </button>
    <button on:click={handleAboutUsScreen} >
        About us
    </button>
    <button on:click={handleTeamScreen} >
        Team
    </button>
</NavBar>

<slot/>
