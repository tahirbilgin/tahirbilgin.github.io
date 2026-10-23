'use strict';
(()=>{
 const data=JSON.parse(document.getElementById('card-data').textContent),get=id=>document.getElementById(id);
 const cover=get('cover-screen'),map=get('map-screen'),reader=get('reader-screen'),entries=[...document.querySelectorAll('[data-lesson]')];let selected=0,lastTrigger=null;const visited=new Set();
 const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 function changeScreen(which){cover.hidden=which!=='cover';map.hidden=which!=='map';reader.hidden=which!=='reader';document.body.classList.toggle('lesson-open',which==='reader');window.scrollTo({top:0,behavior:'instant'});}
 function render(){const d=data.lessons[selected];get('lesson-heading').textContent=d.title;get('reader-location').textContent=d.name+' · '+(selected+1)+' / 4';const container=get('lesson-content');container.replaceChildren();
  const flow=make('div','flow');flow.setAttribute('aria-label','Kavram bağlantıları');for(const [i,text] of (d.flow||[]).entries()){if(i){const a=make('b','','→');a.setAttribute('aria-hidden','true');flow.append(a);}flow.append(make('span','',text));}if(flow.children.length)container.append(flow);
  for(const text of d.paragraphs)container.append(make('p','lesson-paragraph',text));
  const quotes=[...(d.quotes||[])];if(d.quote)quotes.push({text:d.quote,ref:d.reference});for(const quote of quotes){const block=make('blockquote','lesson-quote',quote.text);if(quote.ref)block.append(make('cite','',quote.ref));container.append(block);}
  if(d.key)container.append(make('div','highlight',d.key));
  if(d.question||d.example){const question=make('div','question');question.append(make('p','lesson-paragraph',d.question||d.example));
   if(d.choices){const choices=make('div','answers'),feedback=make('div','feedback');feedback.setAttribute('aria-live','polite');for(const choice of d.choices){const b=make('button','answer',choice.text);b.type='button';b.addEventListener('click',()=>{feedback.textContent=choice.feedback;});choices.append(b);}question.append(choices,feedback);}
   else if(d.answer){const toggle=make('button','reveal-answer','Açıklamayı göster'),answer=make('div','answer-text',d.answer);answer.id='lesson-answer';answer.hidden=true;toggle.type='button';toggle.id='reveal-answer';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','lesson-answer');toggle.addEventListener('click',()=>{answer.hidden=!answer.hidden;toggle.textContent=answer.hidden?'Açıklamayı göster':'Açıklamayı gizle';toggle.setAttribute('aria-expanded',String(!answer.hidden));});question.append(toggle,answer);}container.append(question);}
  if(d.url){const source=make('div','source','Kaynak bağlantısı: '),a=make('a','',d.source||'Kaynağı aç ↗');a.href=d.url;a.target='_blank';a.rel='noopener noreferrer';source.append(a);container.append(source);}
 }
 function showLesson(index,event){selected=index;lastTrigger=entries[index];visited.add(index);entries.forEach((b,i)=>b.dataset.visited=String(visited.has(i)));get('map-progress').textContent=visited.size+' / 4 bölüm keşfedildi';render();changeScreen('reader');reader.scrollTop=0;if(!window.matchMedia('(max-width:650px)').matches||(event&&event.detail===0))get('return-map').focus({preventScroll:true});}
 entries.forEach(button=>button.addEventListener('click',e=>showLesson(Number(button.dataset.lesson),e)));
 get('enter-card').addEventListener('click',e=>{changeScreen('map');if(e.detail===0)get('map-heading').focus({preventScroll:true});});
 get('return-cover').addEventListener('click',e=>{changeScreen('cover');if(e.detail===0)get('enter-card').focus({preventScroll:true});});
 function returnToMap(keyboard){changeScreen('map');if(keyboard&&lastTrigger)lastTrigger.focus({preventScroll:true});}
 get('return-map').addEventListener('click',e=>returnToMap(e.detail===0));
 document.addEventListener('click',e=>{if(!reader.hidden&&e.target===document.body)returnToMap(false);});
 document.addEventListener('keydown',e=>{if(reader.hidden)return;if(e.key==='Escape'){returnToMap(true);return;}if(e.key==='Tab'){const nodes=[...reader.querySelectorAll('button:not(:disabled),a[href]')],first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 changeScreen('cover');
})();


/* Size the interactive image against its actual phone-only flex space. */
(()=>{
 const phone=window.matchMedia('(max-width:650px)'),area=document.querySelector('.visual'),map=document.querySelector('.map'),screen=document.getElementById('map-screen');if(!area||!map||!screen)return;
 let frame=0;
 function fit(){frame=0;if(!phone.matches){map.style.removeProperty('width');map.style.removeProperty('height');return;}if(screen.hidden)return;const bounds=area.getBoundingClientRect();if(bounds.width<=0||bounds.height<=0)return;const image=map.querySelector('img'),ratio=image&&image.naturalWidth&&image.naturalHeight?image.naturalWidth/image.naturalHeight:1122/1402;const width=Math.min(bounds.width,bounds.height*ratio);map.style.width=width+'px';map.style.height=(width/ratio)+'px';}
 function schedule(){if(!frame)frame=requestAnimationFrame(fit);}
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(schedule).observe(area);
 new MutationObserver(schedule).observe(screen,{attributes:true,attributeFilter:['hidden']});
 if(phone.addEventListener)phone.addEventListener('change',schedule);else phone.addListener(schedule);
 window.addEventListener('resize',schedule);if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule);
 const image=map.querySelector('img');if(image)image.addEventListener('load',schedule);schedule();
})();
