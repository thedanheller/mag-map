/**
 * CartoDB Provider - Clean & Simple
 * Completely free with no usage limits
 * No API key required
 */

function initCartoDBMap(map) {
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        minZoom: 1
    }).addTo(map);

    console.log('Map initialized with CartoDB tiles (free, unlimited)');
}
