import "./main.min.js";
/* empty css           */
import "./common.min.js";
const MAP_KEY = `AIzaSyDRypTXg6PL9POav3-fhnkv5QFIVetzzpM`;
const MAP_STYLES = [
  {
    "featureType": "all",
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#DFC271" }]
    // желтые названия районов
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#212121" }]
    // тёмный фон под текстом
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [{ "color": "#333333" }]
    // общий фон карты
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#2a2a2a" }]
    // POI (парки, площади) темнее
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{ "color": "#575757" }]
    // обычные улицы серые
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#202020" }]
    // обводка дорог темнее
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{ "color": "#DFC271" }]
    // хайвеи оранжево-жёлтые
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#a76a00" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
    // подписи улиц серые
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#1c1c1c" }]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{ "color": "#2f2f2f" }]
    // метро/рельсы серые
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#282828" }]
    // вода 
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#3d3d3d" }]
  }
];
function mapInit() {
  const SELECTORS = {
    section: "[data-fls-map]",
    marker: "[data-fls-map-marker]",
    map: "[data-fls-map-body]"
  };
  const $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  const loadMap = async (onLoad) => {
    try {
      if (!window.google) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&v=weekly`;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      const Core = await google.maps.importLibrary("core");
      onLoad({ Map, AdvancedMarkerElement, Core });
    } catch (e) {
      console.error(e);
    }
  };
  const initMap = async ({ api, lng, lat, markersData, zoom, maxZoom, $map }) => {
    const mapOptions = {
      maxZoom,
      zoom: 15,
      mapTypeControl: false,
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      ...{ styles: MAP_STYLES }
    };
    const map = new api.Map($map, mapOptions);
    {
      markersData.map(({ lat: lat2, lng: lng2, icon, title, markerZoom, markerPopup }) => {
        const marker = new google.maps.Marker({
          position: { lat: lat2, lng: lng2 },
          map,
          title,
          icon: icon || null
        });
        marker.addListener("click", () => {
          if (markerZoom.enable) map.setZoom(+markerZoom.value || 10);
          if (markerPopup.enable && window.flsPopup) {
            window.flsPopup.open(markerPopup.value);
          }
          map.panTo(marker.getPosition());
        });
        return marker;
      });
    }
    return map;
  };
  loadMap((api) => {
    $sections.forEach(($section) => {
      const $maps = $section.querySelectorAll(SELECTORS.map);
      if (!$maps.length) return;
      $maps.forEach(($map) => {
        const $markers = $map.parentElement.querySelectorAll(SELECTORS.marker);
        const markersData = Array.from($markers).map(($marker) => ({
          lng: parseFloat($marker.dataset.flsMapLng) || 0,
          lat: parseFloat($marker.dataset.flsMapLat) || 0,
          icon: $marker.dataset.flsMapIcon,
          title: $marker.dataset.flsMapTitle,
          markerZoom: {
            enable: $marker.hasAttribute("data-fls-map-marker-zoom"),
            value: $marker.dataset.flsMapMarkerZoom
          },
          markerPopup: {
            enable: $marker.hasAttribute("data-fls-map-marker-popup"),
            value: $marker.dataset.flsMapMarkerPopup
          }
        }));
        const map = initMap({
          api,
          $map,
          lng: parseFloat($map.dataset.flsMapLng) || 0,
          lat: parseFloat($map.dataset.flsMapLat) || 0,
          zoom: parseFloat($map.dataset.flsMapZoom) || 6,
          maxZoom: parseFloat($map.dataset.flsMapMaxZoom) || 18,
          markersData
        });
      });
    });
  });
}
document.querySelector("[data-fls-map]") ? window.addEventListener("load", mapInit) : null;
