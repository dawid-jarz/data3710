// Check login status
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
