/**
 * Interactive Map Application
 * Loads markers from CSV and displays them on a Leaflet map
 */

// Global variables
let map;
let markers = [];
const modal = document.getElementById('modal');
const loading = document.getElementById('loading');
const welcomeModal = document.getElementById('welcome-modal');
const logoCircle = document.getElementById('logo-circle');
const welcomeLanguageSelect = document.getElementById('welcome-language-select');

// Current selected language (default to Portuguese)
let currentLanguage = 'pt_br';

// Map locale configuration
const localeMap = {
    'pt_br': 'pt',
    'es_es': 'es',
    'en_us': 'en'
};

// MAP CONFIGURATION
// Set to true for beautiful watercolor map (requires free Stadia API key - 25k views/month)
// Set to false for simple free map (unlimited, no API key needed)
const USE_ARTISTIC_MAP = true;

/**
 * Load languages from CSV and populate dropdowns
 */
async function loadLanguages() {
    try {
        const response = await fetch('data/languages.csv');

        if (!response.ok) {
            console.warn('Languages CSV not found');
            return;
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                // Clear loading options from dropdown
                welcomeLanguageSelect.innerHTML = '';

                // Populate dropdown with languages
                results.data.forEach(lang => {
                    const option = document.createElement('option');
                    option.value = lang.id;
                    option.textContent = lang.name;
                    if (lang.id === currentLanguage) {
                        option.selected = true;
                    }
                    welcomeLanguageSelect.appendChild(option);
                });

                // Add change event listener
                welcomeLanguageSelect.addEventListener('change', handleLanguageChange);
            },
            error: function(error) {
                console.error('Error parsing languages CSV:', error);
            }
        });
    } catch (error) {
        console.error('Error loading languages CSV:', error);
    }
}

/**
 * Handle language change from dropdown
 */
function handleLanguageChange(e) {
    currentLanguage = e.target.value;
    reloadContent();
}

/**
 * Reload all content with current language
 */
function reloadContent() {
    // Reload welcome content and markers
    loadWelcomeContent();
    clearMarkers();
    loadCSV();

    console.log(`Language changed to: ${currentLanguage}`);
}

/**
 * Clear all markers from the map
 */
function clearMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
}

/**
 * Load and display welcome content from CSV
 */
async function loadWelcomeContent() {
    try {
        const response = await fetch('data/welcome.csv');

        if (!response.ok) {
            console.warn('Welcome CSV not found, skipping welcome modal');
            return;
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results.data.length > 0) {
                    const welcomeData = results.data[0];
                    displayWelcomeModal(welcomeData);
                }
            },
            error: function(error) {
                console.error('Error parsing welcome CSV:', error);
            }
        });
    } catch (error) {
        console.error('Error loading welcome CSV:', error);
    }
}

/**
 * Display welcome modal with content
 */
function displayWelcomeModal(data) {
    // Get title and content based on current language
    const title = data[`title_${currentLanguage}`] || data.title_en_us || 'Welcome';
    const content = data[`content_${currentLanguage}`] || data.content_en_us || '';
    const image = data.image;

    // Set title
    document.getElementById('welcome-title').textContent = title;

    // Set text content
    const textEl = document.getElementById('welcome-text');
    if (content) {
        textEl.textContent = content;
        textEl.classList.remove('hidden');
    } else {
        textEl.classList.add('hidden');
    }

    // Set image
    const imageContainer = document.getElementById('welcome-image-container');
    const imageEl = document.getElementById('welcome-image');
    if (image && image.trim()) {
        imageEl.src = image.trim();
        imageEl.alt = title || 'Welcome';
        imageContainer.classList.remove('hidden');

        // Handle image load error
        imageEl.onerror = () => {
            console.warn(`Failed to load welcome image: ${image}`);
            imageContainer.classList.add('hidden');
        };
    } else {
        imageContainer.classList.add('hidden');
    }

    // Show modal
    openWelcomeModal();
}

/**
 * Open welcome modal
 */
function openWelcomeModal() {
    welcomeModal.classList.add('show');
    welcomeModal.style.display = 'flex';
}

/**
 * Close welcome modal
 */
function closeWelcomeModal() {
    welcomeModal.classList.remove('show');
    welcomeModal.style.display = 'none';
}

/**
 * Setup welcome modal event listeners
 */
function setupWelcomeModalEvents() {
    const closeButton = welcomeModal.querySelector('.welcome-close');

    // Close button click - handle both click and touch
    const handleWelcomeClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeWelcomeModal();
    };

    closeButton.addEventListener('click', handleWelcomeClose);
    closeButton.addEventListener('touchend', handleWelcomeClose);

    // Click outside modal content
    welcomeModal.addEventListener('click', (e) => {
        if (e.target === welcomeModal) {
            closeWelcomeModal();
        }
    });

    // Logo circle click - reopen welcome modal
    const handleLogoClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openWelcomeModal();
    };

    logoCircle.addEventListener('click', handleLogoClick);
    logoCircle.addEventListener('touchend', handleLogoClick);

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && welcomeModal.style.display === 'flex') {
            closeWelcomeModal();
        }
    });
}

/**
 * Create custom artistic marker icon
 */
function createArtisticIcon() {
    const svgIcon = `
        <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <!-- Outer glow -->
            <ellipse cx="20" cy="45" rx="12" ry="4" fill="rgba(139, 69, 19, 0.2)"/>
            <!-- Pin shape -->
            <path d="M20 2 C12 2, 6 8, 6 16 C6 24, 20 42, 20 42 C20 42, 34 24, 34 16 C34 8, 28 2, 20 2 Z"
                  fill="url(#pinGradient)"
                  stroke="#5d2e0f"
                  stroke-width="2"
                  filter="url(#shadow)"/>
            <!-- Inner circle -->
            <circle cx="20" cy="16" r="6" fill="rgba(255, 255, 255, 0.9)" stroke="#8b4513" stroke-width="1.5"/>
            <!-- Center dot -->
            <circle cx="20" cy="16" r="3" fill="#8b4513"/>
            <defs>
                <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#d4a574;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#c08552;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8b4513;stop-opacity:1" />
                </linearGradient>
            </defs>
        </svg>
    `;

    return L.divIcon({
        className: 'custom-pin',
        html: svgIcon,
        iconSize: [40, 50],
        iconAnchor: [20, 45],
        popupAnchor: [0, -45]
    });
}

/**
 * Initialize the map
 */
function initMap() {
    // Create map centered on world view
    // Disable default zoom control (top-left) to avoid overlap with logo
    map = L.map('map', { zoomControl: false }).setView([20, 0], 2);

    // Add zoom control to bottom-right corner
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    if (USE_ARTISTIC_MAP) {

    // STADIA MAPS API KEY
    // Sign up for free at: https://client.stadiamaps.com/signup/
    // Free tier: 25,000 map views/month (no credit card required)
    // Replace 'YOUR_API_KEY_HERE' with your actual API key
    const stadiaApiKey = '17d026a2-4644-42f2-922d-5fff5e6a1559';

        // NOTE: Stamen Watercolor tiles are pre-rendered and don't support language switching
        // The labels are baked into the images (typically in English)
        // For multilingual support, you would need to use Mapbox or similar services

        // Add Stamen Watercolor tiles for artistic look (base layer)
        L.tileLayer(`https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=${stadiaApiKey}`, {
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com">Stamen Design</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>',
            maxZoom: 16,
            minZoom: 1
        }).addTo(map);

        // Add country borders overlay (Stamen Toner Lines)
        L.tileLayer(`https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}.png?api_key=${stadiaApiKey}`, {
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com">Stamen Design</a>',
            maxZoom: 16,
            minZoom: 1,
            opacity: 0.4
        }).addTo(map);

        // Add country labels overlay (Stamen Toner Labels - English only, pre-rendered)
        L.tileLayer(`https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}.png?api_key=${stadiaApiKey}`, {
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com">Stamen Design</a>',
            maxZoom: 16,
            minZoom: 1,
            opacity: 0.5
        }).addTo(map);

        console.log('Map initialized with artistic watercolor tiles (labels in English only)');
    } else {
        // OPTION 2: FREE MAP (CartoDB - Unlimited, No API Key)
        // This is a simple, clean map with country borders included
        // Completely free with no usage limits
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
            minZoom: 1
        }).addTo(map);

        console.log('Map initialized with free CartoDB tiles');
    }
}

/**
 * Load and parse CSV file
 */
async function loadCSV() {
    try {
        const response = await fetch('data/markers.csv');

        if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.statusText}`);
        }

        const csvText = await response.text();

        // Parse CSV using PapaParse
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                console.log('CSV parsed successfully:', results.data.length, 'markers');
                addMarkersToMap(results.data);
                hideLoading();
            },
            error: function(error) {
                console.error('CSV parsing error:', error);
                hideLoading();
                alert('Error parsing CSV file. Please check the console for details.');
            }
        });
    } catch (error) {
        console.error('Error loading CSV:', error);
        hideLoading();
        alert('Error loading CSV file. Please ensure data/markers.csv exists.');
    }
}

/**
 * Add markers to the map from parsed CSV data
 */
function addMarkersToMap(data) {
    const bounds = [];

    data.forEach((row, index) => {
        // Get language-specific title and description
        const title = row[`title_${currentLanguage}`] || row.title_en_us || row.title || 'Untitled';
        const description = row[`description_${currentLanguage}`] || row.description_en_us || row.description || '';
        const { id, lat, lng, image, audio } = row;

        console.log(`Marker ${index + 1} (${currentLanguage}): ${title}`);

        // Validate required fields
        if (!lat || !lng) {
            console.warn(`Skipping row ${index + 1}: missing lat/lng`);
            return;
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        // Validate coordinates
        if (isNaN(latitude) || isNaN(longitude)) {
            console.warn(`Skipping row ${index + 1}: invalid coordinates`);
            return;
        }

        // Create marker with custom artistic icon
        const marker = L.marker([latitude, longitude], {
            icon: createArtisticIcon()
        })
            .addTo(map)
            .on('click', () => {
                openModal({
                    id: id || index,
                    title: title,
                    description: description,
                    image: image ? image.trim() : '',
                    audio: audio ? audio.trim() : ''
                });
            });

        markers.push(marker);
        bounds.push([latitude, longitude]);
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }

    console.log(`Added ${markers.length} markers to the map`);
}

/**
 * Open modal with marker details
 */
function openModal(markerData) {
    const { title, description, image, audio } = markerData;

    // Set title
    document.getElementById('modal-title').textContent = title;

    // Set description
    const descriptionEl = document.getElementById('modal-description');
    if (description) {
        descriptionEl.textContent = description;
        descriptionEl.classList.remove('hidden');
    } else {
        descriptionEl.classList.add('hidden');
    }

    // Set image
    const imageContainer = document.getElementById('modal-image-container');
    const imageEl = document.getElementById('modal-image');
    if (image) {
        imageEl.src = image;
        imageEl.alt = title;
        imageContainer.classList.remove('hidden');

        // Handle image load error
        imageEl.onerror = () => {
            console.warn(`Failed to load image: ${image}`);
            imageContainer.classList.add('hidden');
        };
    } else {
        imageContainer.classList.add('hidden');
    }

    // Set audio
    const audioContainer = document.getElementById('modal-audio-container');
    const audioEl = document.getElementById('modal-audio');
    if (audio) {
        audioEl.src = audio;
        audioContainer.classList.remove('hidden');

        // Handle audio load error
        audioEl.onerror = () => {
            console.warn(`Failed to load audio: ${audio}`);
            audioContainer.classList.add('hidden');
        };
    } else {
        audioContainer.classList.add('hidden');
    }

    // Show modal
    modal.classList.add('show');
    modal.style.display = 'flex';
}

/**
 * Close modal
 */
function closeModal() {
    modal.classList.remove('show');
    modal.style.display = 'none';

    // Stop audio if playing
    const audioEl = document.getElementById('modal-audio');
    audioEl.pause();
    audioEl.currentTime = 0;
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    loading.style.display = 'none';
}

/**
 * Setup modal event listeners
 */
function setupModalEvents() {
    // Select the close button specifically within the marker modal
    const closeButton = modal.querySelector('.close-button');

    // Close button click - handle both click and touch
    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    };

    closeButton.addEventListener('click', handleClose);
    closeButton.addEventListener('touchend', handleClose);

    // Click outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

/**
 * Initialize application
 */
function init() {
    console.log('Initializing application...');
    initMap();
    setupModalEvents();
    setupWelcomeModalEvents();
    loadLanguages();
    loadCSV();
    loadWelcomeContent();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
