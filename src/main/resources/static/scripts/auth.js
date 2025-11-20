fetch("/api/auth/status")
    .then(res => res.json())
    .then(data => {
        if (data.loggedIn === true) {
            document.getElementById("user-icon-container").style.display = "block";
        }
    });

function toggleUserMenu() {
    const menu = document.getElementById("user-dropdown");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}







async function loadOpeningHoursEditor() {
    const container = document.getElementById("opening-hours-editor");

    try {
        const res = await fetch("/api/opening-hours", { credentials: "include" });

        if (!res.ok) {
            container.textContent = "Kunne ikke hente åpningstider.";
            return;
        }

        const data = await res.json();
        container.innerHTML = "";

        data.forEach(entry => {
            const key = entry.day.toLowerCase();

            if (key === "notat") return;

            container.innerHTML += `
                <div style="margin-bottom: 16px;">
                    <strong>${capitalize(entry.day)}:</strong><br>
                    <input id="edit-${key}" value="${entry.hours}" style="padding: 5px; width: 200px;">
                    <button onclick="saveHours('${key}')">Lagre</button>
                </div>
            `;
        });

        const noteObj = data.find(x => x.day.toLowerCase() === "notat") || { note: "" };

        container.innerHTML += `
            <hr style="margin: 20px 0;">
            <div style="margin-bottom: 16px;">
                <strong>Notat:</strong><br>
                <textarea id="edit-note" style="width: 260px; height: 80px; padding: 5px;">${noteObj.note || ""}</textarea><br>
                <button onclick="saveNote()">Lagre notat</button>
            </div>
        `;

    } catch (err) {
        container.textContent = "Feil ved lasting av editor.";
    }
}

function capitalize(txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1);
}

async function saveHours(day) {
    const value = document.getElementById("edit-" + day).value;

    const body = {
        day: day,
        hours: value,
        note: ""
    };

    const res = await fetch("/api/opening-hours/" + day, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    alert(res.ok ? "Lagret!" : "Feil ved lagring.");
}

async function saveNote() {
    const newNote = document.getElementById("edit-note").value;

    const body = {
        day: "notat",
        hours: "",
        note: newNote
    };

    const res = await fetch("/api/opening-hours/notat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    alert(res.ok ? "Notat lagret!" : "Feil ved lagring.");
}

async function loadPriceEditor() {
    const container = document.getElementById("price-editor");

    try {
        const res = await fetch("/api/prices", { credentials: "include" });
        const prices = await res.json();

        container.innerHTML = `
            <button onclick="addPrice()">Legg til produkt</button>
            <br><br>
        `;

        prices.forEach(p => {
            container.innerHTML += `
                <div style="margin-bottom:12px;">
                    <input id="name-${p.id}" value="${p.name}" style="width:200px;">
                    <input id="price-${p.id}" value="${p.price}" style="width:120px;">
                    <button onclick="savePrice(${p.id})">Lagre</button>
                    <button onclick="deletePrice(${p.id})" style="color:red;">Slett</button>
                </div>
            `;
        });

    } catch (err) {
        container.innerHTML = "Kunne ikke hente priser.";
    }
}

async function addPrice() {
    const res = await fetch("/api/prices", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Nytt produkt", price: "0 kr" })
    });

    if (res.ok) location.reload();
}

async function savePrice(id) {
    const name = document.getElementById("name-" + id).value;
    const price = document.getElementById("price-" + id).value;

    const res = await fetch("/api/prices/" + id, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price })
    });

    if (!res.ok) alert("Kunne ikke lagre.");
}

async function deletePrice(id) {
    const res = await fetch("/api/prices/" + id, {
        method: "DELETE",
        credentials: "include"
    });

    if (res.ok) location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    loadOpeningHoursEditor();
    loadPriceEditor();
});
async function loadPrices() {
    const table = document.getElementById("price-table");

    const res = await fetch("/api/prices");
    const data = await res.json();

    table.innerHTML = "";

    data.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${p.price}</td>
            </tr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", loadPrices);
document.addEventListener("DOMContentLoaded", loadOpeningHoursEditor);