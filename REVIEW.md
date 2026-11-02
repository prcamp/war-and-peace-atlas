# Adversarial review against the original reading-atlas request

Reviewed November 1, 2026. This assesses the existing implementation, not the feasibility of an imaginary finished product.

## Verdict

The implementation is a full-text concordance with a selective editorial layer and several linked views. Calling it a comprehensive literary knowledge system would overstate it. Functional screens and a polished graph do not establish a coherent underlying model.

## Fixed in this revision

- Graph inspection broke visual context by opening a large dossier. Nodes now open nonmodal anchored cards. Mobile uses tap-to-pin, outside-tap dismissal, and explicit close; desktop also supports hover and keyboard. Source paragraphs and related characters can be inspected inside the same card. Only an explicit “Open full reader” action navigates.
- The overview used decorative hub-and-spoke lines that resembled evidence-backed edges. Those lines were removed; the graphic is labeled as a name index.
- The network silently capped the display at 18 nodes, even allowing a selected focal character to disappear. Pagination now states the visible/total counts and retains the focal character. Mobile uses eight nodes with larger hit areas and a compact layout.
- Information comparisons used an undifferentiated focal-character/source label. Explicit ignorance and mistaken belief now have distinct labels, alongside communication, observation, and receipt. This corrects presentation, not the deeper missing epistemic model.
- The alias “Nicholas” matched Prince Nicholas Andreevich as Nicholas Rostov (Book 1, chapter XXV, paragraph 1). The explicit “Prince Nicholas” collision is excluded in both the index and reader links. Other ambiguity remains possible.

## Remaining gaps, ranked by consequences

1. **P1 — No complete model of information flow.** The 25 disclosure records lack stable shared proposition IDs, validity intervals, recipient-specific belief updates, and structured revisions. A narrator exposing a mistake is not the same event as the character correcting it. The app cannot soundly answer “What does A know that B does not?” Absence of a record must remain unknown.
2. **P1 — Coverage is far thinner than the interface suggests.** There are 38 indexed characters, 52 events, 34 relationships, and 25 disclosure records across 365 chapters. This is no census of the novel's people, encounters, or facts. Index completeness and assertion correctness are separate properties. The counts and methods disclosure help but do not fill the gaps.
3. **P1 — Query composition is shallow.** The query lab intersects a name index, place mentions, keyword vocabularies, and chapter range. It does not join relationship changes to beliefs, information transfers, and later actions. A theme is currently a declared keyword vocabulary, not a defensible thematic interpretation.
4. **P2 — Timelines are a sparse event list.** They distinguish narrative order from broad year labels but do not model scenes, durations, overlaps, uncertain dates, retrospective reports, or competing causal readings. A year-sorted list is not a reconstructed story chronology.
5. **P2 — The atlas is a gazetteer.** Map points index place mentions. They cannot answer who is physically where, how an army moves, or who could plausibly meet. Modern boundary outlines are explicitly labeled; historical routes and geography are not modeled.
6. **P2 — Reader-state protection is coarse.** The inclusive chapter horizon is a useful spoiler boundary but can disclose the end of the chapter currently being read. External source links expose the entire novel. Character knowledge and reader progress need independent state representations.
7. **P2 — Scholarly fidelity is incomplete.** Source notes survive, but paragraph extraction removes italics and other inline typography. There is one historical Maude text, not a collation of revised Maude editions or a critical commentary. The text remains the final authority; the atlas cannot silently substitute a summary for it.
8. **P2 — Mobile density and persistence.** Eight-node pages are usable but split a larger graph across screens. Filtering to an ego-network is preferable for local inspection. Dense tables still need horizontal scrolling. Notes remain device/browser-local; JSON export is a backup mechanism, not synchronization.

## Challenge the brief itself

“Everything composed and queryable” is a dangerous success criterion if every literary ambiguity is forced into a fact table. A character can hear a claim, misunderstand it, pretend to believe it, repeat it strategically, and later remember it differently. Narration can grant access to thought without endorsing that thought. These are not interchangeable graph edges.

More maps, cards, and crosslinks also increase the chance that the companion becomes a second book to operate. On a phone, each action should answer a bounded question while preserving the passage or network being inspected. Hover must never be required. Avoid decorating sparse observations with a visual appearance of exhaustive knowledge.

The next structural step should be a scene-and-assertion layer, with separate event time and reader-disclosure position, explicit speaker/source/recipient roles, proposition identity, confidence, and passage evidence. Build a few demanding cross-view queries over that model before adding more views. One test: follow a single proposition from private knowledge through communication, misunderstanding, and correction without converting missing evidence into ignorance.

## Verification

- Pure-render regression checks across nine views and seven reading horizons; 111 editorial source references resolve.
- Preview content is chapter-gated; node cards contain no implicit view-switch action; evidence stays inline.
- Desktop focal-node pagination and eight-node mobile geometry checked; the “Prince Nicholas” collision has a regression assertion.
- Browser QA uses a 390 × 844 iframe viewport (real responsive CSS/layout, not a physical iPhone). Verified node click/pin, evidence preview, close, Enter, Escape, and pagination. Physical iOS touch behavior has not been directly tested.

## Network-first revision review
- Made the graph the landing workspace; removed dashboard-card precedence.
- Replaced undifferentiated ties with labeled predicates and directional arrows, including inverse roles and explicit source evidence.
- Added a universal 365-chapter rail and live range boundary, preserving selected identity while hiding it before introduction.
- Added nine selectable network kinds; co-occurrence remains explicitly distinct from meetings or disclosures.
- Added 70 sourced location observations with last-recorded and narrative-order trail projections. These are selective annotations, not a complete reconstruction of every character journey.
- Verified all kinds at seven horizons, location evidence anchors, matching IDs between location graph and map ledger, and mobile node cap. Browser-tested 390px layout, range changes, node tap previews, and identity-preserving map projection.

## Map repair
Root problem: the prior map was driven by only70 selective character observations, so most chapter changes did not update its content. Added chapter-level geography across the entire text, with379 sourced scene/historical setting records and explicit essay/uncertain states. Removed disjoint regional views in favor of one continuous map. The primary layer now follows the selected chapter; character observations remain a distinct layer. Fictional places are clearly named without false coordinates. Verified all references and chapter gating, plus mobile UI zoom, popovers, chapter changes and future-location removal. Pan/pinch handlers checked with deterministic geometric event sequences; physical iOS multitouch was not directly tested.
