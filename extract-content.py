#!/usr/bin/env python3
"""
Script to extract language content from musics.csv into JSON files
Run with: python3 extract-content.py
"""

import csv
import json
import os

# Read musics.csv
with open('data/musics.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

simplified_rows = []

for row in rows:
    # Create JSON content file for this music
    content = {
        "country_description": {
            "pt_br": row.get('country_description_pt_br', ''),
            "es_es": row.get('country_description_es_es', ''),
            "en_us": row.get('country_description_en_us', '')
        },
        "song_description": {
            "pt_br": row.get('song_description_pt_br', ''),
            "es_es": row.get('song_description_es_es', ''),
            "en_us": row.get('song_description_en_us', '')
        },
        "teacher_bio": {
            "pt_br": row.get('teacher_bio_pt_br', ''),
            "es_es": row.get('teacher_bio_es_es', ''),
            "en_us": row.get('teacher_bio_en_us', '')
        }
    }

    # Write JSON file
    with open(f"content/musics/{row['id']}.json", 'w', encoding='utf-8') as json_file:
        json.dump(content, json_file, ensure_ascii=False, indent=2)

    # Create simplified row for new CSV
    simplified_rows.append({
        'id': row['id'],
        'lat': row['lat'],
        'lng': row['lng'],
        'country_name': row['country_name'],
        'country_flag': row['country_flag'],
        'song_name': row['song_name'],
        'song_author': row['song_author'],
        'audio': row['audio'],
        'teacher_name': row['teacher_name'],
        'teacher_photo': row['teacher_photo'],
        'teacher_link': row.get('teacher_link', '')
    })

# Create simplified musics.csv
with open('data/musics.csv', 'w', encoding='utf-8', newline='') as f:
    if simplified_rows:
        writer = csv.DictWriter(f, fieldnames=simplified_rows[0].keys())
        writer.writeheader()
        writer.writerows(simplified_rows)

print(f"✅ Extracted content for {len(rows)} musics")
print(f"✅ Created simplified musics.csv")
