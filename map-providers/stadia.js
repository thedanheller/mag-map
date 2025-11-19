/**
 * Stadia Maps Provider - Artistic Watercolor Style
 * Requires free API key from https://client.stadiamaps.com/signup/
 * Free tier: 25,000 map views/month (no credit card required)
 */

function initStadiaMap(map) {
    const stadiaApiKey = '17d026a2-4644-42f2-922d-5fff5e6a1559';

    // Stamen Watercolor tiles for artistic look (base layer)
    L.tileLayer(`https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=${stadiaApiKey}`, {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com">Stamen Design</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>',
        maxZoom: 16,
        minZoom: 1
    }).addTo(map);

    // Country borders overlay (Stamen Toner Lines)
    L.tileLayer(`https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}.png?api_key=${stadiaApiKey}`, {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com">Stamen Design</a>',
        maxZoom: 16,
        minZoom: 1,
        opacity: 0.4
    }).addTo(map);

    // Country labels overlay (Stamen Toner Labels - English only)
    L.tileLayer(`https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}.png?api_key=${stadiaApiKey}`, {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com">Stamen Design</a>',
        maxZoom: 16,
        minZoom: 1,
        opacity: 0.5
    }).addTo(map);

    console.log('Map initialized with Stadia watercolor tiles (labels in English only)');
}
