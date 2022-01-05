<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import NavBar from "@components/NavBar.svelte";
    import Footer from "@components/Footer.svelte";

    import Globe from 'globe.gl';
    import { globeIcon, markerIcon, userIcon } from "$lib/appicons.js";
    import { getSupportInfo } from "prettier";

    import { getURI, setNewURI } from "$lib/contract.js";

    const props = {
        color : "#6C7072",
        filled : false,
        width: "24",
        height: "24"
    }

    const leftProps = { ...props, ds : globeIcon, color: "white" }
    const midProps = { ...props, ds : markerIcon }
    const rightProps = { ...props, ds : userIcon }

    const style = "z-index: 5; background-color: #090A0A";

    let tokens = [];
    let uri = {};
    let provider;
    let globeIpfsFile;
    let globeElement;
    const N = 50;
    const gData = [...Array(N).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        size: Math.random() / 5,
        color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
    }));
    let globe;

    $: level = 0;


    onMount( async () => {
        provider = window.Moralis;
        globeIpfsFile = new provider.File()
        const r = await getURI();
        tokens = r.tokens;
        uri = r.uri;
        console.log(uri);
        level = uri.level
        globe = Globe()
        .globeImageUrl(uri.image)
        .backgroundColor('#00000000')
        .pointsData(gData)
        .pointAltitude('size')
        .pointColor('color')          
        (globeElement);
        globe.pointOfView({altitude: 6});
        globe.renderer().setClearColor( 0x000000, 0 );
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 1;
    })

    $: {
        if (level==5) {
            globe.globeImageUrl('https://unpkg.com/three-globe@2.21.3/example/img/earth-blue-marble.jpg')
            // change globe data
        }
        if (level==10){
            globe.bumpImageUrl('https://unpkg.com/three-globe@2.21.3/example/img/earth-topology.png')
            const n_arcs = 50
            const arcsData = [...Array(n_arcs).keys()].map(()=> ({
                startLat: (Math.random() - 0.5) * 180,
                startLng: (Math.random() - 0.5) * 360,
                endLat: (Math.random() - 0.5) * 180,
                endLng: (Math.random() - 0.5) * 360,
                arcAltitudeAutoScale: 0.5,
                color: [['yellow', 'white'][Math.round(Math.random() * 3)], ['yellow', 'gray'][Math.round(Math.random() * 3)]]
            }));
            globe
            .arcsData(arcsData)
            .arcColor('color')
            .arcDashLength(() => Math.random())
            .arcDashGap(() => Math.random())
            .arcDashAnimateTime(() => Math.random() * 4000 + 500)
            // .pointsData(null)
        }
        if (level==15){
            const shieldRing = { lat: 90, lng: 0 };
            globe
            .ringsData([shieldRing])
            .ringAltitude(0.10)
            .ringColor(() => 'lightblue')
            .ringMaxRadius(180)
            .ringPropagationSpeed(20)
            .ringRepeatPeriod(200)
        }

    }

    async function levelUp() {
        // const r = await setNewURI(uri, tokens);
        // tokens = r.tokens;
        // uri = r.uri;
        // level = r.uri.level;
        level++;
    }

</script>


<style>
    #header {
        position: absolute;
        width: 100vw;
        height: 60px;

        padding-block-start: 12px;
        padding-inline-start: 24px;

        background: #090A0A;

        font-weight: bold;
        font-size: 32px;
        line-height: 36px;

        border-block-end: 1px solid #F2F4F5;

        color: #FFFFFF;

        z-index: 4;
    }

    section {
        height: 100vh;
    }

    #globe {
        position: absolute;
        z-index: 3;
    }

    .stars, .twinkling, .clouds {
        position:absolute;
        display:block;
        top:0; bottom:0;
        left:0; right:0;
        width:100%; height:100%;
    }

    .stars {
        z-index: 0;
        background: #000 url('/stars.png') repeat top center;
        /*#06152c*/
    }

    .twinkling{
        z-index: 1;
        background:transparent url('/twinkling.png') repeat top center;
        /*filter: invert(6%) sepia(36%) saturate(3002%) hue-rotate(196deg) brightness(93%) contrast(99%);*/
        animation: move-twink-back 200s linear infinite;
    }
    #level{
        position: fixed !important;
        left: 50%;
        transform: translate(-50%, 48px) !important;
        top: 60px;
        z-index: 10;
    }
    #level-button {
        position: fixed !important;
        left: 50%;
        transform: translate(-50%, -48px) !important;
        bottom: 40px;
        z-index: 10;
    }
    #level-button button {
        width: 170px;
        height: 48px;

        background: #79C679;
        border-radius: 48px;
        border: 0;

        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
        color: white;
        border-color: transparent;
    }

    .clouds{
        z-index: 2;
        background:transparent url('/clouds.png') repeat top center;
        animation: move-clouds-back 200s linear infinite;
    }

    @keyframes move-twink-back {
        from {background-position:0 0;}
        to {background-position:-10000px 5000px;}
    }

    @keyframes move-clouds-back {
        from {background-position:0 0;}
        to {background-position:10000px 0;}
    }
</style>


<NavBar backgroundColor="black">
    <h1>Your world</h1>
</NavBar>
<section>
    <h2 id='level' style="color: white">level {level}</h2>
    <div class="clouds"></div>
    <div class="twinkling"></div>
    <div class="stars"></div>
    <div bind:this={globeElement} id="globe"></div>
    <div id='level-button'>
        <button on:click={levelUp}>
            Level up +
        </button>
    </div>
</section>
<Footer
        on:midClick={() => goto('/deeds')}
        
        {leftProps} {midProps} {style}
></Footer>
<!--on:rightClick={() => goto('/profile')}
{rightProps} 
-->
