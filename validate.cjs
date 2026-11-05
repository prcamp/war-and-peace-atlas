const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=Object.fromEntries(['text','index','editorial','geography','locations','settings'].map(n=>[n,JSON.parse(fs.readFileSync('dist/'+n+'.json','utf8'))]));
assert.equal(data.text.chapters.length,365);assert.equal(data.text.books.length,17);assert(data.text.chapters.every(c=>c.paragraphs.length));
for(const key of ['events','knowledge','relations'])for(const item of data.editorial[key]){const c=data.text.chapters[item.chapter-1];assert(c&&c.paragraphs[item.paragraph],JSON.stringify(item));}
const context=vm.createContext({console,localStorage:{getItem(){return null}},document:{addEventListener(){}},data});
vm.runInContext(fs.readFileSync('dist/workspace.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/campaign.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/atlas.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/app.js','utf8').split("Promise.all(['text'")[0],context);
vm.runInContext('T=data.text;I=data.index;E=data.editorial;G=data.geography;L=data.locations;A=data.settings;for(const p of L.places||[])I.places.push({...p,first:Math.min(...L.observations.filter(o=>o.place===p.id).map(o=>o.chapter)),hits:[],aliases:[]});',context);
for(const h of [1,2,28,94,163,260,365]){
 vm.runInContext(`state.horizon=${h};state.chapter=${h};`,context);
 for(const name of ['overview','readView','charactersView','connectionsView','timelineView','atlasView','knowledgeView','queryView','notebookView']){
  const out=vm.runInContext(name+'()',context);assert(out.length>50,name);
  for(const m of out.matchAll(/data-chapter="(\d+)"/g))assert(+m[1]<=h,`${name} leaks ${m[1]} beyond ${h}`);
  assert(!out.includes('undefined'),name+' undefined');
 }
}
vm.runInContext("state.horizon=1;filters.query='Karataev';",context);assert(vm.runInContext('queryResults()',context).includes('0 passages'));
vm.runInContext("state.horizon=163;filters.character='anatole';filters.query='married';",context);assert(vm.runInContext('queryResults()',context).includes('Read in context'));
console.log('PASS: 365 chapters; 111 editorial source references; nine views at seven horizons; future-text query exclusion; compound query.');
// Regression: previews cannot disclose locked characters or source passages.
vm.runInContext("state.horizon=1;filters.character='';filters.graph='relations';filters.networkKind='relations';",context);
assert.equal(vm.runInContext("peekCharacterContent('pierre')",context),'');
const peekHtml=vm.runInContext("peekCharacterContent('vasili')",context);
assert(peekHtml.includes('preview evidence'));assert(!peekHtml.includes('data-action="source"'));
assert(!peekHtml.includes('data-action="pivot"'));
for(const m of peekHtml.matchAll(/data-chapter="(\d+)"/g))assert(+m[1]<=1);
assert(!vm.runInContext('constellation()',context).includes('data-action="character"'));
assert(!vm.runInContext('constellation()',context).includes('<line'));
vm.runInContext("state.horizon=365;filters.graph='mentions';filters.networkKind='mentions';filters.character='karataev';",context);
const graphFirst=vm.runInContext('connectionsView()',context);
assert(graphFirst.includes('data-id="karataev"'));assert(!graphFirst.includes('graphNext'));
vm.runInContext("filters.character='napoleon';",context);
const graphSecond=vm.runInContext('connectionsView()',context);
assert(graphSecond.includes('data-id="napoleon"'));assert(!graphSecond.includes('graphPrev'));assert.equal(vm.runInContext('networkSlice().drawn.length',context),vm.runInContext('semanticEdges().length',context));
assert.equal(vm.runInContext("knowledgeRole(E.knowledge.find(k=>k.id==='k10'))",context),'Explicitly unaware at this passage');
assert.equal(vm.runInContext("knowledgeRole(E.knowledge.find(k=>k.id==='k20'))",context),'Mistaken belief at this passage');
console.log('PASS: chapter-gated inline previews; no implicit navigation; no decorative relationship lines; complete focused networks; epistemic role distinctions.');
// Explicit identity collision: the old prince is not Nicholas Rostov.
assert(!data.index.characters.find(c=>c.id==='nikolai').hits.find(h=>h.chapter===25)?.paragraphs.includes(0));
vm.runInContext('state.horizon=365;',context);
assert(!vm.runInContext("linkedText('Prince Nicholas Andreevich Bolkonski')",context).includes('data-id="nikolai"'));
context.window={matchMedia:()=>({matches:true})};
vm.runInContext("filters.character='';filters.graph='relations';filters.networkKind='relations';",context);
const mobileGraph=vm.runInContext('connectionsView()',context);
assert.equal([...mobileGraph.matchAll(/class="graph-node"/g)].length,data.index.characters.filter(c=>c.first<=365).length);
assert(mobileGraph.includes('Fit all'));assert(mobileGraph.includes('id="networkCanvas"'));
assert(mobileGraph.includes('r="28" fill="transparent"'));
console.log('PASS: Nicholas identity collision; all-character mobile viewport; enlarged mobile hit targets.');
// Network projections preserve restriction and source identity.
for(const o of data.locations.observations){assert(data.text.chapters[o.chapter-1]?.paragraphs[o.paragraph]);assert(data.index.characters.some(c=>c.id===o.character));assert(data.index.places.some(p=>p.id===o.place));}
for(const h of [1,2,28,94,163,260,365]){
 vm.runInContext(`state.horizon=${h};filters.character='';filters.place='';`,context);
 for(const kind of ['relations','family','courtship','social','conflict','military','information','mentions','places']){
  vm.runInContext(`filters.networkKind='${kind}';`,context);
  const edges=vm.runInContext('semanticEdges()',context);assert(edges.every(e=>e.chapter<=h));
  const slice=vm.runInContext('networkSlice()',context);
  assert.equal(slice.drawn.length,edges.length);assert(edges.every(e=>slice.nodes.includes(e.from)&&slice.nodes.includes(e.to)));
  for(const c of data.index.characters)assert.equal(slice.nodes.includes(c.id),c.first<=h);
  const html=vm.runInContext('networkWorkspace()',context);assert.equal([...html.matchAll(/class="graph-node"/g)].length,slice.nodes.length);assert(!/graphPrev|graphNext/.test(html));
  const layout=vm.runInContext('networkLayout(networkSlice())',context);assert(layout.pts.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=layout.w&&p.y>=0&&p.y<=layout.h));
  assert(!vm.runInContext('networkWorkspace()',context).includes('undefined'));
 }
 assert(!vm.runInContext('movementAtlas()',context).includes('undefined'));
}
vm.runInContext("state.horizon=163;filters.character='pierre';filters.networkKind='places';",context);
assert.deepEqual(Array.from(vm.runInContext('semanticEdges().map(e=>e.id).sort()',context)),Array.from(vm.runInContext('selectedObservations().map(e=>e.id).sort()',context)));
vm.runInContext("state.horizon=1;filters.character='karataev';",context);
assert.equal(vm.runInContext('semanticEdges().length',context),0);
assert(!vm.runInContext('networkWorkspace()',context).includes('Platon Karataev'));
assert.equal([...vm.runInContext('universalTimeline()',context).matchAll(/data-action="timelineJump"/g)].length,365);
console.log('PASS: nine network kinds across seven horizons; sourced location references; complete mobile networks; selection-preserving location projection; locked identity; 365 chapter ticks.');
// Chapter setting atlas: exhaustive chapter classification, no future evidence.
assert.equal(data.settings.chapters.length,365);
assert.equal(new Set(data.settings.chapters.map(c=>c.chapter)).size,365);
for(const c of data.settings.chapters)for(const s of c.settings){assert(s.evidenceChapter<=c.chapter);assert(data.text.chapters[s.evidenceChapter-1]?.paragraphs[s.paragraph]);assert(vm.runInContext(`!!atlasPlace(${JSON.stringify(s.place)})`,context));}
for(const h of [1,2,10,25,29,50,85,133,168,191,230,264,318,338,365]){
 vm.runInContext(`state.horizon=${h};filters.character='';filters.place='';`,context);
 for(const mode of ['chapter','story','latest','trail']){
  vm.runInContext(`filters.atlasMode='${mode}';`,context);
  const rows=vm.runInContext('atlasRows()',context);assert(rows.every(r=>r.chapter<=h&&(r.evidenceChapter||r.chapter)<=h));
  if(mode==='chapter')assert(rows.every(r=>r.chapter===h));
  const html=vm.runInContext('chapterAtlas()',context);assert(!html.includes('undefined'));assert(html.includes('id="atlasCanvas"'));assert(!html.includes('data-filter="region"'));
 }
}
vm.runInContext("state.horizon=2;filters.atlasMode='chapter';",context);assert.equal(vm.runInContext('atlasRows()[0].place',context),'petersburg');assert.equal(vm.runInContext('atlasRows()[0].evidenceChapter',context),1);
vm.runInContext("state.horizon=10;",context);assert.equal(vm.runInContext('atlasRows()[0].place',context),'moscow');
vm.runInContext("state.horizon=25;",context);assert(vm.runInContext('chapterAtlas()',context).includes('Setting without a precise pin'));
vm.runInContext("state.horizon=365;",context);assert.equal(vm.runInContext('atlasRows().length',context),0);
console.log('PASS: all 365 chapter classifications and evidence anchors; scene continuity; 4 layers at 15 horizons; one continuous map; fictional setting and essay states.');
// Exercise the actual gesture handlers with geometry-only DOM doubles.
const mapAttrs={};const mapSvg={dataset:{width:'360',height:'390'},setAttribute(k,v){mapAttrs[k]=v},querySelectorAll(){return []},getBoundingClientRect(){return {left:0,top:0,width:360,height:390}},setPointerCapture(){},hasPointerCapture(){return false},addEventListener(){}};
const controls=['in','out','fit'].map(x=>({dataset:{map:x}}));
context.document.querySelector=s=>s==='#atlasCanvas'?mapSvg:s==='#continuousMap'?{querySelectorAll(){return controls}}:null;
vm.runInContext('closePeek=()=>{};bindAtlasMap()',context);
mapSvg.onpointerdown({pointerId:1,clientX:100,clientY:100});mapSvg.onpointermove({pointerId:1,clientX:140,clientY:130});assert.equal(mapAttrs.viewBox,'-40 -30 360 390');mapSvg.onpointerup({pointerId:1});
controls[2].onclick({stopPropagation(){}});assert.equal(mapAttrs.viewBox,'0 0 360 390');
mapSvg.onpointerdown({pointerId:1,clientX:100,clientY:100});mapSvg.onpointerdown({pointerId:2,clientX:200,clientY:100});mapSvg.onpointermove({pointerId:2,clientX:300,clientY:100});assert.equal(+mapAttrs.viewBox.split(' ')[2],180);
mapSvg.onpointerup({pointerId:2});mapSvg.onpointerup({pointerId:1});controls[2].onclick({stopPropagation(){}});
controls[0].onclick({stopPropagation(){}});assert.equal(+mapAttrs.viewBox.split(' ')[2],234);
console.log('PASS: drag-pan, two-pointer pinch, zoom control, fit reset.');


// Network uses the same tested pan/pinch/fit implementation with its own canvas.
vm.runInContext('bindAtlasMap',context)(mapSvg,{querySelectorAll(){return controls}});
controls[0].onclick({stopPropagation(){}});assert.equal(+mapAttrs.viewBox.split(' ')[2],234);
controls[2].onclick({stopPropagation(){}});assert.equal(mapAttrs.viewBox,'0 0 360 390');
console.log('PASS: network zoom and fit; all nodes and every edge retained across layers and horizons.');
