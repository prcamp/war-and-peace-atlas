# War & Peace · Reading Atlas

A responsive reading companion for the complete Louise and Aylmer Maude translation: chapter-gated character networks, scenes and maps, timelines, disclosures, source paragraphs, and local notes.

## Hosting on GitHub Pages

Open the dashboard: https://prcamp.github.io/war-and-peace-atlas/dist/

The project root https://prcamp.github.io/war-and-peace-atlas/ forwards to the dashboard, preserving query parameters and the selected view.

Both supported Pages sources now publish the same URL layout: a root entry point and the application under `dist/`. The root `index.html` and `.nojekyll` also make branch-based publication from `main / (root)` work instead of displaying this README. The Actions workflow validates the app and stages that same layout in `_site/`.

Recommended setting: **Settings → Pages → Build and deployment → Source → GitHub Actions**. This avoids redundant branch-based deployments, but either source serves the dashboard correctly.

## Local development

No package installation or build step is needed. Node.js is required only for validation; Python can serve the static files:

```sh
node validate.cjs
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Assets and data use relative paths so the app also works under the GitHub Pages repository subdirectory.

## Responsive interface

Phone layouts use horizontally scrollable navigation, stacked panels, compact graphs and touch-sized controls. Desktop layouts use a persistent sidebar and larger canvases. Graphs and map geometry adapt when the viewport crosses the mobile breakpoint. The atlas supports touch pan/pinch, mouse wheel zoom, buttons, keyboard navigation and Fit locations.

## Content and evidence

- Complete Maude text: 365 chapters, including epilogues.
- Chapter-setting classification across all 365 chapters, with 379 setting records for 340 chapters.
- Editorial relationship and character-location annotations remain selective; they do not exhaust the novel.
- Every curated event, relationship and location cites paragraph evidence. Continuing scenes may cite the earlier chapter establishing their location.
- Co-occurrence means name matches within chapters, not necessarily meetings.
- Fictional/unresolved locations stay named but unpinned. Geographic outlines are modern reference geometry.

Text source: [Project Gutenberg ebook 2600](https://www.gutenberg.org/ebooks/2600). The Maude translation is public domain in the United States. Geography derives from [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/); additional coordinate sources are recorded in the data.

## Reading progress and notes

Progress and notes are stored in this browser's local storage, not sent to a server. They do not automatically transfer between devices or website domains. To move notes from the previous hosted atlas, export them in Notes there and import the backup here. Set the reading boundary separately.

## Files

`dist/` is both the editable application source and deployment output. `validate.cjs` checks chapter boundaries, citations, network projections and map gestures. `parse_text.py` and `build_index.py` retain the original ingestion tools; rebuilding the text requires the original Gutenberg HTML at `sources/maude.html`. Published JSON is committed and does not require regeneration for hosting.
