function bookTime() {
    window.open("https://system.easypractice.net/book/bekkestua-kosthold-og-livsstil", "_blank", "noopener,noreferrer");
}

function toggleMenu(forceClose = false) {
    const menu = document.getElementById("hamburger-overlay");
    const trigger = document.getElementById("button-burger");
    if (!menu || !trigger) return;

    const opening = !forceClose && menu.hidden;
    menu.hidden = !opening;
    trigger.setAttribute("aria-expanded", String(opening));
    trigger.setAttribute("aria-label", opening ? "Lukk meny" : "Åpne meny");

    if (opening) menu.querySelector("a, button")?.focus();
    else if (forceClose) trigger.focus();
}

function setupNavigation() {
    const trigger = document.getElementById("button-burger");
    const menu = document.getElementById("hamburger-overlay");
    trigger?.addEventListener("click", () => toggleMenu());
    menu?.querySelector(".closebtn")?.addEventListener("click", () => toggleMenu(true));

    document.addEventListener("keydown", event => {
        if (!menu || menu.hidden) return;
        if (event.key === "Escape") {
            event.preventDefault();
            toggleMenu(true);
        } else if (event.key === "Tab") {
            const focusable = [...menu.querySelectorAll("a, button")];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!first || !last) return;
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}

async function loadOpeningHours() {
    if (!document.querySelector('[id^="ot-"]')) return;
    try {
        const res = await fetch("/api/opening-hours");
        if (!res.ok) throw new Error("Kunne ikke hente åpningstider");
        const data = await res.json();
        data.forEach(entry => {
            const day = String(entry.day || "").toLowerCase();
            const element = document.getElementById("ot-" + day);
            if (element) element.textContent = entry.hours || "Ikke oppgitt";
            if (day === "notat") {
                const note = document.getElementById("ot-notat");
                if (note) note.textContent = entry.note || "";
            }
        });
    } catch (error) {
        console.error(error);
        document.querySelectorAll('[id^="ot-"]').forEach(element => {
            if (element.id !== "ot-notat") element.textContent = "Ikke tilgjengelig";
        });
    }
}

function formatDateTime(dateTimeString) {
    const dt = new Date(dateTimeString);
    if (Number.isNaN(dt.getTime())) return "Publiseringsdato ukjent";
    return `Lagt ut: ${new Intl.DateTimeFormat("nb-NO", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    }).format(dt)}`;
}

async function loadPosts() {
    const container = document.getElementById("posts");
    if (!container) return;
    try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Kunne ikke hente artiklene");
        const posts = await res.json();
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        container.replaceChildren();

        if (posts.length === 0) {
            const message = document.createElement("p");
            message.className = "aktuelt-status";
            message.textContent = "Det er ingen publiserte artikler ennå.";
            container.append(message);
            return;
        }

        posts.forEach(post => {
            const article = document.createElement("article");
            article.className = "post-card";
            const title = document.createElement("h2");
            title.textContent = post.title || "Uten tittel";
            const date = document.createElement("p");
            date.className = "post-card-date";
            date.textContent = formatDateTime(post.createdAt);
            const content = document.createElement("p");
            content.className = "post-card-content";
            content.textContent = post.content || "";
            article.append(title, date, content);
            container.append(article);
        });
    } catch (error) {
        console.error(error);
        const message = document.createElement("p");
        message.className = "aktuelt-status";
        message.textContent = "Kunne ikke laste artiklene. Prøv igjen senere.";
        container.replaceChildren(message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    loadOpeningHours();
    loadPosts();
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".copyright-year").forEach(element => {
        element.textContent = new Date().getFullYear();
    });
});