document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("terms-toggle");
  const panel = document.getElementById("terms-panel");

  if (!toggle || !panel) {
    console.warn("Technical terms toggle unavailable: #terms-toggle or #terms-panel was not found.");
    return;
  }

  toggle.addEventListener("click", () => {
    const isHidden = panel.classList.toggle("hidden");
    toggle.setAttribute("aria-expanded", String(!isHidden));
  });
});
