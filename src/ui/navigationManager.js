/**
 * Navigation Manager - Handles view switching and navigation
 */

import { loadMusicsCSV, loadPeopleCSV } from '../data/csvLoader.js';
import { clearMarkers, createMarkers } from '../map/markerManager.js';
import { getCurrentLanguage, setCurrentLanguage, updateNavigationLinks } from '../data/translationManager.js';
import { showLoading, hideLoading } from '../utils/helpers.js';

let currentView = 'musics';

// Navigation elements
const navMusics = document.getElementById('nav-musics');
const navPeople = document.getElementById('nav-people');
const navSobre = document.getElementById('nav-sobre');
const navLanguageSelect = document.getElementById('nav-language-select');
const languageToggle = document.querySelector('.language-toggle');
const welcomeModal = document.getElementById('welcome-modal');

/**
 * Switch between musics and people views
 */
export async function switchView(view) {
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

    // Clear markers and load new data
    clearMarkers();
    showLoading();

    try {
        const data = view === 'people' ? await loadPeopleCSV() : await loadMusicsCSV();
        createMarkers(data, view, getCurrentLanguage());
        hideLoading();
        console.log(`Switched to ${view} view`);
    } catch (error) {
        console.error(`Error switching to ${view} view:`, error);
        hideLoading();
        alert(`Error loading ${view} data. Please try again.`);
    }
}

/**
 * Get current view
 */
export function getCurrentView() {
    return currentView;
}

/**
 * Handle language change
 */
async function handleLanguageChange(e) {
    const newLanguage = e.target.value;
    setCurrentLanguage(newLanguage);
    navLanguageSelect.value = newLanguage;

    // Update navigation links
    updateNavigationLinks();

    // Reload current view with new language
    clearMarkers();
    showLoading();

    try {
        const data = currentView === 'people' ? await loadPeopleCSV() : await loadMusicsCSV();
        createMarkers(data, currentView, newLanguage);
        hideLoading();
        console.log(`Language changed to: ${newLanguage}`);
    } catch (error) {
        console.error('Error reloading data:', error);
        hideLoading();
    }
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
 * Setup all navigation event listeners
 */
export function setupNavigationEvents() {
    // Musics link click
    const handleMusicsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchView('musics');
    };

    navMusics.addEventListener('click', handleMusicsClick);
    navMusics.addEventListener('touchend', handleMusicsClick);

    // People link click
    const handlePeopleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchView('people');
    };

    navPeople.addEventListener('click', handlePeopleClick);
    navPeople.addEventListener('touchend', handlePeopleClick);

    // Sobre link click
    const handleSobreClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openWelcomeModal();
    };

    navSobre.addEventListener('click', handleSobreClick);
    navSobre.addEventListener('touchend', handleSobreClick);

    // Language toggle click
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
    navLanguageSelect.addEventListener('change', (e) => {
        navLanguageSelect.classList.remove('show');
        handleLanguageChange(e);
    });

    // Welcome modal close button
    const welcomeCloseButton = welcomeModal.querySelector('.welcome-close');
    const handleWelcomeClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeWelcomeModal();
    };

    welcomeCloseButton.addEventListener('click', handleWelcomeClose);
    welcomeCloseButton.addEventListener('touchend', handleWelcomeClose);

    // Click outside welcome modal
    welcomeModal.addEventListener('click', (e) => {
        if (e.target === welcomeModal) {
            closeWelcomeModal();
        }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (welcomeModal.style.display === 'flex') {
                closeWelcomeModal();
            }
            if (navLanguageSelect.classList.contains('show')) {
                navLanguageSelect.classList.remove('show');
            }
        }
    });

    // Set initial active state
    navMusics.classList.add('active');
}
