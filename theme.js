// ======================= Theme Toggle Handling  =======================


// Get theme toggle button
const themeToggle = document.getElementById("themeToggle");

// Apply saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Update toggle button text
  if (themeToggle) {
    themeToggle.textContent = savedTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
});

// Handle theme toggle click
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    let currentTheme = document.documentElement.getAttribute("data-theme");

    // Switch theme
    let newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);

    // Save user preference
    localStorage.setItem("theme", newTheme);

    // Update button text
    themeToggle.textContent = newTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
}
