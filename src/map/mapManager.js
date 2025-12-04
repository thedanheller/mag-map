/**
 * Map Manager - Handles Leaflet map initialization and control
 */

let map = null;
const MAP_PROVIDER = 'stadia'; // Can be 'stadia', 'cartodb', or 'google'

/**
 * Initialize the Leaflet map
 */
export function initMap() {
    // Create map centered on world view
    // Disable default zoom control (top-left) to avoid overlap with logo
    map = L.map('map', { zoomControl: false }).setView([20, 0], 2);

    // Add zoom control to bottom-right corner
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Load map provider based on configuration
    switch (MAP_PROVIDER.toLowerCase()) {
        case 'stadia':
            if (typeof initStadiaMap === 'function') {
                initStadiaMap(map);
            } else {
                console.error('Stadia map provider not loaded');
                initCartoDBMap(map); // Fallback
            }
            break;
        case 'google':
            if (typeof initGoogleMap === 'function') {
                initGoogleMap(map);
            } else {
                console.error('Google map provider not loaded');
                initCartoDBMap(map); // Fallback
            }
            break;
        case 'cartodb':
        default:
            initCartoDBMap(map);
            break;
    }

    console.log('Map initialized with provider:', MAP_PROVIDER);
    return map;
}

/**
 * Get the map instance
 */
export function getMap() {
    return map;
}

/**
 * Fit map bounds to show all markers
 */
export function fitBoundsToMarkers(bounds, options = {}) {
    if (!map || !bounds || bounds.length === 0) {
        return;
    }

    const defaultOptions = {
        padding: [50, 50]
    };

    map.fitBounds(bounds, { ...defaultOptions, ...options });
}

/**
 * Set map view to specific coordinates and zoom
 */
export function setMapView(lat, lng, zoom) {
    if (!map) {
        return;
    }

    map.setView([lat, lng], zoom);
}
