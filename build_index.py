import json,re,unicodedata,pathlib,math,gzip
D=pathlib.Path(__file__).parent / 'dist';data=json.loads((D/'text.json').read_text())
def norm(t):return ''.join(c for c in unicodedata.normalize('NFD',t.lower()) if unicodedata.category(c)!='Mn')
rows=[
('anna','Anna Pavlovna','Society','Anna Pavlovna|Scherer'),('vasili','Prince Vasili','Kuragin','Prince Vasili'),('anatole','Anatole','Kuragin','Anatole'),('ippolit','Hippolyte','Kuragin','Hippolyte'),('helene','Hélène','Kuragin','Helene'),('pierre','Pierre','Bezukhov','Pierre'),('andrei','Prince Andrew','Bolkonsky','Prince Andrew'),('marya','Princess Mary','Bolkonsky','Princess Mary'),('oldbolkonsky','Old Prince Bolkonski','Bolkonsky','old Prince Bolkonski|Prince Nicholas Andreevich|Prince Nikolai Andreevich'),('lise','Lise','Bolkonsky','Lise|little princess'),('natasha','Natasha','Rostov','Natasha|Natalya Ilinichna'),('nikolai','Nicholas Rostov','Rostov','Nicholas|Nikolai Rostov'),('rostov','Count Rostov','Rostov','Count Rostov|Ilya Andreevich'),('countess','Countess Rostova','Rostov','Countess Rostova|Countess Rostov'),('petya','Petya','Rostov','Petya'),('sonya','Sonya','Rostov','Sonya'),('boris','Boris','Drubetskoy','Boris'),('drubetskaya','Anna Mikhaylovna','Drubetskoy','Anna Mikhaylovna'),('denisov','Denisov','Army','Denisov'),('dolokhov','Dolokhov','Army','Dolokhov'),('kutuzov','Kutuzov','Army','Kutuzov'),('napoleon','Napoleon','History','Napoleon|Buonaparte|Bonaparte'),('alexander','Emperor Alexander','History','Emperor Alexander|Alexander Pavlovich'),('karataev','Platon Karataev','Army','Karataev'),('julie','Julie Karagina','Society','Julie'),('berg','Berg','Army','Berg'),('bagration','Bagration','Army','Bagration'),('tushin','Tushin','Army','Tushin'),('balashev','Balashev','History','Balashev'),('speransky','Speranski','History','Speranski'),('vera','Vera','Rostov','Vera'),('bourienne','Mademoiselle Bourienne','Bolkonsky','Bourienne'),('mariad','Marya Dmitrievna','Society','Marya Dmitrievna'),('nikolenka','Nikolushka','Bolkonsky','Nikolushka'),('ramballe','Ramballe','Army','Ramballe'),('tikhon','Tikhon Shcherbaty','Army','Shcherbaty'),('dokturov','Dokhturov','Army','Dokhturov'),('r ost','Rostopchin','History','Rostopchin')]
rows[-1]=('rostopchin',*rows[-1][1:])
characters=[]
for id,name,fam,aliases in rows:
 pat=re.compile(r'\b(?:'+aliases.lower()+r')\b')
 if id=='nikolai':pat=re.compile(r'(?<!prince )\b(?:nicholas|nikolai rostov)\b')
 hits=[]
 for c in data['chapters']:
  paragraphs=[i for i,p in enumerate(c['paragraphs']) if pat.search(norm(p['text']))]
  if paragraphs:hits.append({'chapter':c['id'],'paragraphs':paragraphs,'count':sum(len(pat.findall(norm(c['paragraphs'][i]['text']))) for i in paragraphs)})
 characters.append({'id':id,'name':name,'family':fam,'aliases':aliases.split('|'),'first':hits[0]['chapter'] if hits else 366,'hits':hits})
places=[('petersburg','St Petersburg',30.3158,59.9391,'Petersburg','city'),('moscow','Moscow',37.6173,55.7558,'Moscow','city'),('baldhills','Bald Hills',32.1,54.5,'Bald Hills','fictional'),('otradnoe','Otradnoe',37.3,54.7,'Otradnoe','fictional'),('austerlitz','Austerlitz',16.88,49.15,'Austerlitz','battlefield'),('schongraben','Schöngrabern',16.1,48.65,'Schongraben|Schon Grabern','battlefield'),('borodino','Borodino',35.82,55.52,'Borodino','battlefield'),('smolensk','Smolensk',32.05,54.78,'Smolensk','city'),('vilna','Vilna / Vilnius',25.28,54.69,'Vilna','city'),('tarutino','Tarutino',36.95,55.1,'Tarutino','battlefield'),('paris','Paris',2.35,48.86,'Paris','city'),('bogucharovo','Bogucharovo',32.6,54.4,'Bogucharovo','fictional'),('vienna','Vienna',16.37,48.21,'Vienna','city'),('brunn','Brünn / Brno',16.61,49.2,'Brunn','city'),('tula','Tula',37.62,54.2,'Tula','city'),('kiev','Kiev / Kyiv',30.52,50.45,'Kiev','city'),('pratzen','Pratzen Heights',16.76,49.14,'Pratzen','battlefield'),('braunau','Braunau am Inn',13.04,48.26,'Braunau','city')]
pp=[]
for id,name,lon,lat,alias,kind in places:
 pat=re.compile(r'\b(?:'+alias.lower()+r')\b');hits=[]
 for c in data['chapters']:
  ix=[i for i,p in enumerate(c['paragraphs']) if pat.search(norm(p['text']))]
  if ix:hits.append({'chapter':c['id'],'paragraphs':ix})
 pp.append(dict(id=id,name=name,lon=lon,lat=lat,kind=kind,aliases=alias.split('|'),hits=hits,first=hits[0]['chapter'] if hits else 366))
themes={'war':['war','battle','soldier','army','cannon'],'society':['society','salon','drawing room','ball','dinner'],'family':['father','mother','sister','brother','child'],'love':['love','marriage','marry','kiss'],'power':['power','emperor','command','orders'],'faith':['god','faith','prayer','soul'],'history':['history','historian','cause','necessity'],'freedom':['freedom','free will','liberty'],'money':['money','rubles','debt','fortune']}
for c in data['chapters']:
 t=norm(' '.join(p['text'] for p in c['paragraphs']));c['words']=len(t.split());c['characters']=[v['id'] for v in characters if any(h['chapter']==c['id'] for h in v['hits'])];c['places']=[v['id'] for v in pp if any(h['chapter']==c['id'] for h in v['hits'])];c['themes']={k:sum(len(re.findall(r'\b'+w+r'\b',t)) for w in ws) for k,ws in themes.items()}
(D/'text.json').write_text(json.dumps(data,ensure_ascii=False))
(D/'index.json').write_text(json.dumps({'characters':characters,'places':pp,'themes':themes},ensure_ascii=False))
geo=json.load(gzip.open(pathlib.Path(__file__).parent / 'sources' / 'countries.geojson.gz','rt'));features=[]
for f in geo['features']:
 g=f['geometry'];polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']];out=[]
 for poly in polys:
  ring=poly[0]
  if not any(-12<x<48 and 35<y<67 for x,y,*_ in ring):continue
  simple=[]
  for p in ring:
   if not simple or math.dist(p[:2],simple[-1])>.16:simple.append(p[:2])
  if len(simple)>3:out.append(simple)
 if out:features.append({'name':f['properties'].get('name',f['properties'].get('ADMIN','')),'polygons':out})
(D/'geography.json').write_text(json.dumps(features))
print('Indexed',len(characters),'characters;',len(pp),'places;',len(features),'map regions')
