async function loadPostsAdmin() {
    const container = document.getElementById("posts-admin");
    if (!container) return;

    try {
        const res = await fetch("/api/posts", { credentials: "same-origin" });
        if (!res.ok) throw new Error("Kunne ikke hente innlegg");
        const posts = await res.json();
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        container.replaceChildren();

        const newPost = document.createElement("section");
        newPost.className = "editor-row";
        const heading = document.createElement("h3");
        heading.textContent = "Publiser nytt innlegg";
        newPost.append(heading);
        newPost.append(createEditorField("Overskrift", "new-post-title", ""));
        newPost.append(createEditorField("Innhold", "new-post-content", "", true));
        newPost.append(createEditorButton("Publiser", async () => {
            const title = document.getElementById("new-post-title").value.trim();
            const content = document.getElementById("new-post-content").value.trim();
            if (!title || !content) {
                adminStatus("Fyll ut både overskrift og innhold.");
                return;
            }
            await apiWrite("/api/posts", "POST", { title, content });
            adminStatus("Innlegget er publisert.");
            await loadPostsAdmin();
        }));
        container.append(newPost);

        for (const post of posts) {
            const row = document.createElement("section");
            row.className = "editor-row";
            const title = document.createElement("h3");
            title.textContent = `${post.title} – ${formatDateTime(post.createdAt)}`;
            row.append(title);
            row.append(createEditorField("Overskrift", `post-title-${post.id}`, post.title));
            row.append(createEditorField("Innhold", `post-content-${post.id}`, post.content, true));

            const actions = document.createElement("div");
            actions.className = "editor-actions";
            actions.append(createEditorButton("Oppdater", async () => {
                const updatedTitle = document.getElementById(`post-title-${post.id}`).value.trim();
                const updatedContent = document.getElementById(`post-content-${post.id}`).value.trim();
                if (!updatedTitle || !updatedContent) {
                    adminStatus("Overskrift og innhold kan ikke være tomme.");
                    return;
                }
                await apiWrite(`/api/posts/${post.id}`, "PUT", {
                    title: updatedTitle, content: updatedContent
                });
                adminStatus("Innlegget er oppdatert.");
                await loadPostsAdmin();
            }));
            actions.append(createEditorButton("Slett", async () => {
                if (!confirm(`Vil du slette innlegget «${post.title}»?`)) return;
                await apiWrite(`/api/posts/${post.id}`, "DELETE");
                adminStatus("Innlegget er slettet.");
                await loadPostsAdmin();
            }));
            row.append(actions);
            container.append(row);
        }
    } catch (error) {
        console.error(error);
        container.textContent = "Kunne ikke laste innlegg for redigering.";
    }
}

document.addEventListener("DOMContentLoaded", loadPostsAdmin);
