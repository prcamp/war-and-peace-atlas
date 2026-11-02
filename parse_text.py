import re,json,html,pathlib
src=(pathlib.Path(__file__).parent / 'sources' / 'maude.html').read_text()
clean=lambda x:re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',x))).strip()
heads=list(re.finditer(r'<h2[^>]*>(.*?)</h2>',src,re.S)); chapters=[];books=[];book=None
for i,h in enumerate(heads):
 title=clean(h[1]); a=re.search(r'id="([^"]+)"',h[1]); anchor=a[1] if a else ''
 if title.startswith('BOOK ') or title.startswith('FIRST EPILOGUE') or title.startswith('SECOND EPILOGUE'):
  book={'id':len(books)+1,'title':title,'start':len(chapters)+1};books.append(book)
 elif title.startswith('CHAPTER') and book:
  body=src[h.end():heads[i+1].start() if i+1<len(heads) else src.find('*** END')]
  ps=[]
  for p in re.finditer(r'<(p|pre)([^>]*)>(.*?)</\1>',body,re.S):
   t=clean(p[3])
   if t and 'END OF THE PROJECT' not in t:ps.append({'text':t,'note':'footnote' in p[2]})
  chapters.append({'id':len(chapters)+1,'book':book['id'],'chapter':sum(c['book']==book['id'] for c in chapters)+1,'roman':title.replace('CHAPTER ',''),'anchor':anchor,'paragraphs':ps})
out={'source':'https://www.gutenberg.org/files/2600/2600-h/2600-h.htm','translation':'Louise and Aylmer Maude','books':books,'chapters':chapters}
(pathlib.Path(__file__).parent / 'dist' / 'text.json').write_text(json.dumps(out,ensure_ascii=False))
print(len(chapters),'chapters',len(books),'books',sum(len(c['paragraphs']) for c in chapters),'paragraphs')
print(books)
