const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=Object.fromEntries(['text','index','editorial','geography','locations','settings','territory-data','characters-extra'].map(n=>[n,JSON.parse(fs.readFileSync('dist/'+n+'.json','utf8'))]));
const ctx=vm.createContext({console,localStorage:{getItem(){return null}},document:{addEventListener(){}},data});
for(const f of ['preferences','workspace','campaign','territory','atlas'])vm.runInContext(fs.readFileSync('dist/'+f+'.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('dist/app.js','utf8').split("Promise.all(['text'")[0],ctx);
vm.runInContext('T=data.text;I=data.index;E=data.editorial;G=data.geography;territoryData=data["territory-data"];L=data.locations;A=data.settings;extendCharacters(data["characters-extra"]);',ctx);
const at=h=>vm.runInContext(`campaignAt(${h})`,ctx);
// Boundary examples independently matched to the chapter text, including backward navigation.
for(const [h,id] of [[31,'before-1805'],[32,'ulm'],[38,'enns'],[39,'vienna'],[169,'interlude'],[170,'niemen'],[172,'niemen'],[173,'vilna'],[194,'vitebsk'],[195,'smolensk'],[209,'smolensk'],[210,'borodino'],[255,'moscow-outskirts'],[256,'moscow'],[292,'moscow'],[293,'leaving-moscow'],[327,'orsha'],[328,'campaign-ended'],[338,'epilogue'],[256,'moscow'],[255,'moscow-outskirts'],[170,'niemen'],[1,'before-1805']])assert.equal(at(h).id,id,`chapter ${h}`);
assert(at(255).advance.every(p=>p[0]<37.6));assert.equal(at(256).advance.at(-1)[0],37.6);
assert.equal(at(292).withdrawal.length,0);assert.equal(at(293).withdrawal.length,2);
assert(at(328).withdrawal.at(-1)[0]<24.2);
assert.equal(at(168).advance.length,0);assert.equal(at(338).advance.length,0);
for(let h=1;h<=365;h++){
 const c=at(h);assert(c.after<h);assert([...c.advance,...c.withdrawal].every(p=>p.length===2&&p.every(Number.isFinite)));
 if(c.paragraph!==undefined)assert(data.text.chapters[c.after-1].paragraphs[c.paragraph]);
 vm.runInContext(`state.horizon=${h};filters.campaignLayer='on';filters.atlasMode='chapter';`,ctx);
 const html=vm.runInContext('chapterAtlas()',ctx);assert(!html.includes('undefined'));assert(!html.includes('NaN'));
 assert(html.includes('At the opening of '));assert(!html.includes('Modern reference outlines'));
 for(const m of html.matchAll(/data-chapter="(\d+)"/g))assert(+m[1]<=h);
}
for(const h of [1,91,104])assert(!vm.runInContext(`periodCountries(${h}).map(c=>c[0]).join(' ')`,ctx).includes('Duchy of|Warsaw'));
assert(vm.runInContext("periodCountries(181).some(c=>c[0]==='Duchy of|Warsaw')",ctx));
assert(vm.runInContext("periodCountries(1).some(c=>c[0]==='Holy Roman|Empire')",ctx));
assert(!vm.runInContext("periodCountries(181).some(c=>c[0].includes('Holy Roman'))",ctx));
assert(vm.runInContext("periodCountries(338).some(c=>c[0]==='Kingdom of|France')",ctx));
vm.runInContext("state.horizon=256;filters.campaignLayer='off';",ctx);
assert(!vm.runInContext('chapterAtlas()',ctx).includes('class="campaign-shading"'));
vm.runInContext("filters.campaignLayer='on';",ctx);
assert(vm.runInContext('chapterAtlas()',ctx).includes('class="campaign-shading"'));
const original=JSON.parse(fs.readFileSync('dist/minard-army.json','utf8'));
const expected=original.filter(p=>p.division===1&&p.direction==='A').map(p=>[p.lon,p.lat]);
expected.push([37.6,55.8]);
assert.equal(vm.runInContext('JSON.stringify(CAMPAIGN_ROUTES.advance)',ctx),JSON.stringify(expected));
console.log('PASS: all 365 chapter openings, source anchors, Moscow and retreat boundaries, reverse navigation, period names, hidden overlay, original Minard coordinates.');

// Political transitions and polygon extent are separate from the route display.
const territory = h => vm.runInContext(`territoryAt(${h}, campaignAt(${h}))`,ctx);
const geometries = data['territory-data'].geometries;
const east = id => Math.max(...geometries[id].flat().map(([lon])=>lon));
assert(!territory(104).snapshot.borders.some(([name])=>name==='Duchy of Warsaw'));
assert(territory(105).snapshot.borders.some(([name])=>name==='Duchy of Warsaw'));
assert.equal(territory(169).occupation,undefined);
assert(east(territory(173).occupation.held)<26);
assert(east(territory(255).occupation.held)<37.6);
assert(east(territory(256).occupation.held)>37.6);
assert(east(territory(293).occupation.held)<37.6);
assert(east(territory(293).occupation.earlier)>37.6);
assert.equal(territory(328).occupation.held,null);
assert.equal(territory(338).snapshot.acquired,null);
const frame = vm.runInContext("state.horizon=256;filters.campaignLayer='off';chapterAtlas()",ctx);
assert(frame.includes('class="period-border"'));
assert(!frame.includes('class="territory-acquired"'));
assert(!frame.includes('class="territory-occupied"'));
console.log('PASS: period border transitions, occupation advance and release, independent border rendering.');
