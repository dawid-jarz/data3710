function bookTime(){
    window.open("https://system.easypractice.net/book/bekkestua-kosthold-og-livsstil", "_blank");
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

async function loadOpeningHours() {
    try {
        const res = await fetch("/api/opening-hours");

        if (!res.ok) {
            console.error("Kunne ikke hente åpningstider");
            return;
        }

        const data = await res.json();

        data.forEach(entry => {
            const id = "ot-" + entry.day.toLowerCase();
            const element = document.getElementById(id);

            if (element) {
                element.textContent = entry.hours; 
            }

            if (entry.day.toLowerCase() === "notat") {
                const noteElement = document.getElementById("ot-notat");
                if (noteElement) noteElement.textContent = entry.note;
            }
        });

    } catch (error) {
        console.error("Feil ved lasting av åpningstider:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadOpeningHours);





function formatDateTime(dateTimeString) {
    const dt = new Date(dateTimeString);

    const day = String(dt.getDate()).padStart(2, "0");
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const year = dt.getFullYear();

    const hours = String(dt.getHours()).padStart(2, "0");
    const minutes = String(dt.getMinutes()).padStart(2, "0");

    return `Lagt ut: ${day}.${month}.${year} · ${hours}:${minutes}`;
}

async function loadPosts() {
    const res = await fetch("/api/posts");
    const posts = await res.json();

    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    const container = document.getElementById("posts");
    container.innerHTML = "";

    posts.forEach(p => {
        container.innerHTML += `
            <div class="post-card">
                <h3>${p.title}</h3>
                <small>${formatDateTime(p.createdAt)}</small>
                <p>${p.content}</p>
            </div>
            <hr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", loadPosts);