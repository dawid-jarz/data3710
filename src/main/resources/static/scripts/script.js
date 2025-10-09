function bookTime(){
    window.open("https://system.easypractice.net/book/data3710", "_blank");
}

function toggleMenu() {
  const menu = document.getElementById("hamburger-overlay");
  if (menu.style.width === "100%") {
    menu.style.width = "0";
  } 
  else {
    menu.style.width = "100%";
  }
}
  document.addEventListener("DOMContentLoaded", () => {
  const home = document.querySelector(".logo-tekst");

  if (home) {
    home.addEventListener("click", () => {
      if (window.innerWidth <= 627) {
        window.location.href = "../index.html";
      }
    });
  }
});



(function () {
  const btn = document.querySelector('.contact-secondary[data-copy]');
  const toast = document.getElementById('contactToast');
  if (!btn || !toast) return;

  async function copyAddress() {
    const text = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
      showToast('E-postadresse kopiert ✅');
    } catch {
      showToast('Klarte ikke å kopiere. Prøv igjen.');
    }
  }
  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.tid);
    showToast.tid = setTimeout(() => (toast.hidden = true), 2200);
  }
  btn.addEventListener('click', copyAddress);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyAddress();
    }
  });
})();