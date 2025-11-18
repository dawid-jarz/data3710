function bookTime(){
    window.open("https://system.easypractice.net/book/bekkestua-kosthold-og-livsstil#choose-service", "_blank");
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



async function hentApningstider() {
    try {
        const res = await fetch('/api/åpningstider');
        if (!res.ok) return;
        const data = await res.json();

        const dager = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag"];

        dager.forEach(dag => {
            const el = document.getElementById(`ot-${dag}`);
            if (el) el.textContent = data[dag] || "";
        });

        const notatEl = document.getElementById("ot-notat");
        if (notatEl) notatEl.textContent = data.notat || "";

    } catch (e) {
        console.error("Klarte ikke hente åpningstider", e);
    }
}

document.addEventListener("DOMContentLoaded", hentApningstider);
