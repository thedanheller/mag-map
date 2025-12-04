/**
 * UI Translation Manager
 */

let translations = {};
let currentLanguage = 'pt_br';

/**
 * Load UI translations from CSV
 */
export async function loadUITranslations() {
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
 * Load available languages from CSV
 */
export async function loadLanguages() {
    try {
        const response = await fetch('data/languages.csv');

        if (!response.ok) {
            console.warn('Languages CSV not found');
            return [];
        }

        const csvText = await response.text();
        const languages = [];

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                languages.push(...results.data);
            },
            error: function(error) {
                console.error('Error parsing languages CSV:', error);
            }
        });

        return languages;
    } catch (error) {
        console.error('Error loading languages CSV:', error);
        return [];
    }
}

/**
 * Get translation for key in current language
 */
export function getTranslation(key, language = currentLanguage) {
    const t = translations[language] || translations['en_us'];
    return t ? t[key] || key : key;
}

/**
 * Get all translations object
 */
export function getTranslations() {
    return translations;
}

/**
 * Set current language
 */
export function setCurrentLanguage(language) {
    currentLanguage = language;
}

/**
 * Get current language
 */
export function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Update navigation link text based on current language
 */
export function updateNavigationLinks() {
    const navPeople = document.getElementById('nav-people');
    const navMusics = document.getElementById('nav-musics');
    const navSobre = document.getElementById('nav-sobre');

    const t = translations[currentLanguage] || translations['en_us'];
    if (t) {
        if (t.nav_people && navPeople) navPeople.textContent = t.nav_people;
        if (t.nav_musics && navMusics) navMusics.textContent = t.nav_musics;
        if (t.nav_sobre && navSobre) navSobre.textContent = t.nav_sobre;
    }
}
