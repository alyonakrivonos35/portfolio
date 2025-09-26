import "./app.min.js";
/* empty css           */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var fastDeepEqual;
var hasRequiredFastDeepEqual;
function requireFastDeepEqual() {
  if (hasRequiredFastDeepEqual) return fastDeepEqual;
  hasRequiredFastDeepEqual = 1;
  fastDeepEqual = function equal(a, b) {
    if (a === b) return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      if (a.constructor !== b.constructor) return false;
      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0; )
          if (!equal(a[i], b[i])) return false;
        return true;
      }
      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
      for (i = length; i-- !== 0; ) {
        var key = keys[i];
        if (!equal(a[key], b[key])) return false;
      }
      return true;
    }
    return a !== a && b !== b;
  };
  return fastDeepEqual;
}
var fastDeepEqualExports = requireFastDeepEqual();
var isEqual = /* @__PURE__ */ getDefaultExportFromCjs(fastDeepEqualExports);
const DEFAULT_ID = "__googleMapsScriptId";
var LoaderStatus;
(function(LoaderStatus2) {
  LoaderStatus2[LoaderStatus2["INITIALIZED"] = 0] = "INITIALIZED";
  LoaderStatus2[LoaderStatus2["LOADING"] = 1] = "LOADING";
  LoaderStatus2[LoaderStatus2["SUCCESS"] = 2] = "SUCCESS";
  LoaderStatus2[LoaderStatus2["FAILURE"] = 3] = "FAILURE";
})(LoaderStatus || (LoaderStatus = {}));
class Loader {
  /**
   * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
   * using this library, instead the defaults are set by the Google Maps
   * JavaScript API server.
   *
   * ```
   * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
   * ```
   */
  constructor({ apiKey, authReferrerPolicy, channel, client, id = DEFAULT_ID, language, libraries = [], mapIds, nonce, region, retries = 3, url = "https://maps.googleapis.com/maps/api/js", version }) {
    this.callbacks = [];
    this.done = false;
    this.loading = false;
    this.errors = [];
    this.apiKey = apiKey;
    this.authReferrerPolicy = authReferrerPolicy;
    this.channel = channel;
    this.client = client;
    this.id = id || DEFAULT_ID;
    this.language = language;
    this.libraries = libraries;
    this.mapIds = mapIds;
    this.nonce = nonce;
    this.region = region;
    this.retries = retries;
    this.url = url;
    this.version = version;
    if (Loader.instance) {
      if (!isEqual(this.options, Loader.instance.options)) {
        throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(Loader.instance.options)}`);
      }
      return Loader.instance;
    }
    Loader.instance = this;
  }
  get options() {
    return {
      version: this.version,
      apiKey: this.apiKey,
      channel: this.channel,
      client: this.client,
      id: this.id,
      libraries: this.libraries,
      language: this.language,
      region: this.region,
      mapIds: this.mapIds,
      nonce: this.nonce,
      url: this.url,
      authReferrerPolicy: this.authReferrerPolicy
    };
  }
  get status() {
    if (this.errors.length) {
      return LoaderStatus.FAILURE;
    }
    if (this.done) {
      return LoaderStatus.SUCCESS;
    }
    if (this.loading) {
      return LoaderStatus.LOADING;
    }
    return LoaderStatus.INITIALIZED;
  }
  get failed() {
    return this.done && !this.loading && this.errors.length >= this.retries + 1;
  }
  /**
   * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
   *
   * @ignore
   * @deprecated
   */
  createUrl() {
    let url = this.url;
    url += `?callback=__googleMapsCallback&loading=async`;
    if (this.apiKey) {
      url += `&key=${this.apiKey}`;
    }
    if (this.channel) {
      url += `&channel=${this.channel}`;
    }
    if (this.client) {
      url += `&client=${this.client}`;
    }
    if (this.libraries.length > 0) {
      url += `&libraries=${this.libraries.join(",")}`;
    }
    if (this.language) {
      url += `&language=${this.language}`;
    }
    if (this.region) {
      url += `&region=${this.region}`;
    }
    if (this.version) {
      url += `&v=${this.version}`;
    }
    if (this.mapIds) {
      url += `&map_ids=${this.mapIds.join(",")}`;
    }
    if (this.authReferrerPolicy) {
      url += `&auth_referrer_policy=${this.authReferrerPolicy}`;
    }
    return url;
  }
  deleteScript() {
    const script = document.getElementById(this.id);
    if (script) {
      script.remove();
    }
  }
  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   * @deprecated, use importLibrary() instead.
   */
  load() {
    return this.loadPromise();
  }
  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   *
   * @ignore
   * @deprecated, use importLibrary() instead.
   */
  loadPromise() {
    return new Promise((resolve, reject) => {
      this.loadCallback((err) => {
        if (!err) {
          resolve(window.google);
        } else {
          reject(err.error);
        }
      });
    });
  }
  importLibrary(name) {
    this.execute();
    return google.maps.importLibrary(name);
  }
  /**
   * Load the Google Maps JavaScript API script with a callback.
   * @deprecated, use importLibrary() instead.
   */
  loadCallback(fn) {
    this.callbacks.push(fn);
    this.execute();
  }
  /**
   * Set the script on document.
   */
  setScript() {
    var _a, _b;
    if (document.getElementById(this.id)) {
      this.callback();
      return;
    }
    const params = {
      key: this.apiKey,
      channel: this.channel,
      client: this.client,
      libraries: this.libraries.length && this.libraries,
      v: this.version,
      mapIds: this.mapIds,
      language: this.language,
      region: this.region,
      authReferrerPolicy: this.authReferrerPolicy
    };
    Object.keys(params).forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (key) => !params[key] && delete params[key]
    );
    if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.maps) === null || _b === void 0 ? void 0 : _b.importLibrary)) {
      ((g) => {
        let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
        b = b[c] || (b[c] = {});
        const d = b.maps || (b.maps = {}), r = /* @__PURE__ */ new Set(), e = new URLSearchParams(), u = () => (
          // @ts-ignore
          h || (h = new Promise((f, n) => __awaiter(this, void 0, void 0, function* () {
            var _a2;
            yield a = m.createElement("script");
            a.id = this.id;
            e.set("libraries", [...r] + "");
            for (k in g)
              e.set(k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()), g[k]);
            e.set("callback", c + ".maps." + q);
            a.src = this.url + `?` + e;
            d[q] = f;
            a.onerror = () => h = n(Error(p + " could not load."));
            a.nonce = this.nonce || ((_a2 = m.querySelector("script[nonce]")) === null || _a2 === void 0 ? void 0 : _a2.nonce) || "";
            m.head.append(a);
          })))
        );
        d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
      })(params);
    }
    const libraryPromises = this.libraries.map((library) => this.importLibrary(library));
    if (!libraryPromises.length) {
      libraryPromises.push(this.importLibrary("core"));
    }
    Promise.all(libraryPromises).then(() => this.callback(), (error) => {
      const event = new ErrorEvent("error", { error });
      this.loadErrorCallback(event);
    });
  }
  /**
   * Reset the loader state.
   */
  reset() {
    this.deleteScript();
    this.done = false;
    this.loading = false;
    this.errors = [];
    this.onerrorEvent = null;
  }
  resetIfRetryingFailed() {
    if (this.failed) {
      this.reset();
    }
  }
  loadErrorCallback(e) {
    this.errors.push(e);
    if (this.errors.length <= this.retries) {
      const delay = this.errors.length * Math.pow(2, this.errors.length);
      console.error(`Failed to load Google Maps script, retrying in ${delay} ms.`);
      setTimeout(() => {
        this.deleteScript();
        this.setScript();
      }, delay);
    } else {
      this.onerrorEvent = e;
      this.callback();
    }
  }
  callback() {
    this.done = true;
    this.loading = false;
    this.callbacks.forEach((cb) => {
      cb(this.onerrorEvent);
    });
    this.callbacks = [];
  }
  execute() {
    this.resetIfRetryingFailed();
    if (this.loading) {
      return;
    }
    if (this.done) {
      this.callback();
    } else {
      if (window.google && window.google.maps && window.google.maps.version) {
        console.warn("Google Maps already loaded outside @googlemaps/js-api-loader. This may result in undesirable behavior as options and script parameters may not match.");
        this.callback();
        return;
      }
      this.loading = true;
      this.setScript();
    }
  }
}
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
    const loader = new Loader({
      apiKey: MAP_KEY,
      version: "weekly",
      libraries: ["places"]
    });
    try {
      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");
      const Core = await loader.importLibrary("core");
      onLoad({ Map, AdvancedMarkerElement, Core });
    } catch (e) {
      console.log(e);
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
