<style>
  #map {
    position: relative;
    left: 0;
    width: 100%;
    height: 100%;

    margin: 0;
    padding: 0;
    z-index: 3;
  }

  :global(.marker) {
    display: flex !important;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    width: 84px !important;
    height: 32px !important;

    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    border-radius: 32px;

    font-size: 16px;
    line-height: 16px;
    text-align: center;
    font-weight: bold;
    color: #090a0a;
  }
  :global(.activeMarker) {
    background-color: black;
    color: white;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';

  import L from 'leaflet';
  import { browser } from '$app/env';

  const dispatch = createEventDispatcher();

  let map;
  let marker;
  let markerGroup = null;

  function placeMarker(lat, lon, detail) {
    const marker = L.marker([lat, lon], {
      icon: L.divIcon({
        html: `<div data-id="${detail.id}">
                    ${detail?.hasReward ? '0.1 AVAX' : 'None'}
                    </div>`,
        className: 'marker',
      }),
    });

    marker.on('click', markerClickHandler, detail);
    if (markerGroup === null) {
      markerGroup = L.layerGroup([marker]).addTo(map);
    } else marker.addTo(markerGroup);
  }

  function setMarker(lat, long) {
    if (!marker) {
      marker = L.marker([lat, long], {
        draggable: 'true',
      });

      marker.addTo(map);
      // marker.bindPopup("<b>Create new deed</b><br>I am a popup.").openPopup();

      marker.on('dragend', () => dispatch('mapClick', marker.getLatLng()));
    } else {
      marker.setLatLng([lat, long]);
    }
  }

  export function setDeeds(received) {
    if (markerGroup !== null) markerGroup.clearLayers();
    // TODO: Bring back the loop when the deeds contain real locations
    received?.forEach((data) => {
      // const data = received[0];
      const markerLat = data?.coordinates?.latitude || map.getCenter().lat;
      const markerLon = data?.coordinates?.longitude || map.getCenter().lng;
      const detail = data || 'No detail available';
      placeMarker(markerLat, markerLon, detail);
    });
  }

  function mapAction(container) {
    if ('geolocation' in navigator && browser) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map = L.map(container, {
            center: [position.coords.latitude, position.coords.longitude],
            zoom: 20,
            zoomControl: false,
          });

          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: `&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
                                &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
            subdomains: 'abcd',
            maxZoom: 30,
          }).addTo(map);

          map.on('click', (event) => {
            setMarker(event.latlng.lat, event.latlng.lng);
            dispatch('mapClick', event.latlng);
          });

          dispatch('loaded');
          dispatch('mapClick', { lat: position.coords.latitude, lng: position.coords.longitude });

          return {
            destroy: () => {
              map.remove();
              map = null;
            },
          };
        },
        (error) => {
          console.error(`Location request failed: ${error}`);
        },
        {
          enableHighAccuracy: false,
        },
      );
    }
  }

  function markerClickHandler(event) {
    Array.from(document.querySelectorAll('.activeMarker')).forEach((el) =>
      el.classList.remove('activeMarker'),
    );
    event.target._icon.classList.add('activeMarker');
    const nodes = document.querySelectorAll(
      `[data-id="${event.target.getElement().firstElementChild.dataset.id}"]`,
    );
    nodes.forEach((item) => {
      item.classList.toggle('selected');
      if (item.classList.contains('selected')) {
        item.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
        });
      }
    });
  }

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }
</script>

<div id="map" use:mapAction></div>

<svelte:window on:resize="{resizeMap}" />

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""
  />
</svelte:head>
