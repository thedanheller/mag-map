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
const logoContainer = document.querySelector('.logo-container');
const navLanguageSelect = document.getElementById('nav-language-select');
const languageToggle = document.querySelector('.language-toggle');
const navMusics = document.getElementById('nav-musics');
const navPeople = document.getElementById('nav-people');
const navSobre = document.getElementById('nav-sobre');

// Current selected language (default to Portuguese)
let currentLanguage = 'pt_br';

// Current view state (musics or people)
let currentView = 'musics';

// Map locale configuration
const localeMap = {
    'pt_br': 'pt',
    'es_es': 'es',
    'en_us': 'en'
};

// UI translations (loaded from CSV)
let translations = {};

// MAP CONFIGURATION
// Choose map provider: 'stadia', 'cartodb', or 'google'
// - stadia: Artistic watercolor style (requires free API key, 25k views/month)
// - cartodb: Clean & simple (free, unlimited, no API key)
// - google: High quality roads/satellite (requires API key, $200 free credit/month)
const MAP_PROVIDER = 'stadia';

/**
 * Load UI translations from CSV
 */
async function loadUITranslations() {
    try {
        const response = await fetch('data/ui-translations.csv');

        if (!response.ok) {
            console.warn('UI translations CSV not found');
            return;
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                // Convert CSV rows to translations object
                // Format: { pt_br: { song: 'Canção', teacher: 'Professor(a)', ... }, ... }
                const languages = ['pt_br', 'es_es', 'en_us', 'zh_cn', 'hi_in', 'fr_fr', 'ar_sa', 'bn_bd', 'ur_pk', 'id_id'];

                languages.forEach(lang => {
                    translations[lang] = {};
                });

                results.data.forEach(row => {
                    const key = row.key;
                    languages.forEach(lang => {
                        if (row[lang]) {
                            translations[lang][key] = row[lang];
                        }
                    });
                });

                console.log('UI translations loaded successfully');

                // Update navigation links with initial language
                updateNavigationLinks();
            },
            error: function(error) {
                console.error('Error parsing UI translations CSV:', error);
            }
        });
    } catch (error) {
        console.error('Error loading UI translations CSV:', error);
    }
}

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
                navLanguageSelect.innerHTML = '';

                // Populate navigation dropdown with languages
                results.data.forEach(lang => {
                    const option = document.createElement('option');
                    option.value = lang.id;
                    option.textContent = lang.name;
                    if (lang.id === currentLanguage) {
                        option.selected = true;
                    }
                    navLanguageSelect.appendChild(option);
                });

                // Add change event listener
                navLanguageSelect.addEventListener('change', handleLanguageChange);
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
    navLanguageSelect.value = currentLanguage;
    reloadContent();
}

/**
 * Update navigation links with current language
 */
function updateNavigationLinks() {
    const t = translations[currentLanguage] || translations['en_us'];
    if (t) {
        if (t.nav_people) navPeople.textContent = t.nav_people;
        if (t.nav_musics) navMusics.textContent = t.nav_musics;
        if (t.nav_sobre) navSobre.textContent = t.nav_sobre;
    }
}

/**
 * Reload all content with current language
 */
function reloadContent() {
    // Update navigation links
    updateNavigationLinks();

    // Reload welcome content and markers
    loadWelcomeContent();
    clearMarkers();
    loadCSV(currentView);

    console.log(`Language changed to: ${currentLanguage}`);
}

/**
 * Switch between musics and people views
 */
function switchView(view) {
    if (view === currentView) return;

    currentView = view;

    // Update active states
    if (view === 'musics') {
        navMusics.classList.add('active');
        navPeople.classList.remove('active');
    } else {
        navPeople.classList.add('active');
        navMusics.classList.remove('active');
    }

    // Clear markers and load new CSV
    clearMarkers();
    loadCSV(view);

    console.log(`Switched to ${view} view`);
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
        imageEl.src = `media/images/${image.trim()}`;
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

    // Don't auto-open modal on page load
    // Modal will only open when user clicks "Sobre" link
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

    // Sobre link click - open welcome modal
    const handleSobreClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openWelcomeModal();
    };

    navSobre.addEventListener('click', handleSobreClick);
    navSobre.addEventListener('touchend', handleSobreClick);

    // Musics link click - switch to musics view
    const handleMusicsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchView('musics');
    };

    navMusics.addEventListener('click', handleMusicsClick);
    navMusics.addEventListener('touchend', handleMusicsClick);

    // People link click - switch to people view
    const handlePeopleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchView('people');
    };

    navPeople.addEventListener('click', handlePeopleClick);
    navPeople.addEventListener('touchend', handlePeopleClick);

    // Language toggle click - show/hide dropdown
    const handleLanguageToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navLanguageSelect.classList.toggle('show');
    };

    languageToggle.addEventListener('click', handleLanguageToggle);

    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            navLanguageSelect.classList.remove('show');
        }
    });

    // Close dropdown when a language is selected
    navLanguageSelect.addEventListener('change', () => {
        navLanguageSelect.classList.remove('show');
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && welcomeModal.style.display === 'flex') {
            closeWelcomeModal();
        }
        if (e.key === 'Escape' && navLanguageSelect.classList.contains('show')) {
            navLanguageSelect.classList.remove('show');
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

    // Load map provider based on configuration
    switch (MAP_PROVIDER.toLowerCase()) {
        case 'stadia':
            if (typeof initStadiaMap === 'function') {
                initStadiaMap(map);
            } else {
                console.error('Stadia map provider not loaded. Include map-providers/stadia.js in HTML');
            }
            break;

        case 'cartodb':
            if (typeof initCartoDBMap === 'function') {
                initCartoDBMap(map);
            } else {
                console.error('CartoDB map provider not loaded. Include map-providers/cartodb.js in HTML');
            }
            break;

        case 'google':
            if (typeof initGoogleMap === 'function') {
                initGoogleMap(map);
            } else {
                console.error('Google Maps provider not loaded. Include map-providers/google.js in HTML');
            }
            break;

        default:
            console.error(`Unknown map provider: ${MAP_PROVIDER}. Using CartoDB as fallback.`);
            if (typeof initCartoDBMap === 'function') {
                initCartoDBMap(map);
            }
    }
}

/**
 * Load and parse CSV file based on current view
 */
async function loadCSV(view = currentView) {
    try {
        const csvFile = view === 'people' ? 'data/people.csv' : 'data/musics.csv';
        const response = await fetch(csvFile);

        if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.statusText}`);
        }

        const csvText = await response.text();

        // Parse CSV using PapaParse
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                console.log(`CSV parsed successfully: ${results.data.length} ${view}`);
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
        alert(`Error loading CSV file. Please ensure data/${view}.csv exists.`);
    }
}

/**
 * Calculate distance between two coordinates in degrees
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
}

/**
 * Offset overlapping markers so they're visible at default zoom
 */
function offsetOverlappingMarkers(markerDataArray) {
    // Minimum distance threshold (in degrees) - markers closer than this will be offset
    // 0.5 degrees is approximately 55km, perfect for same-city overlaps
    const MIN_DISTANCE = 0.5;
    const OFFSET_RADIUS = 1.5; // Radius for circular offset pattern

    const processedMarkers = [];
    const usedPositions = new Map(); // Track positions to detect overlaps

    markerDataArray.forEach((markerData, index) => {
        let { latitude, longitude } = markerData;
        let isOverlapping = false;
        let overlapGroup = null;

        // Check if this position is close to any existing marker
        for (let [key, group] of usedPositions.entries()) {
            const [existingLat, existingLng] = key.split(',').map(Number);
            const distance = calculateDistance(latitude, longitude, existingLat, existingLng);

            if (distance < MIN_DISTANCE) {
                isOverlapping = true;
                overlapGroup = group;
                break;
            }
        }

        if (isOverlapping && overlapGroup) {
            // Add to existing overlap group
            const groupSize = overlapGroup.length;
            const angle = (groupSize * 2 * Math.PI) / (groupSize + 1); // Evenly distribute in circle

            // Offset in a circular pattern
            latitude = overlapGroup[0].originalLat + (OFFSET_RADIUS * Math.sin(angle));
            longitude = overlapGroup[0].originalLng + (OFFSET_RADIUS * Math.cos(angle));

            // Also reposition existing markers in the group for better distribution
            overlapGroup.forEach((existing, i) => {
                const newAngle = (i * 2 * Math.PI) / (groupSize + 1);
                existing.latitude = existing.originalLat + (OFFSET_RADIUS * Math.sin(newAngle));
                existing.longitude = existing.originalLng + (OFFSET_RADIUS * Math.cos(newAngle));
            });

            // Store original position
            markerData.originalLat = overlapGroup[0].originalLat;
            markerData.originalLng = overlapGroup[0].originalLng;
            markerData.latitude = latitude;
            markerData.longitude = longitude;

            overlapGroup.push(markerData);
        } else {
            // No overlap, use original position
            markerData.originalLat = latitude;
            markerData.originalLng = longitude;
            markerData.latitude = latitude;
            markerData.longitude = longitude;

            // Create new overlap group
            const posKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
            usedPositions.set(posKey, [markerData]);
        }

        processedMarkers.push(markerData);
    });

    return processedMarkers;
}

/**
 * Add markers to the map from parsed CSV data
 */
function addMarkersToMap(data) {
    const bounds = [];

    // Prepare marker data with coordinates
    const markerDataArray = data.map((row, index) => {
        // Get language-specific fields
        const countryDescription = row[`country_description_${currentLanguage}`] || row.country_description_en_us || '';
        const songDescription = row[`song_description_${currentLanguage}`] || row.song_description_en_us || '';
        const teacherBio = row[`teacher_bio_${currentLanguage}`] || row.teacher_bio_en_us || '';

        // Get non-language-specific fields
        const {
            id, lat, lng,
            // Music fields
            country_name, country_flag,
            song_name, song_author, audio,
            teacher_name, teacher_photo, teacher_link,
            // People fields
            state, city, neighborhood, person_name, person_photo
        } = row;

        // Validate required fields
        if (!lat || !lng) {
            console.warn(`Skipping row ${index + 1}: missing lat/lng`);
            return null;
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        // Validate coordinates
        if (isNaN(latitude) || isNaN(longitude)) {
            console.warn(`Skipping row ${index + 1}: invalid coordinates`);
            return null;
        }

        return {
            index,
            id: id || index,
            latitude,
            longitude,
            // Music fields
            countryName: country_name,
            countryFlag: country_flag,
            countryDescription,
            songName: song_name,
            songAuthor: song_author,
            songDescription,
            audio: audio ? audio.trim() : '',
            teacherName: teacher_name,
            teacherPhoto: teacher_photo,
            teacherBio,
            teacherLink: teacher_link,
            // People fields
            state,
            city,
            neighborhood,
            person_name,
            person_photo
        };
    }).filter(item => item !== null);

    // Offset overlapping markers
    const offsetMarkers = offsetOverlappingMarkers(markerDataArray);

    // Create markers on the map
    offsetMarkers.forEach(markerData => {
        const { latitude, longitude } = markerData;

        const markerLabel = currentView === 'people'
            ? `${markerData.person_name} - ${markerData.neighborhood}`
            : `${markerData.songName} - ${markerData.countryName}`;
        console.log(`Marker ${markerData.index + 1} (${currentLanguage}): ${markerLabel} [${latitude.toFixed(2)}, ${longitude.toFixed(2)}]`);

        // Create marker with custom artistic icon
        const marker = L.marker([latitude, longitude], {
            icon: createArtisticIcon()
        })
            .addTo(map)
            .on('click', () => {
                openModal(markerData);
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
    // Check if this is people or musics data
    if (currentView === 'people') {
        openPeopleModal(markerData);
    } else {
        openMusicsModal(markerData);
    }
}

/**
 * Open modal for people data
 */
function openPeopleModal(markerData) {
    const { state, city, neighborhood, person_name, person_photo } = markerData;

    // Hide music-specific sections
    document.querySelector('.song-section').style.display = 'none';
    document.querySelector('.audio-container').classList.add('hidden');

    // Show and update country section (reused for location)
    const countrySection = document.querySelector('.country-section');
    countrySection.style.display = 'block';
    document.getElementById('modal-country-flag').textContent = '';

    // Display location as "Neighborhood, City - State"
    const location = [neighborhood, city, state].filter(Boolean).join(', ');
    document.getElementById('modal-country-name').textContent = location || '';
    document.getElementById('modal-country-description').textContent = '';

    // Show and update teacher section (reused for person)
    const teacherSection = document.querySelector('.teacher-section');
    teacherSection.style.display = 'block';
    document.getElementById('modal-teacher-subtitle').textContent = '';
    document.getElementById('modal-teacher-name').textContent = person_name || '';
    document.getElementById('modal-teacher-bio').textContent = '';

    // Set person photo
    const teacherPhotoContainer = document.getElementById('modal-teacher-photo-container');
    const teacherPhotoEl = document.getElementById('modal-teacher-photo');
    if (person_photo) {
        teacherPhotoEl.src = `media/images/people/${person_photo}`;
        teacherPhotoEl.alt = person_name || 'Person';
        teacherPhotoContainer.classList.remove('hidden');

        teacherPhotoEl.onerror = () => {
            console.warn(`Failed to load person photo: ${person_photo}`);
            teacherPhotoContainer.classList.add('hidden');
        };
    } else {
        teacherPhotoContainer.classList.add('hidden');
    }

    // Hide teacher link
    document.getElementById('modal-teacher-link').style.display = 'none';

    // Show modal
    modal.classList.add('show');
    modal.style.display = 'flex';
}

/**
 * Open modal for musics data
 */
function openMusicsModal(markerData) {
    const {
        countryName, countryFlag, countryDescription,
        songName, songAuthor, songDescription, audio,
        teacherName, teacherPhoto, teacherBio, teacherLink
    } = markerData;

    // Show all sections
    document.querySelector('.song-section').style.display = 'block';
    document.querySelector('.country-section').style.display = 'block';
    document.querySelector('.teacher-section').style.display = 'block';

    // Set UI translations based on current language
    const t = translations[currentLanguage] || translations['en_us'];
    document.getElementById('modal-song-subtitle').textContent = t.song;
    document.getElementById('modal-teacher-subtitle').textContent = t.teacher;

    // Set country information
    document.getElementById('modal-country-flag').textContent = countryFlag || '';
    document.getElementById('modal-country-name').textContent = countryName || '';
    document.getElementById('modal-country-description').textContent = countryDescription || '';

    // Set song information
    document.getElementById('modal-song-name').textContent = songName || '';
    const songAuthorEl = document.getElementById('modal-song-author');
    if (songAuthor && songAuthor.trim() && songAuthor.toLowerCase() !== 'traditional') {
        songAuthorEl.textContent = `${t.by || 'by'} ${songAuthor}`;
        songAuthorEl.style.display = 'block';
    } else if (songAuthor && songAuthor.toLowerCase() === 'traditional') {
        songAuthorEl.textContent = t.traditional || 'Traditional';
        songAuthorEl.style.display = 'block';
    } else {
        songAuthorEl.style.display = 'none';
    }
    document.getElementById('modal-song-description').textContent = songDescription || '';

    // Set audio
    const audioContainer = document.getElementById('modal-audio-container');
    const audioEl = document.getElementById('modal-audio');
    if (audio) {
        audioEl.src = `media/audio/${audio}`;
        audioContainer.classList.remove('hidden');

        // Handle audio load error
        audioEl.onerror = () => {
            console.warn(`Failed to load audio: ${audio}`);
            audioContainer.classList.add('hidden');
        };
    } else {
        audioContainer.classList.add('hidden');
    }

    // Set teacher information
    document.getElementById('modal-teacher-name').textContent = teacherName || '';
    document.getElementById('modal-teacher-bio').textContent = teacherBio || '';

    // Set teacher photo
    const teacherPhotoContainer = document.getElementById('modal-teacher-photo-container');
    const teacherPhotoEl = document.getElementById('modal-teacher-photo');
    if (teacherPhoto) {
        teacherPhotoEl.src = `media/images/teachers/${teacherPhoto}`;
        teacherPhotoEl.alt = teacherName || 'Teacher';
        teacherPhotoContainer.classList.remove('hidden');

        // Handle photo load error
        teacherPhotoEl.onerror = () => {
            console.warn(`Failed to load teacher photo: ${teacherPhoto}`);
            teacherPhotoContainer.classList.add('hidden');
        };
    } else {
        teacherPhotoContainer.classList.add('hidden');
    }

    // Set teacher link
    const teacherLinkEl = document.getElementById('modal-teacher-link');
    if (teacherLink && teacherLink.trim()) {
        teacherLinkEl.href = teacherLink;
        teacherLinkEl.textContent = t.learn_more || 'Learn more';
        teacherLinkEl.style.display = 'inline-block';
    } else {
        teacherLinkEl.style.display = 'none';
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

    // Set initial active state for musics view
    navMusics.classList.add('active');

    loadUITranslations();
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
