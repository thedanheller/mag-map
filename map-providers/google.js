/**
 * Google Maps Provider - High Quality Satellite & Road Maps
 * Requires API key from https://console.cloud.google.com/
 * Pricing: $0.007 per map load (1000 loads = $7), $200 free credit/month
 *
 * Setup instructions:
 * 1. Go to https://console.cloud.google.com/apis/credentials
 * 2. Create a new API key
 * 3. Enable "Maps JavaScript API"
 * 4. Replace 'YOUR_GOOGLE_API_KEY_HERE' below
 */

function initGoogleMap(map) {
    // IMPORTANT: Replace with your actual Google Maps API key
    const googleApiKey = 'my_api_key';

    if (googleApiKey === 'my_api_key') {
        console.error('Google Maps API key not configured! Please add your API key in map-providers/google.js');
        alert('Google Maps requires an API key. Please configure it in map-providers/google.js');
        return;
    }

    // Google Roads layer
    L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=' + googleApiKey, {
        attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        minZoom: 1
    }).addTo(map);

    console.log('Map initialized with Google Maps');
}

// Alternative Google Map Layers:
// Roads: lyrs=m
// Satellite: lyrs=s
// Hybrid (Satellite + Labels): lyrs=y
// Terrain: lyrs=p
// Roads without labels: lyrs=r
// Terrain without labels: lyrs=t
