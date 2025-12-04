/**
 * Content loader for JSON content files
 */

// Cache for loaded content
const contentCache = {};

/**
 * Load music content from JSON file
 */
export async function loadMusicContent(musicId) {
    const cacheKey = `music_${musicId}`;

    if (contentCache[cacheKey]) {
        return contentCache[cacheKey];
    }

    try {
        const response = await fetch(`content/musics/${musicId}.json`);
        if (!response.ok) {
            console.warn(`Content not found for music ${musicId}`);
            return null;
        }

        const content = await response.json();
        contentCache[cacheKey] = content;
        return content;
    } catch (error) {
        console.error(`Error loading music content ${musicId}:`, error);
        return null;
    }
}

/**
 * Load person content from JSON file
 */
export async function loadPersonContent(personId) {
    const cacheKey = `person_${personId}`;

    if (contentCache[cacheKey]) {
        return contentCache[cacheKey];
    }

    try {
        const response = await fetch(`content/people/${personId}.json`);
        if (!response.ok) {
            console.warn(`Content not found for person ${personId}`);
            return null;
        }

        const content = await response.json();
        contentCache[cacheKey] = content;
        return content;
    } catch (error) {
        console.error(`Error loading person content ${personId}:`, error);
        return null;
    }
}

/**
 * Get content for specific language
 */
export function getContentForLanguage(content, field, language) {
    if (!content || !content[field]) {
        return '';
    }
    return content[field][language] || content[field]['en_us'] || '';
}

/**
 * Clear content cache
 */
export function clearContentCache() {
    Object.keys(contentCache).forEach(key => delete contentCache[key]);
}
