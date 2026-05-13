document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main > .section");

  sections.forEach((section, index) => {
    const heading = section.querySelector("h2");
    if (!heading) return;

    const panel = document.createElement("div");
    panel.className = "accordion-panel";
    panel.id = `${heading.id || `section-${index}`}-panel`;

    let current = heading.nextElementSibling;
    while (current) {
      const next = current.nextElementSibling;
      panel.appendChild(current);
      current = next;
    }

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "accordion-trigger";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", panel.id);
    trigger.innerHTML = `<span>${heading.textContent}</span><span class="accordion-icon" aria-hidden="true">+</span>`;

    heading.textContent = "";
    heading.appendChild(trigger);
    section.appendChild(panel);

    trigger.addEventListener("click", () => {
      const isOpen = section.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      trigger.querySelector(".accordion-icon").textContent = isOpen ? "-" : "+";
    });
  });

  const openFromHash = () => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;

    const section = target.closest(".section");
    if (!section) return;

    const trigger = section.querySelector(".accordion-trigger");
    if (!trigger || section.classList.contains("is-open")) return;

    section.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    trigger.querySelector(".accordion-icon").textContent = "-";
  };

  openFromHash();
  window.addEventListener("hashchange", openFromHash);
});
