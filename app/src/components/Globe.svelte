<style>
  #globe {
    position: absolute;
    z-index: 3;
  }
</style>

<script>
  import Globe from 'globe.gl';

  import tokenMetadata from '/src/token/metadata.json';
  import upgradeableAbi from '/src/token/upgradeable.json';

  const style = 'z-index: 5; background-color: #090A0A';

  const globeTextureUrl =
    'https://ipfs.io/ipfs/QmV3w8D47cCJgjtcYuJF1LjLW5zpYUWU5Y7M21tzSyYtPE?filename=texture.png';

  export let uri = {};
  let provider;
  let globeIpfsFile;
  let globeElement;
  const N = 300;
  const gData = [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: Math.random() / 5,
    color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
  }));
  let globe;

  console.log(uri);
  level = uri.level;
  globe = Globe()
    .globeImageUrl(uri.image)
    .backgroundColor('#00000000')
    .pointsData(gData)
    .pointAltitude('size')
    .pointColor('color')(globeElement);
  globe.pointOfView({ altitude: 7 });
  globe.renderer().setClearColor(0x000000, 0);
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 1;

  $: {
    if (level == 5) {
      globe.globeImageUrl('https://unpkg.com/three-globe@2.21.3/example/img/earth-blue-marble.jpg');
      // change globe data
    }
    if (level == 10) {
      globe.bumpImageUrl('https://unpkg.com/three-globe@2.21.3/example/img/earth-topology.png');
      const n_arcs = 50;
      const arcsData = [...Array(n_arcs).keys()].map(() => ({
        startLat: (Math.random() - 0.5) * 180,
        startLng: (Math.random() - 0.5) * 360,
        endLat: (Math.random() - 0.5) * 180,
        endLng: (Math.random() - 0.5) * 360,
        arcAltitudeAutoScale: 0.5,
        color: [
          ['yellow', 'white'][Math.round(Math.random() * 3)],
          ['yellow', 'gray'][Math.round(Math.random() * 3)],
        ],
      }));
      globe
        .arcsData(arcsData)
        .arcColor('color')
        .arcDashLength(() => Math.random())
        .arcDashGap(() => Math.random())
        .arcDashAnimateTime(() => Math.random() * 4000 + 500)
        .pointsData(null);
    }
    if (level == 15) {
      const shieldRing = { lat: 90, lng: 0 };
      globe
        .ringsData([shieldRing])
        .ringAltitude(0.1)
        .ringColor(() => 'lightblue')
        .ringMaxRadius(180)
        .ringPropagationSpeed(20)
        .ringRepeatPeriod(200);
    }
  }
</script>

<div bind:this="{globeElement}" id="globe"></div>
