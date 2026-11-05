const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=Object.fromEntries(['text','index','editorial','geography','locations','settings'].map(n=>[n,JSON.parse(fs.readFileSync('dist/'+n+'.json','utf8'))]));
const ctx=vm.createContext({console,localStorage:{getItem(){return null}},document:{addEventListener(){}},data});
for(const f of ['workspace','campaign','atlas'])vm.runInContext(fs.readFileSync('dist/'+f+'.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('dist/app.js','utf8').split("Promise.all(['text'")[0],ctx);
vm.runInContext('T=data.text;I=data.index;E=data.editorial;G=data.geography;L=data.locations;A=data.settings;',ctx);
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
for(const h of [1,91,106])assert(!vm.runInContext(`periodCountries(${h}).map(c=>c[0]).join(' ')`,ctx).includes('Duchy of|Warsaw'));
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
