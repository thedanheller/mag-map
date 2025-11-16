/**
 * Interactive Map Application
 * Loads markers from CSV and displays them on a Leaflet map
 */

// Global variables
let map;
let markers = [];
const modal = document.getElementById('modal');
const loading = document.getElementById('loading');

/**
 * Initialize the map
 */
function initMap() {
    // Create map centered on world view
    map = L.map('map').setView([20, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 2
    }).addTo(map);

    console.log('Map initialized');
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
        const { id, title, lat, lng, description, image, audio } = row;

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

        // Create marker
        const marker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`<b>${title || 'Untitled'}</b>`)
            .on('click', () => {
                openModal({
                    id: id || index,
                    title: title || 'Untitled',
                    description: description || '',
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
    const closeButton = document.querySelector('.close-button');

    // Close button click
    closeButton.addEventListener('click', closeModal);

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
    loadCSV();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
