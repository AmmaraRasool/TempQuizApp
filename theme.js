// ======================= Theme Handling =======================
const toggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved theme or default to dark
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

if (toggle) {
  toggle.addEventListener("click", () => {
    const current = body.classList.contains("dark-mode") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

function applyTheme(mode) {
  if (mode === "dark") {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    if (toggle) toggle.textContent = "☀️ Light Mode";
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    if (toggle) toggle.textContent = "🌙 Dark Mode";
  }
}
