(async function(){
  try{ const r=await fetch('/api/me'); if(!r.ok) return; const me=await r.json();
    if(me.authenticated){ const menu=document.getElementById('userMenu'); if(menu) menu.style.display='inline-block';
      const btn=document.getElementById('userBtn'); const dd=document.getElementById('dropdown');
      if(btn&&dd){ btn.addEventListener('click',()=>{ dd.style.display = dd.style.display==='none'?'block':'none'; });
        document.addEventListener('click',(e)=>{ if(!btn.contains(e.target)&&!dd.contains(e.target)) dd.style.display='none'; }); } }
  }catch(e){} })();