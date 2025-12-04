/**
 * CSV Data Loader
 */

import { loadMusicContent, getContentForLanguage } from './contentLoader.js';
import { getCurrentLanguage } from './translationManager.js';

/**
 * Load and parse musics CSV
 */
export async function loadMusicsCSV() {
    try {
        const response = await fetch('data/musics.csv');

        if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.statusText}`);
        }

        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: async function(results) {
                    console.log('Musics CSV parsed successfully:', results.data.length, 'musics');

                    // Load content for each music
                    const musicsWithContent = await Promise.all(
                        results.data.map(async (row) => {
                            const content = await loadMusicContent(row.id);
                            return {
                                ...row,
                                _content: content
                            };
                        })
                    );

                    resolve(musicsWithContent);
                },
                error: function(error) {
                    console.error('CSV parsing error:', error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Error loading musics CSV:', error);
        throw error;
    }
}

/**
 * Load and parse people CSV
 */
export async function loadPeopleCSV() {
    try {
        const response = await fetch('data/people.csv');

        if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.statusText}`);
        }

        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    console.log('People CSV parsed successfully:', results.data.length, 'people');
                    resolve(results.data);
                },
                error: function(error) {
                    console.error('CSV parsing error:', error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Error loading people CSV:', error);
        throw error;
    }
}

/**
 * Get language-specific content from music data
 */
export function getMusicContent(musicData, language = getCurrentLanguage()) {
    if (!musicData._content) {
        return {
            countryDescription: '',
            songDescription: '',
            teacherBio: ''
        };
    }

    return {
        countryDescription: getContentForLanguage(musicData._content, 'country_description', language),
        songDescription: getContentForLanguage(musicData._content, 'song_description', language),
        teacherBio: getContentForLanguage(musicData._content, 'teacher_bio', language)
    };
}
