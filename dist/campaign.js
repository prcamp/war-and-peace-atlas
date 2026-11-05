/* Historical campaign layer. See CAMPAIGN_SOURCES.md for provenance and chapter gates.
 * Minard coordinates are schematic. Shading is a route corridor, never a claim of sovereignty.
 * Evidence in chapter N can affect the map only at the opening of chapter N+1. */
const CAMPAIGN_ROUTES = {
 austria: [[8.1,48.6],[9.2,49.1],[10.8,48.7],[10,48.4],[13.03,48.26],[14.48,48.21],[16.37,48.21],[16.08,48.57],[16.64,49.13]],
 prussia: [[11.59,50.93],[13.4,52.52],[16.93,52.41],[21.01,52.23],[20.64,54.39],[21.02,54.44],[21.88,55.08]],
 // MINARD_ROUTES are generated below from stdlib's CC0 transcription, pinned in the source notes.
};
const CAMPAIGN_PHASES = [
 {id:'before-1805',after:0,until:31,title:'1805 · Before the Austrian campaign is established',note:'No French advance has yet been established in the reading.',route:'austria',count:0},
 {id:'ulm',after:31,paragraph:36,until:34,title:'1805 · French advance to Ulm',route:'austria',count:4},
 {id:'inn',after:34,paragraph:0,until:36,title:'1805 · Along the Inn',route:'austria',count:5},
 {id:'enns',after:36,paragraph:0,until:38,title:'1805 · French pursuit at the Enns',route:'austria',count:6},
 {id:'vienna',after:38,paragraph:25,until:42,title:'1805 · Vienna reached',route:'austria',count:7},
 {id:'hollabrunn',after:42,paragraph:0,until:61,title:'1805 · North of Vienna',route:'austria',count:8},
 {id:'austerlitz',after:61,paragraph:8,until:68,title:'1805 · At the Austerlitz position',route:'austria',count:9},
 {id:'after-austria',after:68,paragraph:0,until:92,title:'1806 · After the Austrian campaign',route:'austria',count:9,ended:true,note:'The pale corridor records the completed 1805 advance; it does not imply continued occupation.'},
 {id:'prussia',after:93,paragraph:7,until:101,title:'1806–07 · Through Prussia into Poland',route:'prussia',count:4},
 {id:'friedland',after:101,paragraph:0,until:103,title:'1807 · French advance to Friedland',route:'prussia',count:6},
 {id:'tilsit',after:103,paragraph:1,until:106,title:'1807 · The armies at Tilsit',route:'prussia',count:7},
 {id:'interlude',after:106,until:169,title:'Between the mapped campaigns',note:'The novel turns to civilian life and the approach of 1812. No current French army position is asserted here.',route:'advance',count:0},
 {id:'niemen',after:169,paragraph:5,until:172,title:'1812 · Across the Niemen',route:'advance',count:2},
 {id:'vilna',after:172,paragraph:16,until:181,title:'1812 · French advance to Vílna',route:'advance',count:3},
 {id:'ostrovna',after:181,paragraph:16,until:192,title:'1812 · Approaching Vítebsk',route:'advance',count:9},
 {id:'vitebsk',after:192,paragraph:13,until:194,title:'1812 · Vítebsk reached',route:'advance',count:10},
 {id:'smolensk',after:194,paragraph:91,until:209,title:'1812 · French advance to Smolénsk',route:'advance',count:11},
 {id:'borodino',after:209,paragraph:0,until:248,title:'1812 · At the Borodinó position',route:'advance',count:15},
 {id:'moscow-outskirts',after:248,paragraph:3,until:255,title:'1812 · At the gates of Moscow',route:'advance',count:15,extra:[[37.48,55.73]]},
 {id:'moscow',after:255,paragraph:0,until:292,title:'1812 · Moscow reached',route:'advance',count:16},
 {id:'leaving-moscow',after:292,paragraph:0,until:294,title:'1812 · Withdrawal from Moscow begins',route:'advance',count:16,retreat:2},
 {id:'kaluga-road',after:294,paragraph:6,until:297,title:'1812 · Withdrawal along the Kalúga road',route:'advance',count:16,retreat:4},
 {id:'turning-west',after:297,paragraph:9,until:298,title:'1812 · Turning back to the Smolénsk road',route:'advance',count:16,retreat:5},
 {id:'vyazma',after:298,paragraph:9,until:314,title:'1812 · Withdrawal toward Smolénsk',route:'advance',count:16,retreat:6},
 {id:'smolensk-return',after:314,paragraph:4,until:316,title:'1812 · Retreat through Smolénsk',route:'advance',count:16,retreat:8},
 {id:'orsha',after:316,paragraph:1,until:326,title:'1812 · Retreat beyond Smolénsk',route:'advance',count:16,retreat:9},
 {id:'campaign-ended',after:327,paragraph:15,until:337,title:'1812 · End of the Russian campaign',route:'advance',count:16,retreat:21,ended:true,note:'The completed advance and withdrawal remain as historical context while the narrative returns to civilian lives.'},
 {id:'epilogue',after:337,until:365,title:'The epilogues · Postwar Europe',route:'advance',count:0,note:'No active French campaign is shown. Country names reflect the postwar setting.'}
];
function campaignAt(h=state.horizon){
 // A gap means hold the preceding phase, never interpolate an unrecorded movement.
 const p=[...CAMPAIGN_PHASES].reverse().find(p=>p.after<h)||CAMPAIGN_PHASES[0];
 const advance=[...(CAMPAIGN_ROUTES[p.route]||[]).slice(0,p.count),...(p.extra||[])];
 return {...p,advance,withdrawal:(CAMPAIGN_ROUTES.retreat||[]).slice(0,p.retreat||0)};
}
function periodCountries(h=state.horizon){
 const post=h>=338,late=h>=92,poland=h>=105;
 return [
  [post?'Kingdom of|France':'French|Empire',2.6,47.3],
  ['United|Kingdom',-3,54.8],['Spain',-3.6,40.5],['Austrian|Empire',17,46.7],['Kingdom of|Prussia',18.5,53.5],
  ['Russian|Empire',38.8,60.2],['Kingdom of|Sweden',15,61.8],['Ottoman|Empire',28,43.3],
  [post?'German|Confederation':late?'Confederation|of the Rhine':'Holy Roman|Empire',10.3,51.1],
  ...(poland?[[post?'Kingdom of Poland|(Russian crown)':'Duchy of|Warsaw',22,51.4]]:[]),
  ...(h>=108?[['Grand Duchy|of Finland',26,63.4]]:[])
 ];
}
function campaignCountries(xy){return periodCountries().map(([name,lon,lat])=>{const[x,y]=xy({lon,lat});return `<g class="period-label" transform="translate(${x} ${y})"><g class="marker-symbol"><text text-anchor="middle">${name.split('|').map((s,i)=>`<tspan x="0" dy="${i?15:0}">${esc(s)}</tspan>`).join('')}</text></g></g>`}).join('');}
function campaignOverlay(c,xy){
 const path=ps=>ps.map(([lon,lat],i)=>{const[x,y]=xy({lon,lat});return `${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`}).join(' ');
 const band=(ps,kind)=>ps.length>1?`<path class="campaign-route ${kind}" d="${path(ps)}" vector-effect="non-scaling-stroke"/>`:'';
 const end=c.withdrawal.length?c.withdrawal.at(-1):c.advance.at(-1);
 return `<g class="campaign-shading" aria-label="${esc(c.title)}">${band(c.advance,c.retreat||c.ended?'past':'advance')}${band(c.withdrawal,'withdrawal')}${end?(()=>{const[x,y]=xy({lon:end[0],lat:end[1]});return `<g transform="translate(${x} ${y})"><g class="marker-symbol campaign-front"><path d="M0,-9 L9,0 L0,9 L-9,0 Z" class="${c.retreat?'withdrawal':'advance'}"/><title>${esc(c.title)} · approximate position</title></g></g>`})():''}</g>`;
}
function campaignTowns(c,xy){
 const names=c.route==='austria'?[[3,'Ulm'],[4,'Braunau'],[5,'Enns'],[6,'Vienna'],[7,'Hollabrünn'],[8,'Austerlitz']]:c.route==='prussia'?[[0,'Jena'],[1,'Berlin'],[3,'Warsaw'],[4,'Eylau'],[5,'Friedland'],[6,'Tilsit']]:[[0,'Kovno / Niemen'],[2,'Vílna'],[9,'Vítebsk'],[10,'Smolénsk'],[14,'Borodinó'],[15,'Moscow']];
 const reached=names.filter(([i])=>i<c.advance.length),boxes=[];
 // Prefer the current endpoint and origin; omit intermediate labels that collide at this zoom.
 return [...reached].reverse().map(([i,name])=>{const[lon,lat]=c.advance[i],[x,y]=xy({lon,lat}),ww=name.length*6+12;
  if(boxes.some(b=>Math.abs(b.x-x)<(b.w+ww)/2&&Math.abs(b.y-y)<36))return '';
  boxes.push({x,y,w:ww});
  return `<g transform="translate(${x} ${y})"><g class="marker-symbol campaign-town"><circle r="3"/><text y="-24" text-anchor="middle">${esc(name)}</text></g></g>`;
 }).join('');
}
function campaignPanel(c){return `<section class="campaign-panel" aria-label="French campaign at chapter opening"><div><span class="eyebrow">At the opening of ${chLabel(state.horizon)}</span><h2>${esc(c.title)}</h2><p>${esc(c.note||'Latest established campaign phase before this chapter. Movements first narrated in this chapter appear when you move to the next one.')}</p>${c.paragraph!==undefined?`<button class="textbutton campaign-evidence" data-action="campaignEvidence" data-id="${c.id}">Established in ${chLabel(c.after)} ↗</button>`:''}</div><div class="campaign-legend"><span><i class="advance"></i>French advance</span><span><i class="past"></i>Earlier reach</span><span><i class="withdrawal"></i>Withdrawal</span><span><b>◆</b>Last mapped position</span></div></section>`;}
function campaignSources(){return `<details class="network-evidence campaign-sources"><summary>Historical map sources &amp; chapter timing</summary>${territorySources()}<p>The campaign lines show army movements separately from the territorial fills. The 1812 route reuses Charles Joseph Minard’s historical map through the public-domain stdlib dataset. The 1805 and 1806–07 lines are simplified connections between documented campaign locations.</p><p>The campaign is frozen at the opening of the selected chapter. Only earlier narrative evidence can advance it; a historical essay’s preview of later events does not advance the front. Where the novel revisits an earlier scene, the last established campaign phase is retained. This is a reading companion, not a day-by-day military reconstruction. Chapter-setting pins still describe the selected chapter itself.</p><p>Country labels and boundary snapshots use period geography. The principal 1805, 1806–07 and 1812 campaigns are covered; intervening and postwar chapters do not invent a current front. Minard’s route is schematic. Dates in the Maude text generally use the Russian calendar; no daily progress is inferred from them.</p><ul><li><a href="https://en.wikisource.org/wiki/War_and_Peace_(Tolstoy)/Maps" target="_blank" rel="noopener noreferrer">Original Maude edition: five War and Peace maps ↗</a></li><li><a href="https://github.com/stdlib-js/datasets-minard-napoleons-march" target="_blank" rel="noopener noreferrer">Minard’s 1812 route data · stdlib · CC0 / PDDL ↗</a></li><li><a href="https://www.napoleon.org/en/history-of-the-two-empires/timelines/napoleons-russian-campaign-from-the-niemen-to-moscow" target="_blank" rel="noopener noreferrer">Fondation Napoléon: from the Niemen to Moscow ↗</a></li><li><a href="https://www.napoleon.org/en/history-of-the-two-empires/timelines/napoleons-russian-campaign-the-retreat" target="_blank" rel="noopener noreferrer">Fondation Napoléon: the retreat ↗</a></li></ul><p>External historical references show whole campaigns, including events beyond your chapter.</p></details>`;}

// Extracted from data/army.json at stdlib commit 62d2face1627efb37461f344dfd7deff5ef902bb.
CAMPAIGN_ROUTES.advance=[[24.0,54.9],[24.5,55.0],[25.5,54.5],[26.0,54.7],[27.0,54.8],[28.0,54.9],[28.5,55.0],[29.0,55.1],[30.0,55.2],[30.3,55.3],[32.0,54.8],[33.2,54.9],[34.4,55.5],[35.5,55.4],[36.0,55.5],[37.6,55.8]];
CAMPAIGN_ROUTES.retreat=[[37.6,55.8],[37.5,55.7],[37.0,55.0],[36.8,55.0],[35.4,55.3],[34.3,55.2],[33.3,54.8],[32.0,54.6],[30.4,54.4],[29.2,54.4],[28.5,54.3],[28.3,54.4],[28.3,54.3],[27.5,54.5],[26.8,54.3],[26.4,54.4],[24.6,54.5],[24.4,54.4],[24.2,54.4],[24.1,54.3]];
