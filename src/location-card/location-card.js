const currentDocument = document.currentScript.ownerDocument;


class LocationCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });

        const template = currentDocument.querySelector('#location-card-template');

        this.addEventListener('click', this.toggleCard.bind(this));

        const templateClone = template.content.cloneNode(true);

        shadowRoot.appendChild(templateClone);

        this.render();
    }

    render() {
        this.shadowRoot.querySelector('.card__title').innerHTML = this.buildDateCreatedElement();
        this.shadowRoot.querySelector('.card__address').innerHTML = this.getAttribute('address');
        this.shadowRoot.querySelector('.card__geo').innerHTML = this.buildGeoElement();
    }

    toggleCard(e) {
        this.emitSelectedEvent();
    }

    toggleExpandMoreIcon(e) {
        const expandIconElement = this.shadowRoot.querySelector('.material-icons');

        if (e === 'collapse') {
            expandIconElement.innerHTML = 'expand_less';
            expandIconElement.classList.add('active');
        } else if (e === 'expand') {
            expandIconElement.innerHTML = 'expand_more';
            expandIconElement.classList.remove('active');
        }
    }

    buildGeoElement() {
        const lat = this.getAttribute('lat');
        const long = this.getAttribute('long');

        return `Lat: ${lat} / Long: ${long}`;
    }

    buildDateCreatedElement() {
        if (!this.hasAttribute('dateCreated')) {
            return '';
        }

        const dateFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };

        const dateCreatedVal = this.getAttribute('dateCreated');

        const dateCreated = new Date(dateCreatedVal * 1000);

        return dateCreated.toLocaleDateString('en-US', dateFormatOptions);
    }

    emitSelectedEvent() {
        this.dispatchEvent(new Event('selected', { bubbles: true, composed: true }));
    }

    disconnectedCallback() {

    }

    static get observedAttributes() {
        return [ 'is-selected' ];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (!oldVal && !newVal) return;

        let elem = this.shadowRoot.querySelector('.location-more-info');

        if (name === 'is-selected') {
            if (newVal) {
                elem.style.display = 'block';

                this.toggleExpandMoreIcon('collapse');
            } else {
                elem.style.display = 'none';

                this.toggleExpandMoreIcon('expand');
            }
        }
    }
}

try {
    customElements.define('location-card', LocationCard);
} catch (e) {
    const h3 = document.createElement('h3');

    h3.innerHTML = "Site uses webcomponents.  Please try this on a browser that supports them!";

    document.body.appendChild(h3);
}