/**
 * CartoDB Provider - Artistic Style (Enhanced)
 * Completely free with no usage limits
 * No API key required
 *
 * Available CartoDB styles:
 * - light_all: Light background with all features
 * - dark_all: Dark background
 * - voyager: Balanced, colorful style
 * - rastertiles/voyager_labels_under: Voyager with labels under roads
 */

function initCartoDBMap(map) {
    // Base layer - Voyager style (more colorful and artistic than light)
    const baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        minZoom: 1
    }).addTo(map);

    // Labels layer on top (for better readability)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 20,
        minZoom: 1,
        opacity: 0.7
    }).addTo(map);

    // Add CSS filter to the map container for a more artistic, watercolor-like effect
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
        // Apply subtle filters to make it look more artistic
        mapContainer.style.filter = 'saturate(1.2) contrast(0.95) brightness(1.05)';
    }

    console.log('Map initialized with CartoDB Voyager tiles (free, unlimited, artistic style)');
}
