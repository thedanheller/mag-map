/**
 * Marker Manager - Handles creation and management of map markers
 */

import { getMap, fitBoundsToMarkers } from './mapManager.js';
import { getMusicContent } from '../data/csvLoader.js';
import { calculateDistance } from '../utils/helpers.js';
import { openModal } from '../ui/modalManager.js';

let markers = [];
const OVERLAP_THRESHOLD = 0.5;
const OFFSET_AMOUNT = 0.05;

/**
 * Create artistic marker icon
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
                <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#d4a574;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#c08552;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8b4513;stop-opacity:1" />
                </linearGradient>
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
 * Offset overlapping markers
 */
function offsetOverlappingMarkers(markerDataArray) {
    const processedMarkers = [];

    markerDataArray.forEach((markerData, index) => {
        let { latitude, longitude } = markerData;
        let hasOverlap = true;
        let attempts = 0;
        const maxAttempts = 10;

        while (hasOverlap && attempts < maxAttempts) {
            hasOverlap = false;

            for (let i = 0; i < processedMarkers.length; i++) {
                const other = processedMarkers[i];
                const distance = calculateDistance(latitude, longitude, other.latitude, other.longitude);

                if (distance < OVERLAP_THRESHOLD) {
                    hasOverlap = true;
                    const angle = Math.random() * 2 * Math.PI;
                    latitude += Math.cos(angle) * OFFSET_AMOUNT;
                    longitude += Math.sin(angle) * OFFSET_AMOUNT;
                    break;
                }
            }

            attempts++;
        }

        processedMarkers.push({
            ...markerData,
            latitude,
            longitude
        });
    });

    return processedMarkers;
}

/**
 * Create markers from data array
 */
export function createMarkers(data, view, currentLanguage) {
    const map = getMap();
    if (!map) {
        console.error('Map not initialized');
        return;
    }

    const bounds = [];

    // Prepare marker data with coordinates
    const markerDataArray = data.map((row, index) => {
        const { id, lat, lng } = row;

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
            data: row,
            view
        };
    }).filter(item => item !== null);

    // Offset overlapping markers
    const offsetMarkers = offsetOverlappingMarkers(markerDataArray);

    // Create markers on the map
    offsetMarkers.forEach(markerData => {
        const { latitude, longitude, data, view } = markerData;

        const markerLabel = view === 'people'
            ? `${data.person_name} - ${data.neighborhood}`
            : `${data.song_name} - ${data.country_name}`;

        console.log(`Marker ${markerData.index + 1}: ${markerLabel} [${latitude.toFixed(2)}, ${longitude.toFixed(2)}]`);

        // Create marker with custom artistic icon
        const marker = L.marker([latitude, longitude], {
            icon: createArtisticIcon()
        })
            .addTo(map)
            .on('click', () => {
                openModal(data, view, currentLanguage);
            });

        markers.push(marker);
        bounds.push([latitude, longitude]);
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
        // For people view, add extra top padding to avoid nav bar
        const padding = view === 'people' ? [120, 50, 50, 50] : [50, 50];
        fitBoundsToMarkers(bounds, { padding });
    }

    console.log(`Added ${markers.length} markers to the map`);
}

/**
 * Clear all markers from the map
 */
export function clearMarkers() {
    const map = getMap();
    if (!map) {
        return;
    }

    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
}

/**
 * Get all current markers
 */
export function getMarkers() {
    return markers;
}
