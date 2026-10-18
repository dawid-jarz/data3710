// Felles API-hjelper for skriveoperasjoner. Spring Security krever CSRF-token.
async function apiWrite(url, method, body) {
    const tokenResponse = await fetch("/api/csrf", { credentials: "same-origin", cache: "no-store" });
    if (!tokenResponse.ok) throw new Error("Kunne ikke hente sikkerhetstoken");
    const csrf = await tokenResponse.json();
    const headers = { [csrf.headerName]: csrf.token };
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const response = await fetch(url, {
        method, headers, credentials: "same-origin",
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    if (!response.ok) throw new Error(`Kunne ikke lagre (${response.status})`);
    return response;
}

function adminStatus(message) {
    const element = document.getElementById("admin-status");
    if (element) element.textContent = message;
}

function createEditorField(labelText, id, value, multiline = false) {
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    const input = document.createElement(multiline ? "textarea" : "input");
    input.id = id;
    input.value = value || "";
    if (multiline) input.rows = 4;
    wrapper.append(label, input);
    return wrapper;
}

function createEditorButton(text, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.addEventListener("click", async () => {
        button.disabled = true;
        try { await action(); }
        catch (error) { console.error(error); adminStatus(error.message); }
        finally { button.disabled = false; }
    });
    return button;
}

async function loadOpeningHoursEditor() {
    const container = document.getElementById("opening-hours-editor");
    if (!container) return;
    try {
        const res = await fetch("/api/opening-hours", { credentials: "same-origin" });
        if (!res.ok) throw new Error("Kunne ikke hente åpningstider");
        const data = await res.json();
        container.replaceChildren();

        for (const entry of data) {
            const day = String(entry.day || "").toLowerCase();
            if (day === "notat") continue;
            const row = document.createElement("div");
            row.className = "editor-row";
            row.append(createEditorField(`Åpningstid ${day}`, `hours-${day}`, entry.hours));
            row.append(createEditorButton("Lagre åpningstid", async () => {
                const hours = document.getElementById(`hours-${day}`).value.trim();
                await apiWrite(`/api/opening-hours/${encodeURIComponent(day)}`, "POST",
                    { day, hours, note: "" });
                adminStatus(`Åpningstid for ${day} er lagret.`);
            }));
            container.append(row);
        }

        const row = document.createElement("div");
        row.className = "editor-row";
        row.append(createEditorField("Notat til åpningstider", "hours-note",
            data.find(entry => String(entry.day).toLowerCase() === "notat")?.note, true));
        row.append(createEditorButton("Lagre notat", async () => {
            await apiWrite("/api/opening-hours/notat", "POST", {
                day: "notat", hours: "", note: document.getElementById("hours-note").value
            });
            adminStatus("Notatet er lagret.");
        }));
        container.append(row);
    } catch (error) {
        console.error(error);
        container.textContent = "Kunne ikke hente åpningstider.";
    }
}

async function loadPriceEditor() {
    const container = document.getElementById("price-editor");
    if (!container) return;
    try {
        const res = await fetch("/api/priser", { credentials: "same-origin" });
        if (!res.ok) throw new Error("Kunne ikke hente priser");
        const prices = await res.json();
        container.replaceChildren();

        container.append(createEditorButton("Legg til tjeneste", async () => {
            await apiWrite("/api/priser", "POST", { name: "Ny tjeneste", price: "0 kr" });
            adminStatus("Ny tjeneste lagt til.");
            await loadPriceEditor();
        }));

        for (const price of prices) {
            const row = document.createElement("div");
            row.className = "editor-row";
            row.append(createEditorField("Tjeneste", `name-${price.id}`, price.name));
            row.append(createEditorField("Pris", `price-${price.id}`, price.price));

            const actions = document.createElement("div");
            actions.className = "editor-actions";
            actions.append(createEditorButton("Lagre", async () => {
                await apiWrite(`/api/priser/${price.id}`, "PUT", {
                    name: document.getElementById(`name-${price.id}`).value,
                    price: document.getElementById(`price-${price.id}`).value
                });
                adminStatus("Prisen er lagret.");
            }));
            actions.append(createEditorButton("Slett", async () => {
                if (!confirm(`Slette tjenesten «${price.name}»?`)) return;
                await apiWrite(`/api/priser/${price.id}`, "DELETE");
                adminStatus("Tjenesten er slettet.");
                await loadPriceEditor();
            }));
            row.append(actions);
            container.append(row);
        }
    } catch (error) {
        console.error(error);
        container.textContent = "Kunne ikke hente priser.";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const userContainer = document.getElementById("user-icon-container");
    if (userContainer) {
        try {
            const res = await fetch("/api/auth/status", { credentials: "same-origin" });
            if (!res.ok) throw new Error("Ukjent innloggingsstatus");
            const data = await res.json();
            userContainer.hidden = !data.loggedIn;
        } catch (error) { console.error(error); }
    }

    document.getElementById("logout-button")?.addEventListener("click", async () => {
        try {
            await apiWrite("/logout", "POST");
            window.location.assign("/login?logout");
        } catch (error) {
            console.error(error);
            adminStatus("Kunne ikke logge ut. Prøv igjen.");
        }
    });

    loadOpeningHoursEditor();
    loadPriceEditor();
});
