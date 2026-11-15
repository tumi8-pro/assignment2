document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  // Theme preference persists between pages using localStorage.
  const themeButtons=document.querySelectorAll('.theme-toggle');
  const applyTheme=dark=>{document.body.classList.toggle('dark-mode',dark);themeButtons.forEach(button=>button.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode'));};
  try{applyTheme(localStorage.getItem('lesotho-theme')==='dark');}catch(_){applyTheme(false);}
  themeButtons.forEach(button=>button.addEventListener('click',()=>{const dark=!document.body.classList.contains('dark-mode');applyTheme(dark);try{localStorage.setItem('lesotho-theme',dark?'dark':'light');}catch(_){}}));

  // Destination filtering and live search can be combined.
  const items=[...document.querySelectorAll('.destination-item')],search=document.querySelector('#place-search'),filters=[...document.querySelectorAll('[data-filter]')],empty=document.querySelector('.empty-state');let category='all';
  const updatePlaces=()=>{const query=(search?.value||'').trim().toLowerCase();let shown=0;items.forEach(item=>{const matchCategory=category==='all'||item.dataset.category===category;const matchText=(item.dataset.name||'').includes(query)||item.textContent.toLowerCase().includes(query);item.hidden=!(matchCategory&&matchText);if(!item.hidden)shown++;});if(empty)empty.hidden=shown!==0;};
  filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;filters.forEach(x=>x.classList.toggle('active',x===button));updatePlaces();}));search?.addEventListener('input',updatePlaces);

  // Accessible gallery lightbox with previous/next controls and arrow keys.
  const tiles=[...document.querySelectorAll('.gallery-tile')],modalEl=document.querySelector('#lightbox');if(tiles.length&&modalEl&&window.bootstrap){const modal=new bootstrap.Modal(modalEl),image=document.querySelector('#lightboxImage'),caption=document.querySelector('#lightboxCaption');let current=0;const show=index=>{current=(index+tiles.length)%tiles.length;image.src=tiles[current].dataset.full;image.alt=tiles[current].querySelector('img').alt;caption.textContent=tiles[current].dataset.caption;};tiles.forEach((tile,index)=>tile.addEventListener('click',()=>{show(index);modal.show();}));document.querySelector('.lightbox-arrow.prev')?.addEventListener('click',()=>show(current-1));document.querySelector('.lightbox-arrow.next')?.addEventListener('click',()=>show(current+1));modalEl.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')show(current-1);if(event.key==='ArrowRight')show(current+1);});}

  // Restrict names to letters and spaces and phone input to digits.
  const namePattern=/^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u;
  document.querySelectorAll('#book-name,#contact-name').forEach(input=>{
    input.addEventListener('beforeinput',event=>{if(event.data&&/[^\p{L}\p{M} ]/u.test(event.data))event.preventDefault();});
    input.addEventListener('input',()=>{input.value=input.value.replace(/[^\p{L}\p{M} ]/gu,'').replace(/ {2,}/g,' ');input.setCustomValidity(input.value&&!namePattern.test(input.value.trim())?'Use letters and spaces only.':'');});
    input.addEventListener('blur',()=>{input.value=input.value.trim();input.setCustomValidity(input.value&&!namePattern.test(input.value)?'Use letters and spaces only.':'');});
  });
  const phoneInput=document.querySelector('#book-phone');
  phoneInput?.addEventListener('beforeinput',event=>{if(event.data&&/[^0-9]/.test(event.data))event.preventDefault();});
  phoneInput?.addEventListener('input',()=>{phoneInput.value=phoneInput.value.replace(/[^0-9]/g,'');});
  // Switch between the trip enquiry and contact form.
  const tabs=[...document.querySelectorAll('[data-form-target]')];tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(other=>{const active=other===tab;other.classList.toggle('active',active);other.setAttribute('aria-selected',String(active));});document.querySelectorAll('.inquiry-form').forEach(form=>{form.hidden=form.id!==tab.dataset.formTarget;});}));
  document.querySelectorAll('.inquiry-form').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const fields=[...form.querySelectorAll('input,textarea,select')];let valid=true;fields.forEach(field=>{field.classList.remove('is-invalid');if(!field.checkValidity()){field.classList.add('is-invalid');valid=false;}});const status=form.querySelector('.form-status');if(!valid){status.textContent='Please check the highlighted fields and try again.';status.classList.add('error');form.querySelector(':invalid')?.focus();return;}const submission={type:form.id==='booking-form'?'trip enquiry':'contact message',submittedAt:new Date().toISOString(),fields:Object.fromEntries(new FormData(form).entries())};try{const saved=JSON.parse(localStorage.getItem('lesotho-submissions')||'[]');saved.push(submission);localStorage.setItem('lesotho-submissions',JSON.stringify(saved));status.textContent='Thanks! Your '+(form.id==='booking-form'?'trip enquiry':'message')+' has been saved in this browser.';}catch(_){status.textContent='Your details are valid, but this browser could not save them. Please note them before closing this page.';}status.classList.remove('error');form.reset();}));

  // Newsletter demo validates the address and stores an opt-in locally.
  document.querySelectorAll('[data-newsletter]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const input=form.querySelector('input[type=email]'),feedback=form.querySelector('.form-feedback');if(!input.checkValidity()){input.classList.add('is-invalid');feedback.textContent='Please enter a valid email address.';input.focus();return;}input.classList.remove('is-invalid');feedback.textContent='Thanks for joining us. Your preference is saved on this device.';try{localStorage.setItem('lesotho-newsletter',input.value.trim());}catch(_){}form.reset();}));
});


