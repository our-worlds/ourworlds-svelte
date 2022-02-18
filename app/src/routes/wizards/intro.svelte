<script>
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';

    import { currentPage, pageCount } from "$lib/stateStore.js";

    import Icon from "@components/Icon.svelte";
    import { lensIcon, thumbsUpIcon, dollarIcon, pictureIcon, wingsIcon } from '$lib/appicons.js';

    const props = {
        color: "#fff",
        filled: false,
        width: "32",
        height: "32"
    }

    const searchIconProps = { ...props, ds: lensIcon };
    const thumbsUpIconProps = { ...props, ds: thumbsUpIcon };
    const dollarIconProps = { ...props, ds: dollarIcon };
    const pictureIconProps = { ...props, ds: pictureIcon };
    const wingsIconProps = { ...props, ds: wingsIcon };

    let locationAccessState;

    let provider;
    let isMetamaskInstalled;

    $: {
        navigator.permissions.query({name: 'geolocation'})
            .then(result => {
                result.onchange = () => locationAccessState = result.state;
                locationAccessState = result.state;
            });
    }


    onMount(async () => {
        $pageCount = 4;

        provider = window.Moralis;
        isMetamaskInstalled = await provider.isMetaMaskInstalled();
        if (!isMetamaskInstalled) {
            $pageCount++;
        }
    })

    function handleLocationRequest() {
        console.log('requested')
        navigator.geolocation.getCurrentPosition(() => {}, (error) => {
            console.error('location access failed', error);
            locationAccessState = 'denied';
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }

    function startApp() {
        localStorage.setItem('intro_done', 'true');
        goto('/deeds');
    }
</script>


<style>
    h2 {
        color: white;

        font-weight: bold;
        font-size: 32px;

        line-height: 36px;
        text-align: center;

        padding-inline-start: 45px;
        padding-inline-end: 45px;

        margin-block-end: 21px;
    }

    p {
        color: white;

        padding-inline-start: 45px;
        padding-inline-end: 45px;
        margin-block-start: 9px;

        font-weight: 500;
        font-size: 16px;

        line-height: 24px;
        display: flex;

        align-items: center;
        text-align: center;

        width: 390px;
    }

    #logo {
        width: 220px;
        height: 220px;

        align-self: center;

        margin-block-start: 50px;
    }

    button {
        width: 180px;
        height: 48px;

        background: #6EC2FB;
        border:  0;
        border-radius: 48px;

        font-weight: 500;
        font-size: 16px;
        line-height: 16px;

        color: #FFFFFF;
    }

    button:disabled {
        background-color: #8eceff;
    }

    #content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;

        align-self: start;
    }

    #deeds2freedom li {
        display: flex;
        align-items: center;
        gap: 10px;

        color: white;

        line-height: 18px;
        font-size: 27px;
        font-weight: 500;

        padding-block-start: 18px;
        padding-block-end: 18px;
    }

    ul {
        list-style-type: none;
        padding-inline-end: 30px;
        margin-block-start: 30px;
    }

    a.metamask {
        margin-block-start: 90px;
    }

    img.metamask {
        margin-block-start: 21px;
    }

    button.start-app {
        margin-block-start: 341px;
    }
</style>

<div id="content">
    {#if $currentPage === 1}
        <h2>Welcome to ourworlds</h2>
        <p>We are a community that are turning kind deeds into freedom.</p>
        <p>With this app we hope you can help us bring back some hope to the world.</p>
        <img src="../ourworlds_transparent.png" id="logo" alt="stylized globe with house and garden" />

    {:else if $currentPage === 2}
        <h2>From Deeds to Freedom</h2>
        <p>You may be wondering, how do you turn kind deeds into freedom?</p>
        <ul id="deeds2freedom">
            <li><Icon {...searchIconProps} /><span>Find a Deed</span></li>
            <li><Icon {...thumbsUpIconProps} /><span>Complete the Deed</span></li>
            <li><Icon {...pictureIconProps} /><span>Upgrade your world</span></li>
            <li><Icon {...dollarIconProps} /><span>Get rewarded</span></li>
            <li><Icon {...wingsIconProps} /><span>Freedom</span></li>
        </ul>

    {:else if $currentPage === 3}
        <h2>Share your location</h2>
        <p>
            By sharing your location, you'll see Deeds around you, allowing you to start your journey right away.
        </p>
        <img src="../world-gps-pin-icon.svg" alt="world with gps pin"/>
        {#if (locationAccessState === 'denied')}
            <p>Location access is blocked. You need to allow it manually in the browser settings</p>
        {:else}
            <p>Don't worry you can always search for deeds manually if you opt out.</p>
            <button on:click={handleLocationRequest} disabled="{locationAccessState === 'granted'}">
                {locationAccessState === 'granted' ? 'Permission granted' : 'Request permission'}
            </button>
        {/if}

    {:else if $currentPage === 4 && !isMetamaskInstalled}
        <h2>Setup your wallet</h2>
        <p>
            Setup your wallet so you can store your digital goods securely.
            We use wallets to handle any crypto transactions.
        </p>
        <img class="metamask" src="../metamask.svg" alt="metamask logo" width="210px" height="210px"/>
        <a class="metamask" href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
            <button>Install MetaMask</button>
        </a>
        
    {:else}
        <h2>Enjoy our worlds!</h2>
        <p>
            Thank you for finishing the introduction, you are now all set to start your journey with our worlds. Have fun!
        </p>
        <button class="start-app" on:click={startApp}>Let's go</button>
    {/if}
</div>
