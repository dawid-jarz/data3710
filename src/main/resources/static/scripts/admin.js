
async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options
  });
  return res;
}

document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initApningstider();
  initPriser();
  initInnleggVisning();
  initInnleggSkjema();
});






/* Innlogging*/
function initLogin() {
  const form = document.getElementById('login-form');
  const adminSection = document.getElementById('admin-section');
  const loginMessage = document.getElementById('login-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      brukernavn: form.brukernavn.value,
      passord: form.passord.value
    };

    try {
      const res = await jsonFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      if (res.ok) {
        form.classList.add('hidden');
        if (adminSection) adminSection.classList.remove('hidden');
        if (loginMessage) loginMessage.textContent = '';
      } else {
        const text = await res.text();
        if (loginMessage) loginMessage.textContent = text || 'Innlogging feilet.';
      }
    } catch (err) {
      if (loginMessage) loginMessage.textContent = 'Noe gikk galt. Prøv igjen.';
    }
  });
}







/* Åpningstider */
async function hentApningstider() {
  try {
    const res = await fetch('/api/åpningstider', { credentials: 'include' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function initApningstider() {
  const listEl = document.getElementById('åpningstider-liste'); 
  const statusEl = document.getElementById('apningstider-status');
  const form = document.getElementById('apningstider-skjema');

  const data = await hentApningstider();
  if (!data) return;

  
  if (form) {
    form.mandag.value = data.mandag || '';
    form.tirsdag.value = data.tirsdag || '';
    form.onsdag.value = data.onsdag || '';
    form.torsdag.value = data.torsdag || '';
    form.fredag.value = data.fredag || '';
    form.notat.value = data.notat || '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const ny = {
        mandag: form.mandag.value,
        tirsdag: form.tirsdag.value,
        onsdag: form.onsdag.value,
        torsdag: form.torsdag.value,
        fredag: form.fredag.value,
        notat: form.notat.value
      };

      try {
        const res = await jsonFetch('/api/åpningstider', {
          method: 'PUT',
          body: JSON.stringify(ny)
        });
        if (res.ok) {
          if (statusEl) statusEl.textContent = 'Åpningstider lagret.';
        } else if (statusEl) {
          statusEl.textContent = 'Du må være innlogget for å lagre.';
        }
      } catch {
        if (statusEl) statusEl.textContent = 'Noe gikk galt ved lagring.';
      }
    });
  }

  
  if (listEl) {
    listEl.innerHTML = '';
    const dager = [
      ['Mandag', data.mandag],
      ['Tirsdag', data.tirsdag],
      ['Onsdag', data.onsdag],
      ['Torsdag', data.torsdag],
      ['Fredag', data.fredag]
    ];
    dager.forEach(([dag, verdi]) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${dag}:</strong> ${verdi || ''}`;
      listEl.appendChild(li);
    });
    if (data.notat) {
      const li = document.createElement('li');
      li.textContent = data.notat;
      listEl.appendChild(li);
    }
  }
}





/* Priser */
async function hentPriser() {
  try {
    const res = await fetch('/api/priser', { credentials: 'include' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function initPriser() {
  const visTbody = document.getElementById('pris-liste');       
  const adminTbody = document.getElementById('admin-pris-liste');
  const form = document.getElementById('priser-skjema');
  const statusEl = document.getElementById('priser-status');

  const priser = await hentPriser();
  if (!priser || priser.length === 0) return;

  
  if (visTbody) {
    visTbody.innerHTML = '';
    priser.forEach(p => {
      const tr = document.createElement('tr');
      if (p.erUnderMeny) tr.classList.add('underoverskrift-prisliste');
      tr.innerHTML = `
        <td>${p.navn}</td>
        <td>${p.pris || ''}</td>
      `;
      visTbody.appendChild(tr);
    });
  }

  
  if (adminTbody && form) {
    adminTbody.innerHTML = '';
    priser.forEach((p, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <input type="text" name="navn-${index}" value="${p.navn || ''}">
          <input type="hidden" name="id-${index}" value="${p.id}">
        </td>
        <td>
          <input type="text" name="pris-${index}" value="${p.pris || ''}">
        </td>
        <td style="text-align:center;">
          <input type="checkbox" name="under-${index}" ${p.erUnderMeny ? 'checked' : ''}>
        </td>
      `;
      adminTbody.appendChild(tr);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nyePriser = priser.map((p, index) => ({
        id: Number(form[`id-${index}`].value),
        navn: form[`navn-${index}`].value,
        pris: form[`pris-${index}`].value,
        erUnderMeny: form[`under-${index}`].checked
      }));

      try {
        const res = await jsonFetch('/api/priser', {
          method: 'POST',
          body: JSON.stringify(nyePriser)
        });
        if (res.ok) {
          if (statusEl) statusEl.textContent = 'Priser lagret.';
        } else if (statusEl) {
          statusEl.textContent = 'Du må være innlogget for å lagre.';
        }
      } catch {
        if (statusEl) statusEl.textContent = 'Noe gikk galt ved lagring.';
      }
    });
  }
}






/* Innlegg */
async function hentInnlegg() {
  try {
    const res = await fetch('/api/innlegg', { credentials: 'include' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function initInnleggVisning() {
  const container = document.getElementById('innlegg-liste'); 
  if (!container) return;

  const innlegg = await hentInnlegg();
  container.innerHTML = '';

  if (innlegg.length === 0) {
    container.innerHTML = '<p>Ingen innlegg publisert ennå.</p>';
    return;
  }

  innlegg
    .sort((a, b) => new Date(b.postTidspunkt) - new Date(a.postTidspunkt))
    .forEach(i => {
      const article = document.createElement('article');
      const dato = i.postTidspunkt ? new Date(i.postTidspunkt) : null;
      article.classList.add('innlegg');
      article.innerHTML = `
         <h3>${i.navn}</h3>
  ${dato ? `<p><small>Publisert ${dato.toLocaleDateString('no-NO')} kl. ${dato.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}</small></p>` : ''}

  ${i.bildeUrl ? `<img src="${i.bildeUrl}" alt="Innleggsbilde">` : ''}

  <p>${i.innhold}</p>
      `;
      container.appendChild(article);
    });
}

function initInnleggSkjema() {
  const form = document.getElementById('innlegg-skjema'); 
  const statusEl = document.getElementById('innlegg-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("navn", form['innlegg-navn'].value);
    data.append("innhold", form['innlegg-innhold'].value);

    const filInput = form['innlegg-bilde'];
    if (filInput.files.length > 0) {
      data.append("fil", filInput.files[0]);
    }

    try {
      const res = await fetch('/api/innlegg', {
        method: 'POST',
        credentials: 'include',
        body: data
      });

      if (res.ok) {
        statusEl.textContent = 'Innlegg publisert.';
        form.reset();
      } else {
        statusEl.textContent = 'Du må være innlogget for å publisere.';
      }

    } catch {
      statusEl.textContent = 'Noe gikk galt ved innsending.';
    }
  });
}

