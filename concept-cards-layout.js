'use strict';
(()=>{
 const data=JSON.parse(document.getElementById('card-data').textContent),get=id=>document.getElementById(id);
 const cover=get('cover-screen'),map=get('map-screen'),reader=get('reader-screen'),entries=[...document.querySelectorAll('[data-lesson]')];
 let selected=0,page=0,lastTrigger=null,restoreKeyboard=false;const visited=new Set();
 const make=(tag,className,text)=>{const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;};
 function changeScreen(which){cover.hidden=which!=='cover';map.hidden=which!=='map';reader.hidden=which!=='reader';window.scrollTo({top:0,behavior:'instant'});}
 function lessonPages(d){const pages=d.paragraphs.map((text,i)=>({kind:'KAVRAMI KEŞFET',title:i===0?d.title:d.name,text}));if(d.quote)pages.push({kind:'AYET',title:'Kaynakla ilişkilendir',text:d.quote,cite:d.reference});for(const q of d.quotes||[])pages.push({kind:'AYET / HADİS',title:'Kaynakla ilişkilendir',text:q.text,cite:q.ref});if(d.key)pages.push({kind:'ANA FİKİR',title:'Aklında kalsın',text:d.key});if(d.question||d.example)pages.push({kind:d.choices?'SEN KARAR VER':'DÜŞÜNME SORUSU',title:'Düşün ve uygula',text:d.question||d.example,choices:d.choices});if(d.answer&&!d.choices)pages.push({kind:'GERİ BİLDİRİM',title:'Açıklama',text:d.answer});return pages;}
 function render(){const d=data.lessons[selected],pages=lessonPages(d),p=pages[page];get('lesson-heading').textContent=d.name;get('reader-location').textContent=(selected+1)+' / 4 bölüm';get('page-kicker').textContent=p.kind;get('page-title').textContent=p.title;get('page-text').textContent=p.text;get('page-cite').textContent=p.cite||'';get('page-cite').hidden=!p.cite;
  const flow=get('page-flow');flow.replaceChildren();if(page===0)for(const [i,text] of (d.flow||[]).entries()){if(i){const a=make('b','', '→');a.setAttribute('aria-hidden','true');flow.append(a);}flow.append(make('span','',text));}flow.hidden=flow.children.length===0;
  const answers=get('page-answers');answers.replaceChildren();get('page-feedback').textContent='';if(p.choices)for(const choice of p.choices){const b=make('button','answer',choice.text);b.type='button';b.addEventListener('click',()=>{get('page-feedback').textContent=choice.feedback;});answers.append(b);}answers.hidden=!p.choices;
  get('page-number').textContent=(page+1)+' / '+pages.length;get('previous-page').disabled=page===0;get('next-page').disabled=page===pages.length-1;
  const source=get('lesson-source');source.replaceChildren();if(d.url){source.append(make('span','', 'Kaynak bağlantısı: '));const a=make('a','',d.source||'Kaynağı aç ↗');a.href=d.url;a.target='_blank';a.rel='noopener noreferrer';source.append(a);}source.hidden=!d.url;
 }
 function showLesson(index,event){selected=index;page=0;lastTrigger=entries[index];restoreKeyboard=!!event&&event.detail===0;visited.add(index);entries.forEach((b,i)=>{b.dataset.visited=String(visited.has(i));});get('map-progress').textContent=visited.size+' / 4 bölüm keşfedildi';render();changeScreen('reader');if(restoreKeyboard)get('lesson-heading').focus({preventScroll:true});}
 entries.forEach(button=>button.addEventListener('click',e=>showLesson(Number(button.dataset.lesson),e)));
 get('enter-card').addEventListener('click',e=>{changeScreen('map');if(e.detail===0)get('map-heading').focus({preventScroll:true});});
 get('return-cover').addEventListener('click',e=>{changeScreen('cover');if(e.detail===0)get('enter-card').focus({preventScroll:true});});
 function returnToMap(keyboard){changeScreen('map');if(keyboard&&lastTrigger)lastTrigger.focus({preventScroll:true});}
 get('return-map').addEventListener('click',e=>returnToMap(e.detail===0));
 get('previous-page').addEventListener('click',()=>{if(page>0){page--;render();}});get('next-page').addEventListener('click',()=>{if(page<lessonPages(data.lessons[selected]).length-1){page++;render();}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!reader.hidden)returnToMap(true);});
 changeScreen('cover');
})();
