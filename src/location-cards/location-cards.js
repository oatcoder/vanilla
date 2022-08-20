class LocationCards extends HTMLElement {
    constructor() {
        super();

        this._selectedLocation = null;

        this._locations = [];
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });

        const template = document.currentScript.ownerDocument.querySelector('#location-cards-template');

        this.addEventListener('selected', this.onSelected.bind(this));

        const templateClone = template.content.cloneNode(true);

        shadowRoot.appendChild(templateClone);

        this.render();
    }

    render() {
        fetch('https://kadupul-flower.appspot.com/api/v1/locations', {
            method: 'get',
            headers: { "Content-Type": "application/json" }
        })
        .then(value => {
            if (!value.ok) {
                throw Error("network request failed");
            }

            return value
        })
        .then(res => res.json())
        .then(data => {
            this.locations = data.locations;

            let items = data.locations.map((data) => {
                return `<location-card id="${data.id}" address="${data.address}" lat="${data.geo.latitude}" long="${data.geo.longitude}" dateCreated="${data.dateCreated}"></location-card>`
            });

            this.updateRendering(items);
        })
        .catch(reason => {
            console.error('error while fetching locations');
        });

        this.updateRendering([]);
    }

    onSelected(e) {
        if (e.composedPath().length = 0) return;

        const selectedElement = e.composedPath()[0];

        this.selectedLocation = selectedElement;

        const allLocations = this.shadowRoot.querySelectorAll('location-card');

        for (let i = 0; i < allLocations.length; i++) {
            allLocations[i].removeAttribute('is-selected');
        }

        selectedElement.setAttribute('is-selected', true);
    }

    updateRendering(items) {
        this.shadowRoot.lastElementChild.innerHTML = items.join(' ');
    }

    get selectedLocation() {
        return this._selectedLocation;
    }

    set selectedLocation(value) {
        this._selectedLocation = {
            address: value.attributes['address'].nodeValue,
            lat: value.attributes['lat'].nodeValue,
            long: value.attributes['long'].nodeValue,
            dateCreated: value.attributes['dateCreated'].nodeValue,
            id: parseInt(value.attributes['id'].nodeValue)
        };

        this.emitSelectionChange();
    }

    emitSelectionChange() {
        this.dispatchEvent(new CustomEvent('locationChanged', {
            bubbles: true,
            composed: true,
            detail: { locationSelected: JSON.stringify(this.selectedLocation) }
        }));
    }

    emitLocationsChange() {
        this.dispatchEvent(new CustomEvent('locationsChanged', {
            bubbles: true,
            composed: true,
            detail: { locations: JSON.stringify(this.locations) }
        }));
    }

    get locations() {
        return this._locations;
    }

    set locations(value) {
        this._locations = value;

        this.emitLocationsChange();
    }

    disconnectedCallback() {
        this.removeEventListener('locationsChanged');
        this.removeEventListener('locationChanged');
        this.removeEventListener('selected');
    }
}

try {
    customElements.define('location-cards', LocationCards);
} catch (e) {
    const h3 = document.createElement('h3');

    h3.innerHTML = "Site uses webcomponents.  Please try this on a browser that supports them!";

    document.body.appendChild(h3);
}