class LocationForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });

        const template = document.currentScript.ownerDocument.querySelector('#location-form-template');

        const templateClone = template.content.cloneNode(true);

        shadowRoot.appendChild(templateClone);
    }
}

try {
    customElements.define('location-form', LocationForm);
} catch (e) {
    const h3 = document.createElement('h3');

    h3.innerHTML = 'Site uses webcomponents.  Please try this on a browser that supports them!';

    document.body.appendChild(h3);
}