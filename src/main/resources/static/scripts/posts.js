function formatDate(dateString) {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} · ${hours}:${minutes}`;
}

async function loadPostsAdmin() {
    const container = document.getElementById("posts-admin");
    const res = await fetch("/api/posts");
    const posts = await res.json();

    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    container.innerHTML = `
        <h3>Publiser nytt innlegg</h3>
        <input id="new-title" placeholder="Tittel"><br><br>
        <textarea id="new-content" placeholder="Innhold" style="width:300px;height:100px;"></textarea><br><br>
        <button onclick="createPost()">Publiser</button>
        <hr>
    `;


    posts.forEach(p => {
        container.innerHTML += `
            <div style="margin-bottom:20px;">
                <strong>${p.title}</strong> — ${formatDate(p.createdAt)}<br>
                <textarea id="edit-content-${p.id}" style="width:300px;height:100px;">${p.content}</textarea><br>
                <input id="edit-title-${p.id}" value="${p.title}"><br><br>
                <button onclick="updatePost(${p.id})">Oppdater</button>
                <button onclick="deletePost(${p.id})" style="color:red;">Slett</button>
            </div>
            <hr>
        `;
    });
}

async function createPost() {
    const body = {
        title: document.getElementById("new-title").value,
        content: document.getElementById("new-content").value
    };

    await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
    });

    loadPostsAdmin();
}

async function updatePost(id) {
    const body = {
        title: document.getElementById("edit-title-" + id).value,
        content: document.getElementById("edit-content-" + id).value
    };

    await fetch("/api/posts/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
    });

    loadPostsAdmin();
}

async function deletePost(id) {
    await fetch("/api/posts/" + id, {
        method: "DELETE",
        credentials: "include"
    });

    loadPostsAdmin();
}
