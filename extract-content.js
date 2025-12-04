/**
 * Script to extract language content from musics.csv into JSON files
 * Run with: node extract-content.js
 */

const fs = require('fs');
const Papa = require('papaparse');

// Read musics.csv
const csvData = fs.readFileSync('data/musics.csv', 'utf8');

Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        const simplifiedRows = [];

        results.data.forEach((row, index) => {
            // Create JSON content file for this music
            const content = {
                country_description: {
                    pt_br: row.country_description_pt_br || '',
                    es_es: row.country_description_es_es || '',
                    en_us: row.country_description_en_us || ''
                },
                song_description: {
                    pt_br: row.song_description_pt_br || '',
                    es_es: row.song_description_es_es || '',
                    en_us: row.song_description_en_us || ''
                },
                teacher_bio: {
                    pt_br: row.teacher_bio_pt_br || '',
                    es_es: row.teacher_bio_es_es || '',
                    en_us: row.teacher_bio_en_us || ''
                }
            };

            // Write JSON file
            fs.writeFileSync(
                `content/musics/${row.id}.json`,
                JSON.stringify(content, null, 2)
            );

            // Create simplified row for new CSV
            simplifiedRows.push({
                id: row.id,
                lat: row.lat,
                lng: row.lng,
                country_name: row.country_name,
                country_flag: row.country_flag,
                song_name: row.song_name,
                song_author: row.song_author,
                audio: row.audio,
                teacher_name: row.teacher_name,
                teacher_photo: row.teacher_photo,
                teacher_link: row.teacher_link
            });
        });

        // Create simplified musics.csv
        const newCsv = Papa.unparse(simplifiedRows);
        fs.writeFileSync('data/musics.csv', newCsv);

        console.log(`✅ Extracted content for ${results.data.length} musics`);
        console.log(`✅ Created simplified musics.csv`);
    }
});
