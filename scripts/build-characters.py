"""Rebuild the supplemental character finding aids from the Maude text.

Run from repository root: python scripts/build-characters.py
The roster and Wikipedia links are curated inputs, not fetched at runtime.
"""
import json
import re
import unicodedata
from pathlib import Path


def normalize(text):
    return ''.join(c for c in unicodedata.normalize('NFD', text)
                   if not unicodedata.combining(c)).lower()


chapters = json.loads(Path('dist/text.json').read_text())['chapters']
links = json.loads(Path('scripts/character-wiki-links.json').read_text())
texts = [(c['id'], [normalize(p['text']) for p in c['paragraphs']]) for c in chapters]
characters = []
for line in Path('scripts/character-roster.txt').read_text().splitlines():
    if not line or line.startswith('#'):
        continue
    name, aliases = line.split('|')
    aliases = aliases.split(';')
    pattern = re.compile(r'(?<!\w)(?:' + '|'.join(re.escape(normalize(a)) for a in aliases) + r')(?!\w)')
    hits = []
    for chapter, paragraphs in texts:
        # Before his birth, “young Nicholas” refers to Rostov, not Andrew’s son.
        if name == "Nikolushka" and chapter < 77:
            continue
        matches = [(i, len(pattern.findall(p))) for i, p in enumerate(paragraphs) if pattern.search(p)]
        if matches:
            hits.append({'chapter': chapter, 'paragraphs': [i for i, _ in matches],
                         'count': sum(n for _, n in matches)})
    if not hits:
        print('Not indexed (no exact Maude alias):', name)
        continue
    character_id = 'nikolenka' if name == 'Nikolushka' else 'extra-' + re.sub('[^a-z0-9]+', '-', normalize(name)).strip('-')
    characters.append({'id': character_id, 'name': name, 'family': 'Extended cast',
                       'aliases': aliases, 'first': hits[0]['chapter'], 'hits': hits,
                       'wiki': links[character_id]})
core = {c['id']: links[c['id']] for c in json.loads(Path('dist/index.json').read_text())['characters']}
Path('dist/characters-extra.json').write_text(json.dumps({'characters': characters, 'wiki': core}, ensure_ascii=False, separators=(',', ':')) + '\n')
print('Indexed', len(characters), 'additional characters.')
