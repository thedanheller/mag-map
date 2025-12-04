/**
 * Magnífica Orchestra Interactive Map
 * Main application entry point
 */

import { initMap } from './src/map/mapManager.js';
import { createMarkers } from './src/map/markerManager.js';
import { loadMusicsCSV } from './src/data/csvLoader.js';
import { loadUITranslations, updateNavigationLinks } from './src/data/translationManager.js';
import { setupNavigationEvents } from './src/ui/navigationManager.js';
import { setupModalEvents } from './src/ui/modalManager.js';
import { showLoading, hideLoading } from './src/utils/helpers.js';

/**
 * Load welcome modal content
 */
async function loadWelcomeContent() {
    try {
        const response = await fetch('data/welcome.csv');

        if (!response.ok) {
            console.warn('Welcome CSV not found');
            return;
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results.data.length > 0) {
                    displayWelcomeModal(results.data[0]);
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
    const currentLanguage = 'pt_br'; // Default language

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
        imageEl.src = `media/images/${image.trim()}`;
        imageEl.alt = title || 'Welcome';
        imageContainer.classList.remove('hidden');

        imageEl.onerror = () => {
            console.warn(`Failed to load welcome image: ${image}`);
            imageContainer.classList.add('hidden');
        };
    } else {
        imageContainer.classList.add('hidden');
    }

    // Don't auto-open modal on page load
}

/**
 * Populate language dropdown
 */
async function populateLanguageDropdown() {
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
                const navLanguageSelect = document.getElementById('nav-language-select');
                navLanguageSelect.innerHTML = '';

                const currentLanguage = 'pt_br';

                results.data.forEach(lang => {
                    const option = document.createElement('option');
                    option.value = lang.id;
                    option.textContent = lang.name;
                    if (lang.id === currentLanguage) {
                        option.selected = true;
                    }
                    navLanguageSelect.appendChild(option);
                });
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
 * Initialize application
 */
async function init() {
    console.log('Initializing Magnífica Orchestra Map...');

    // Initialize map
    initMap();

    // Setup event listeners
    setupModalEvents();
    setupNavigationEvents();

    // Load translations and update UI
    await loadUITranslations();
    await updateNavigationLinks();

    // Populate language dropdown
    await populateLanguageDropdown();

    // Load welcome content (but don't show it)
    await loadWelcomeContent();

    // Load initial data (musics view)
    showLoading();
    try {
        const musicsData = await loadMusicsCSV();
        createMarkers(musicsData, 'musics', 'pt_br');
        hideLoading();
    } catch (error) {
        console.error('Error loading initial data:', error);
        hideLoading();
        alert('Error loading map data. Please refresh the page.');
    }

    console.log('Application initialized successfully!');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
