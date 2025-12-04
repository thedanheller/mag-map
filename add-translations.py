#!/usr/bin/env python3
"""
Script to add missing language translations to music content JSON files
This creates a template - you'll need to add actual translations
"""

import json
import os
import glob

# Languages to add
MISSING_LANGUAGES = ['zh_cn', 'hi_in', 'fr_fr', 'ar_sa', 'bn_bd', 'ur_pk', 'id_id']

# Get all music JSON files
json_files = glob.glob('content/musics/*.json')

for json_file in json_files:
    with open(json_file, 'r', encoding='utf-8') as f:
        content = json.load(f)

    music_id = os.path.basename(json_file).replace('.json', '')
    updated = False

    # Check each field
    for field in ['country_description', 'song_description', 'teacher_bio']:
        if field in content:
            # Add missing languages
            for lang in MISSING_LANGUAGES:
                if lang not in content[field]:
                    # Use English as placeholder (you should translate these!)
                    content[field][lang] = f"[TRANSLATE] {content[field].get('en_us', '')}"
                    updated = True

    if updated:
        # Write back with proper formatting
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
        print(f"✓ Updated {json_file}")

print(f"\n✅ Added placeholder translations for {len(MISSING_LANGUAGES)} languages")
print("⚠️  Please replace [TRANSLATE] placeholders with actual translations!")
