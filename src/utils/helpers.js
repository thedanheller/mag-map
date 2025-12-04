/**
 * Utility helper functions
 */

/**
 * Calculate distance between two coordinates in degrees
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
}

/**
 * Show loading indicator
 */
export function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
export function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

/**
 * Get map locale from language code
 */
export function getMapLocale(language) {
    const localeMap = {
        'pt_br': 'pt',
        'es_es': 'es',
        'en_us': 'en'
    };
    return localeMap[language] || 'en';
}
