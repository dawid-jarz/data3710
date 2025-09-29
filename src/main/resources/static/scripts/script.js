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