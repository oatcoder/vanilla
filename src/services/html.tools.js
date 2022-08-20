export function BuildNotCampatableMessage(doc) {
    const h3 = doc.createElement('h3');

    h3.innerHTML = '';

    doc.body.appendChild(h3);
}

export function ShowElement(element, isVisible) {
    if (isVisible) {
        if (element.classList.contains('hidden')) {
            element.classList.remove('hidden');
        }
    } else {
        if (!element.classList.contains('hidden')) {
            element.classList.add('hidden');
        }
    }
}