# Expanded character index and Wikipedia windows

The original 38 character finding aids are supplemented by 144 named people, for 182 candidates before applying the recurrence threshold. This is broader coverage, not a claim to exhaust every named or unnamed person in the novel. The original unmatched Nikolushka entry is corrected to Maude’s “little Nicholas” / “young Nicholas” after his birth; the earlier Rostov reference is excluded. All nodes remain chapter gated and unpaginated.

Roster discovery and Wikipedia destinations use the [Wikipedia list of War and Peace characters](https://en.wikipedia.org/wiki/List_of_War_and_Peace_characters), checked 8 November 2026. Names and aliases were reconciled against the application's public-domain Maude text (Project Gutenberg 2600). No Wikipedia biographical prose is copied into the atlas. The full external article is loaded on request in a sandboxed iframe with a visible source link, close button and outside-click dismissal. Minor characters without separate articles link to the relevant section of the character list. Wikipedia is not chapter gated and the interface labels this explicitly.

`python scripts/build-characters.py` rebuilds `dist/characters-extra.json` using `scripts/character-roster.txt`, `scripts/character-wiki-links.json` and `dist/text.json`. The generator uses accent-insensitive whole-name matching. Unmatched roster candidates are reported and omitted; pronouns, translated given names not listed, and implicit references remain outside this finding aid. Generic or ambiguous names can still need editorial disambiguation. Original curated relationship evidence is retained unchanged; co-occurrence edges mean shared chapters, never asserted meetings or friendships.

Dark mode follows the system preference initially and stores an explicit choice separately from reading progress. Wikipedia controls its own page appearance inside its cross-origin frame.

## Recurrence rule and contextual surnames

The index now includes a person when their resolved name matches occur in at least three distinct chapters across the full novel. Qualifying characters remain revealed from their first indexed mention; displayed passages and network evidence are still limited to the selected reading horizon. The threshold applies equally to the original and supplemental roster, and chapter membership is rebuilt from that filtered index. This is a name-based finding aid, not an exhaustive claim about unnamed or pronominal appearances.

In Book 2, bare “Rostov” in the hussar narrative is resolved to Nicholas/Nikolai Rostov. Explicit Count/Countess/Ilya/Petya prefixes are excluded, and the surname rule is restricted to that book rather than indiscriminately merging the family throughout the novel. Both source hits and inline links use this rule, including Book 2, XXI, paragraph 8 (“The cadet was Rostóv”).
