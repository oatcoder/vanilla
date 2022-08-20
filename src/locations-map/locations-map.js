class LocationsMap extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: "open" });

        const template = document.currentScript.ownerDocument.querySelector('#locations-map-template');

        const templateClone = template.content.cloneNode(true);

        shadowRoot.appendChild(templateClone);

        this.mapMarkers = [];
        this.infoWindows = [];

        this.render();
    }

    render() {
        this.loadMapApiJs();
    }

    loadMapApiJs() {
        window.initMap = this.onInitMap.bind(this);

        const mapApiScriptElement = document.currentScript.ownerDocument.createElement('script');

        mapApiScriptElement.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA3SpfLoQb5VNf6MirFXu0ncPlJFYJmDE8&callback=initMap';
        mapApiScriptElement.async = true;

        this.shadowRoot.appendChild(mapApiScriptElement);
    }

    geoLocationResponse(res) {
        this.map = new google.maps.Map(this.shadowRoot.getElementById('map'), {
            center: { lat: res.coords.latitude, lng: res.coords.longitude },
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false
        });

        this.map.setOptions({ styles: LocationsMap.getStyles() });
    }

    geoLocationErrorHandler(e) {
        console.warn('error getting geo location');
    }

    onInitMap() {
        const options = {
            maximumAge: 5 * 60 * 1000,
        };

        navigator.geolocation.getCurrentPosition(this.geoLocationResponse.bind(this), this.geoLocationErrorHandler.bind(this), options);
    }

    static getStyles() {
        return [
            {
                elementType: 'geometry',
                stylers: [{ color: '#ebe3cd' }]
            },
            {
                elementType: 'labels.text.fill',
                stylers: [{ color: '#523735' }]
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#f5f1e6' }]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#c9b2a6' }]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#dcd2be' }]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#ae9e90' }]
            },
            {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{ color: '#dfd2ae' }]
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{ color: '#dfd2ae' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#93817c' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{ color: '#a5b076' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#447530' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#f5f1e6' }]
            },
            {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{ color: '#fdfcf8' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#f8c967' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#e9bc62' }]
            },
            {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{ color: '#e98d58' }]
            },
            {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#db8555' }]
            },
            {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#806b63' }]
            },
            {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{ color: '#dfd2ae' }]
            },
            {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#8f7d77' }]
            },
            {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ebe3cd' }]
            },
            {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{ color: '#dfd2ae' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{ color: '#b9d3c2' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#92998d' }]
            }
        ]
    }

    static get observedAttributes() {
        return ['selected', 'locations'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (!oldVal && !newVal) return;

        if (name === 'selected') {
            this.centerMap(newVal);
            this.showInfoWindowFor(newVal);
        }

        if (name === 'locations') {
            this.addMarkersForLocations(newVal);
        }
    }

    centerMap(location) {
        if (typeof location === "string" || location instanceof String) {
            const data = JSON.parse(location);

            this.map.setCenter(new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.long)));
        }
    }

    addMarkersForLocations(locations) {
        if (typeof locations === "string" || locations instanceof String) {
            const data = JSON.parse(locations);

            for (let i = 0; i < data.length; i++) {
                const location = data[i];

                const infoWindow = new google.maps.InfoWindow({
                    content: `<div class="marker-info-window-container">${location.address}</div>`,
                    maxWidth: 200
                });

                const locationMark = new google.maps.Marker({
                    map: this.map,
                    position: new google.maps.LatLng(location.geo.latitude, location.geo.longitude),
                    title: location.address,
                    id: location.id
                });

                locationMark.addListener('click', () => {
                    infoWindow.open(this.map, locationMark);
                });

                this.mapMarkers.push(locationMark);
            }
        }
    }

    showInfoWindowFor(location) {
        if (typeof location === "string" || location instanceof String) {
            const data = JSON.parse(location);

            const marker = this.getMarkerForHtml(data);

            if (marker) {
                marker.dispatchEvent(new Event('click'));
            }
        }
    }

    getMarkerForHtml(location) {
        return this.shadowRoot.querySelector('div[title="' + location.address + '"]');
    }
}

try {
    customElements.define('locations-map', LocationsMap);
} catch (e) {
    const h3 = document.createElement('h3');

    h3.innerHTML = "Site uses webcomponents.  Please try this on a browser that supports them!";

    document.body.appendChild(h3);
}