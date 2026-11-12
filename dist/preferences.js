/* Theme is applied before paint; preference is independent of reading progress. */
function applyTheme(theme) {
 document.documentElement.dataset.theme = theme;
 document.documentElement.style.colorScheme = theme;
}
function initialTheme() {
 try {
  const saved = localStorage.getItem('wp-atlas-theme');
  if (saved === 'dark' || saved === 'light') return saved;
 } catch {}
 return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
if (typeof window !== 'undefined') applyTheme(initialTheme());

const MIN_CHARACTER_CHAPTERS = 3;
function extendCharacters(extra) {
 for (const c of I.characters) c.wiki = extra.wiki[c.id];
 for (const c of extra.characters) {
  const existing = I.characters.find(person => person.id === c.id);
  if (existing) Object.assign(existing, c, {family:existing.family});
  else I.characters.push(c);
 }
 // Qualify across the novel, but reveal only mentions at the reading horizon.
 // Rebuild membership so cards, search, networks and the reader agree.
 I.characters = I.characters.filter(c => new Set(c.hits.map(hit => hit.chapter)).size >= MIN_CHARACTER_CHAPTERS);
 for (const ch of T.chapters) ch.characters = [];
 for (const c of I.characters) for (const hit of c.hits) {
  chapter(hit.chapter).characters.push(c.id);
 }
}
function wikiUrl(c) {
 const fallback = 'https://en.wikipedia.org/wiki/List_of_War_and_Peace_characters';
 return c.wiki?.startsWith('https://en.wikipedia.org/wiki/') ? c.wiki : fallback;
}
function openWikipedia(id) {
 const c = character(id);
 if (!c || c.first > state.horizon) return;
 const url = wikiUrl(c);
 openDrawer(`<div class="wiki-heading"><span class="eyebrow">Wikipedia · external reference</span><h2>${esc(c.name)}</h2><p>Wikipedia covers the whole story and may contain spoilers.</p><div class="actions"><button data-action="character" data-id="${esc(id)}">Chapter-safe dossier</button><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open in a new tab ↗</a></div></div><iframe class="wiki-frame" title="Wikipedia: ${esc(c.name)}" src="${esc(url)}" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe><p class="wiki-fallback">If Wikipedia does not load here, use “Open in a new tab” above.</p>`);
 $('.drawer').classList.add('wiki-drawer');
}
function installPreferences() {
 const previousAction = action;
 action = function(el) {
  if (el.dataset.action === 'theme') {
   const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
   applyTheme(theme);
   try { localStorage.setItem('wp-atlas-theme', theme); } catch {}
   el.setAttribute('aria-pressed', String(theme === 'dark'));
  } else if (el.dataset.action === 'wiki-character') openWikipedia(el.dataset.id);
  else previousAction(el);
 };
 const previousPeek = peekCharacterContent;
 peekCharacterContent = function(id) {
  const html = previousPeek(id);
  return html ? html + `<p><button data-action="wiki-character" data-id="${esc(id)}">Wikipedia ↗ <small>Full-story reference</small></button></p>` : html;
 };
}
