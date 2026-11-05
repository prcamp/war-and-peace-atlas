# French campaigns in the reading atlas

The Atlas has a chapter-opening campaign overlay, separate from the existing selected-chapter scene pins. Orange shows French advance, pale ochre its earlier route, and dashed blue the withdrawal. A separate purple overlay maps acquisitions and military occupation. Each military phase has an in-app evidence button.

## Reused historical material

- **Charles Joseph Minard's 1869 depiction of the 1812 campaign**, reused through [stdlib's transcription](https://github.com/stdlib-js/datasets-minard-napoleons-march/tree/62d2face1627efb37461f344dfd7deff5ef902bb). The exact source `data/army.json` is retained in `dist/minard-army.json`. Database: Open Data Commons PDDL 1.0; contents: CC0 1.0. [Upstream license](https://github.com/stdlib-js/datasets-minard-napoleons-march/blob/62d2face1627efb37461f344dfd7deff5ef902bb/LICENSE). No upstream software is copied. The main advance is division 1, direction A, plus its Moscow endpoint; withdrawal follows division 1, then the shared continuation in division 2. All original longitude/latitude pairs are retained. Only the progressive slices are drawn. Constant band width is editorial and does not reproduce Minard's army-strength encoding.
- [The Maude edition's five maps of War and Peace](https://en.wikisource.org/wiki/War_and_Peace_(Tolstoy)/Maps), linked directly in the app so readers can consult existing book-specific cartography. These are static whole-campaign references, not spoiler-filtered images.
- Fondation Napoléon: [Niemen to Moscow](https://www.napoleon.org/en/history-of-the-two-empires/timelines/napoleons-russian-campaign-from-the-niemen-to-moscow), [retreat](https://www.napoleon.org/en/history-of-the-two-empires/timelines/napoleons-russian-campaign-the-retreat), [Austerlitz timeline](https://www.napoleon.org/en/history-of-the-two-empires/timelines/austerlitz-2-december-1805-a-timeline), and [Tilsit](https://www.napoleon.org/en/history-of-the-two-empires/close-up/a-close-up-on-tilsit-july-1807). Used to check campaign sequence and locations. The early campaign polylines are editorial simplifications linking locations; they are not digitized military itineraries.
- Political naming: Fondation Napoléon on the [Duchy of Warsaw](https://www.napoleon.org/en/history-of-the-two-empires/close-up/a-close-up-on-the-duchy-of-warsaw/) and [Confederation of the Rhine](https://www.napoleon.org/en/history-of-the-two-empires/close-up/a-close-up-on-the-creation-of-the-confederation-of-the-rhine-12-july-1806). Labels identify broad period geography, not all contemporary states. Warsaw is not labeled as a duchy before the post-Tilsit period. Postwar epilogues use Kingdom of France, German Confederation and Kingdom of Poland.

## Reading boundary and limits

`campaignAt(N)` only uses military evidence from chapters strictly earlier than N. Selecting a chapter never displays a movement first narrated within that chapter. At the Moscow boundary, chapter 255 (Book 11, XXVI) shows the outskirts; 256 shows Moscow reached. Chapter 292 (Book 13, XIII) still shows Moscow; 293 begins withdrawal. Going backward recomputes the layer from scratch.

Milestones are editorial readings of the public-domain Maude text in `dist/text.json`, not automatic place-name matches. Historical summaries that jump ahead are not used to reveal the whole route early. A phase can persist for many chapters. For parallel or retrospective scenes, the map retains the last established campaign phase rather than inventing an exact date or daily position. The source paragraph anchors the narrative phase; external cartography supplies its approximate geographic extent. Russian dates in the text and Gregorian campaign dates must not be compared without conversion.

Covered: the principal 1805, 1806–07 and 1812 campaigns. The 1809 campaign is not reconstructed from the novel's brief references. Interludes assert no current army front; the completed 1805 route briefly remains as pale historical context. Late 1812 chapters retain the completed invasion/withdrawal; epilogues clear the military overlay.

### Historical borders and territorial control

The Europe control frames the acquisitions and occupations together. Dark purple shows the territory incorporated into the French Empire outside the 1790 French border. Medium purple shows mapped military occupation, including the portions of Iberia in the period source. Pale purple shows the earlier reach of a campaign after withdrawal or settlement. The sovereign borders of allied and client states remain visible.

The geometries in `dist/territory-data.json` are an adaptation of **Chalstrey et al., Cliopatria, Seshat Global History Databank**, [pinned source revision](https://github.com/Seshat-Global-History-Databank/cliopatria/tree/5f433377139a6eeaeacbdc894b70f8805b72c8b5), under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The source zip has Git blob SHA `a1e7093b64990bf97cd3c31bda96de1cafed822c`. The polygons are clipped to Europe, simplified, and reclassified into sovereign borders, acquisitions and occupation. See [the dataset paper](https://doi.org/10.1038/s41597-025-04516-9) and [Fondation Napoléon's map of Europe in 1812](https://www.napoleon.org/histoire-des-2-empires/cartes/carte-de-leurope-en-1812).

Cliopatria's French Empire polygons in the campaign years combine the imperial footprint with wartime control. The build script intersects those polygons with the contemporary Austrian, Prussian, Russian and Iberian footprints to separate occupation. The underlying borders of Austria and Russia are restored where the source cuts away occupied areas. The source omits much of post-Tilsit Prussia, so its outline is approximated from prewar Prussia east of the Elbe region, with ceded and annexed territories subtracted. The Tilsit view borrows nearby post-treaty boundaries. Interlude and Iberian layers use period snapshots. The application labels the date of the border snapshot beside the map.

For the 1805, 1806–07, and 1812 advances, successive slices of the source occupation polygons are revealed using the previous-chapter campaign milestones. Their longitudinal limits are editorial estimates anchored to the advance and retreat locations. These are approximate occupation extents, with coverage limited by the source polygons. A battle site or passage along a route by itself does not imply area occupation.

To regenerate, download `cliopatria.geojson.zip` from the pinned revision and run `python scripts/build-territory.py /path/to/cliopatria.geojson.zip` with Shapely installed.

## Verification

`node validate.cjs` covers existing chapter, network, map and gesture behavior. `node validate-campaign.cjs` covers all 365 chapter openings, real source paragraph anchors, explicit Moscow and retreat boundary cases, reversed navigation, political name transitions, hidden shading and fidelity to Minard's original advance coordinates. Browser checks cover desktop, 390px phone layout, evidence previews, the Moscow transition in both directions, zoom, and hiding/restoring shading.

## Narrative phase anchors

Paragraph numbers below are one-based. A phase is first available in the chapter **after** its anchor.

| Phase | Earlier evidence | First available global chapter |
|---|---|---|
| 1805 · French advance to Ulm | Book 2, III, ¶37 | 32 |
| 1805 · Along the Inn | Book 2, VI, ¶1 | 35 |
| 1805 · French pursuit at the Enns | Book 2, VIII, ¶1 | 37 |
| 1805 · Vienna reached | Book 2, X, ¶26 | 39 |
| 1805 · North of Vienna | Book 2, XIV, ¶1 | 43 |
| 1805 · At the Austerlitz position | Book 3, XII, ¶9 | 62 |
| 1806 · After the Austrian campaign | Book 3, XIX, ¶1 | 69 |
| 1806–07 · Through Prussia into Poland | Book 5, IX, ¶8 | 94 |
| 1807 · French advance to Friedland | Book 5, XVII, ¶1 | 102 |
| 1807 · The armies at Tilsit | Book 5, XIX, ¶2 | 104 |
| 1812 · Across the Niemen | Book 9, II, ¶6 | 170 |
| 1812 · French advance to Vílna | Book 9, V, ¶17 | 173 |
| 1812 · Approaching Vítebsk | Book 9, XIV, ¶17 | 182 |
| 1812 · Vítebsk reached | Book 10, II, ¶14 | 193 |
| 1812 · French advance to Smolénsk | Book 10, IV, ¶92 | 195 |
| 1812 · At the Borodinó position | Book 10, XIX, ¶1 | 210 |
| 1812 · At the gates of Moscow | Book 11, XIX, ¶4 | 249 |
| 1812 · Moscow reached | Book 11, XXVI, ¶1 | 256 |
| 1812 · Withdrawal from Moscow begins | Book 13, XIII, ¶1 | 293 |
| 1812 · Withdrawal along the Kalúga road | Book 13, XV, ¶7 | 295 |
| 1812 · Turning back to the Smolénsk road | Book 13, XVIII, ¶10 | 298 |
| 1812 · Withdrawal toward Smolénsk | Book 13, XIX, ¶10 | 299 |
| 1812 · Retreat through Smolénsk | Book 14, XVI, ¶5 | 315 |
| 1812 · Retreat beyond Smolénsk | Book 14, XVIII, ¶2 | 317 |
| 1812 · End of the Russian campaign | Book 15, X, ¶16 | 328 |
