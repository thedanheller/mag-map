/**
 * Modal Manager - Handles modal display for musics and people
 */

import { getMusicContent } from '../data/csvLoader.js';
import { getTranslation } from '../data/translationManager.js';

const modal = document.getElementById('modal');

/**
 * Open modal based on view type
 */
export function openModal(data, view, language) {
    if (view === 'people') {
        openPeopleModal(data, language);
    } else {
        openMusicsModal(data, language);
    }
}

/**
 * Open modal for people data
 */
function openPeopleModal(data, language) {
    const { state, city, neighborhood, person_name, person_photo } = data;

    // Hide music-specific sections
    document.querySelector('.song-section').style.display = 'none';
    document.querySelector('.audio-container').classList.add('hidden');

    // Show and update country section (reused for location)
    const countrySection = document.querySelector('.country-section');
    countrySection.style.display = 'block';
    document.getElementById('modal-country-flag').textContent = '';

    // Display location as "Neighborhood, City, State"
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
function openMusicsModal(data, language) {
    const {
        country_name, country_flag,
        song_name, song_author, audio,
        teacher_name, teacher_photo, teacher_link
    } = data;

    // Get language-specific content
    const content = getMusicContent(data, language);

    // Show all sections
    document.querySelector('.song-section').style.display = 'block';
    document.querySelector('.country-section').style.display = 'block';
    document.querySelector('.teacher-section').style.display = 'block';

    // Set UI translations
    document.getElementById('modal-song-subtitle').textContent = getTranslation('song', language);
    document.getElementById('modal-teacher-subtitle').textContent = getTranslation('teacher', language);

    // Set country information
    document.getElementById('modal-country-flag').textContent = country_flag || '';
    document.getElementById('modal-country-name').textContent = country_name || '';
    // document.getElementById('modal-country-description').textContent = content.countryDescription || '';

    // Set song information
    document.getElementById('modal-song-name').textContent = song_name || '';
    const songAuthorEl = document.getElementById('modal-song-author');
    if (song_author && song_author.trim() && song_author.toLowerCase() !== 'traditional') {
        songAuthorEl.textContent = `${getTranslation('by', language)} ${song_author}`;
        songAuthorEl.style.display = 'block';
    } else if (song_author && song_author.toLowerCase() === 'traditional') {
        songAuthorEl.textContent = getTranslation('traditional', language);
        songAuthorEl.style.display = 'block';
    } else {
        songAuthorEl.style.display = 'none';
    }
    document.getElementById('modal-song-description').textContent = content.songDescription || '';

    // Set audio
    const audioContainer = document.getElementById('modal-audio-container');
    const audioEl = document.getElementById('modal-audio');
    if (audio) {
        audioEl.src = `media/audio/${audio}`;
        audioContainer.classList.remove('hidden');

        // Auto-play audio when modal opens
        audioEl.play().catch(error => {
            console.warn(`Auto-play prevented: ${error.message}`);
        });

        audioEl.onerror = () => {
            console.warn(`Failed to load audio: ${audio}`);
            audioContainer.classList.add('hidden');
        };
    } else {
        audioContainer.classList.add('hidden');
    }

    // Set teacher information
    document.getElementById('modal-teacher-name').textContent = teacher_name || '';
    // document.getElementById('modal-teacher-bio').textContent = content.teacherBio || '';

    // Set teacher photo
    const teacherPhotoContainer = document.getElementById('modal-teacher-photo-container');
    const teacherPhotoEl = document.getElementById('modal-teacher-photo');
    if (teacher_photo) {
        teacherPhotoEl.src = `media/images/teachers/${teacher_photo}`;
        teacherPhotoEl.alt = teacher_name || 'Teacher';
        teacherPhotoContainer.classList.remove('hidden');

        teacherPhotoEl.onerror = () => {
            console.warn(`Failed to load teacher photo: ${teacher_photo}`);
            teacherPhotoContainer.classList.add('hidden');
        };
    } else {
        teacherPhotoContainer.classList.add('hidden');
    }

    // Set teacher link
    const teacherLinkEl = document.getElementById('modal-teacher-link');
    if (teacher_link && teacher_link.trim()) {
        teacherLinkEl.href = teacher_link;
        teacherLinkEl.textContent = getTranslation('learn_more', language);
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
export function closeModal() {
    modal.classList.remove('show');
    modal.style.display = 'none';

    // Stop audio if playing
    const audioEl = document.getElementById('modal-audio');
    audioEl.pause();
    audioEl.currentTime = 0;
}

/**
 * Setup modal event listeners
 */
export function setupModalEvents() {
    const closeButton = modal.querySelector('.close-button');

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
