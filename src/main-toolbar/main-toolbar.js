class MainToolbar extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('click', ev => {
            this.setCurrent(ev);
        })
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });

        const template = document.currentScript.ownerDocument.querySelector('#main-toolbar-template');

        const templateClone = template.content.cloneNode(true);

        shadowRoot.appendChild(templateClone);
    }

    setCurrent(e) {
        e.preventDefault();

        const composedPath = e.composedPath();

        if (composedPath.length > 0) {
            this.clearOldSelection(composedPath);

            this.setNewSelection(composedPath);
        }
    }

    setNewSelection(composedPath) {
        const elementClicked = composedPath[0];

        if (elementClicked.tagName === 'A') {
            elementClicked.classList.add('selected');

            this.emitAddLocation(elementClicked);
        }
    }

    clearOldSelection(composedPath) {
        const linkList = composedPath[2];

        if (linkList != null && linkList.tagName === 'OL') {
            const selectedElement = composedPath[2].querySelector('.selected');

            if (selectedElement != null && selectedElement.tagName === 'A') {
                selectedElement.classList.remove('selected');
            }
        }
    }

    emitAddLocation(element) {
        this.dispatchEvent(new CustomEvent('toolbarItemSelectedChanged', {
            bubbles: true,
            composed: true,
            detail: { id: element.id }
        }));
    }
}

try {
    customElements.define('main-toolbar', MainToolbar);
} catch (e) {
    const h3 = document.createElement('h3');

    h3.innerHTML = "Site uses webcomponents.  Please try this on a browser that supports them!";

    document.body.appendChild(h3);
}