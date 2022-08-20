import { ShowElement } from './services/html.tools.js';

const mainHtml = document.querySelector('html');

mainHtml.addEventListener('locationChanged', e => {
    const location = e.detail.locationSelected;

    const locationsMap = mainHtml.querySelector('locations-map');

    locationsMap.setAttribute('selected', location);
});

mainHtml.addEventListener('locationsChanged', e => {
    const locationsMap = mainHtml.querySelector('locations-map');

    locationsMap.setAttribute('locations', e.detail.locations);
});

mainHtml.addEventListener('toolbarItemSelectedChanged', e => {
    const locationFormElement = mainHtml.querySelector('location-form');
    const locationCardsElement = mainHtml.querySelector('location-cards');

    if (e.detail.id === 'add_location') {
        ShowElement(locationFormElement, true);
        ShowElement(locationCardsElement, false);
    } else {
        ShowElement(locationFormElement, false);
        ShowElement(locationCardsElement, true);
    }
});

