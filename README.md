# Interactive Map with CSV Pins

A production-ready Single Page Application (SPA) featuring an interactive map with CSV-loaded markers. Each marker displays a modal with image, description, and audio when clicked.

## Features

- Full-screen interactive map using Leaflet and OpenStreetMap
- CSV-based marker data management
- Click markers to view details in a modal:
  - Title
  - Image
  - Text description
  - Audio player
- Responsive design (mobile-friendly)
- Static hosting ready (no backend required)
- Easy deployment to GitHub Pages, Netlify, Vercel, or Cloudflare Pages

## Project Structure

```
.
├── index.html              # Main HTML file
├── style.css               # Styles and responsive design
├── app.js                  # Application logic
├── data/
│   └── markers.csv         # Marker data (editable in Google Sheets)
├── media/
│   ├── images/             # Image files
│   └── audio/              # Audio files
└── README.md              # This file
```

## Running Locally

### Option 1: Python HTTP Server (Recommended)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js HTTP Server

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run server
http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## Deployment Instructions

### GitHub Pages

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "main" branch and "/ (root)" folder
   - Click "Save"
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Netlify

1. **Deploy via Drag & Drop:**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop your project folder
   - Done! Your site is live

2. **Deploy via Git:**
   - Connect your GitHub repository
   - Set build command: (leave empty)
   - Set publish directory: `/`
   - Click "Deploy"

### Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Or use the Vercel Dashboard:**
   - Import your Git repository
   - Click "Deploy"

### Cloudflare Pages

1. **Via Dashboard:**
   - Go to Cloudflare Pages
   - Connect your Git repository
   - Set build command: (leave empty)
   - Set output directory: `/`
   - Click "Deploy"

## Managing Marker Data

### CSV Format

The `data/markers.csv` file contains marker information with these columns:

| Column | Required | Description |
|--------|----------|-------------|
| id | No | Unique identifier |
| title | Yes | Marker title |
| lat | Yes | Latitude (decimal) |
| lng | Yes | Longitude (decimal) |
| description | No | Text description |
| image | No | Relative path to image (e.g., `media/images/photo.jpg`) |
| audio | No | Relative path to audio (e.g., `media/audio/sound.mp3`) |

### Updating from Google Sheets

1. **Create/Open Google Sheet:**
   - Open Google Sheets
   - Create a new spreadsheet or import existing `markers.csv`
   - Ensure column headers match: `id,title,lat,lng,description,image,audio`

2. **Edit Your Data:**
   - Add/edit rows as needed
   - Use decimal coordinates (e.g., 48.8584 for Paris)
   - Use relative paths for media files

3. **Export as CSV:**
   - File → Download → Comma Separated Values (.csv)
   - Save as `markers.csv`

4. **Update Your Project:**
   - Replace `data/markers.csv` with the new file
   - If deployed, commit and push:
     ```bash
     git add data/markers.csv
     git commit -m "Update markers data"
     git push
     ```
   - Most platforms auto-deploy on push

### Adding Media Files

1. **Images:**
   - Add files to `media/images/`
   - Supported formats: JPG, PNG, GIF, WebP
   - Reference in CSV: `media/images/filename.jpg`

2. **Audio:**
   - Add files to `media/audio/`
   - Supported formats: MP3, OGG, WAV
   - Reference in CSV: `media/audio/filename.mp3`

3. **Best Practices:**
   - Optimize images (recommended max width: 1200px)
   - Use compressed audio files
   - Keep file sizes small for faster loading

## Customization

### Change Map Center/Zoom

Edit `app.js` line 18:

```javascript
// Change [latitude, longitude, zoom]
map = L.map('map').setView([20, 0], 2);
```

### Change Map Style

Replace the OpenStreetMap tiles in `app.js` line 21-25 with alternatives:

```javascript
// Dark mode
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CartoDB'
}).addTo(map);

// Satellite
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(map);
```

### Custom Marker Icons

Edit `app.js` around line 79 to add custom icon:

```javascript
const customIcon = L.icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const marker = L.marker([latitude, longitude], { icon: customIcon })
```

### Styling

- Modify colors, fonts, and layout in `style.css`
- Modal styles start at line 48
- Responsive breakpoints at line 123

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Map not loading
- Check browser console for errors
- Ensure you're serving via HTTP (not file://)
- Verify internet connection (tiles load from CDN)

### CSV not loading
- Verify `data/markers.csv` exists
- Check CSV format (proper headers, no extra commas)
- Ensure proper encoding (UTF-8)

### Images/Audio not showing
- Verify file paths in CSV match actual files
- Check file extensions match (case-sensitive on some servers)
- Ensure files are committed and deployed

### CORS errors
- Use a local HTTP server (not file://)
- Ensure all files are in the same domain

## License

Free to use and modify for any purpose.

## Credits

- Map: [Leaflet](https://leafletjs.com/)
- Tiles: [OpenStreetMap](https://www.openstreetmap.org/)
- CSV Parser: [PapaParse](https://www.papaparse.com/)
