# Phase 1 Refactoring Progress

## ✅ Completed

### 1. Directory Structure Created
```
/src
  /map         - Map-related modules
  /data        - Data loading modules
  /ui          - UI components
  /utils       - Utility functions
/content
  /musics      - Music content JSON files (16 files)
  /people      - People content JSON files
```

### 2. Content Extraction Complete
- **Created**: 16 JSON files in `content/musics/` (one per music)
- **Simplified**: `data/musics.csv` now only has core fields (no language content)

**Old CSV**: 20 columns (including `*_pt_br`, `*_es_es`, `*_en_us`)
**New CSV**: 11 columns (clean data only)

**JSON Structure** (example: `content/musics/1.json`):
```json
{
  "country_description": {
    "pt_br": "...",
    "es_es": "...",
    "en_us": "..."
  },
  "song_description": { ... },
  "teacher_bio": { ... }
}
```

## 🚧 Next Steps

### Module Creation Plan

#### 1. **src/data/contentLoader.js**
```javascript
// Load content JSON files
export async function loadMusicContent(musicId, language) { ... }
export async function loadPeopleContent(personId, language) { ... }
```

#### 2. **src/data/csvLoader.js**
```javascript
// Load and parse CSV files
export async function loadMusicsCSV() { ... }
export async function loadPeopleCSV() { ... }
```

#### 3. **src/data/translationManager.js**
```javascript
// Handle UI translations
export async function loadUITranslations() { ... }
export function getTranslation(key, language) { ... }
export function updateNavigationLinks(language) { ... }
```

#### 4. **src/map/mapManager.js**
```javascript
// Map initialization and control
export function initMap() { ... }
export function fitBoundsToMarkers(markers) { ... }
```

#### 5. **src/map/markerManager.js**
```javascript
// Marker creation and management
export function createMarkers(data, view) { ... }
export function clearMarkers() { ... }
export function offsetOverlappingMarkers(markers) { ... }
```

#### 6. **src/ui/modalManager.js**
```javascript
// Modal display logic
export function openMusicsModal(data, content, language) { ... }
export function openPeopleModal(data, language) { ... }
export function closeModal() { ... }
```

#### 7. **src/ui/navigationManager.js**
```javascript
// Navigation and view switching
export function switchView(view) { ... }
export function setupNavigationEvents() { ... }
```

#### 8. **src/utils/helpers.js**
```javascript
// Utility functions
export function calculateDistance(lat1, lng1, lat2, lng2) { ... }
export function showLoading() { ... }
export function hideLoading() { ... }
```

#### 9. **app.js** (simplified main entry point)
```javascript
import { initMap } from './src/map/mapManager.js';
import { setupNavigationEvents } from './src/ui/navigationManager.js';
// ... coordinate everything
```

#### 10. **index.html**
```html
<!-- Add type="module" to script tag -->
<script type="module" src="app.js"></script>
```

## 📋 Implementation Checklist

- [x] Create directory structure
- [x] Extract content from musics.csv to JSON
- [x] Create simplified musics.csv
- [ ] Create contentLoader.js
- [ ] Create csvLoader.js
- [ ] Create translationManager.js
- [ ] Create mapManager.js
- [ ] Create markerManager.js
- [ ] Create modalManager.js
- [ ] Create navigationManager.js
- [ ] Create helpers.js
- [ ] Refactor app.js to use modules
- [ ] Update index.html for ES6 modules
- [ ] Test all functionality
- [ ] Clean up old files

## 🎯 Benefits Achieved So Far

1. **Cleaner Data**: CSV files are now focused on core data
2. **Easier i18n**: Content in JSON is easier to manage than CSV columns
3. **Better Structure**: Clear separation between code and content
4. **Scalability**: Easy to add new languages (just add to JSON)

## 🚀 Ready to Continue?

Run the following to see current file structure:
```bash
tree -L 2 src/ content/
```

Next step: Create the JavaScript modules!
