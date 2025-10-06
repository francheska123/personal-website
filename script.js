<script>
document.addEventListener("DOMContentLoaded", () => {
  // --- DEBUG: show what's present (remove in production) ---
  console.log("DOM loaded");
  console.log("project-square count:", document.querySelectorAll(".project-square").length);
  console.log("gallery-item count:", document.querySelectorAll(".gallery-item").length);
  console.log("menu-toggle:", !!document.querySelector(".menu-toggle"));
  console.log("nav-links:", !!document.querySelector(".nav-links"));

  // --- Make project squares clickable (use data-link attribute) ---
  // If you actually use .gallery-item in HTML, change the selector accordingly.
  const projectSelector = ".project-square"; // change to ".gallery-item" if that's what you use
  const projects = document.querySelectorAll(projectSelector);
  projects.forEach(square => {
    square.style.cursor = "pointer";
    square.addEventListener("click", () => {
      const link = square.dataset.link || square.getAttribute("data-link");
      if (link) {
        window.location.href = link;
      } else {
        console.warn("No data-link found on", square);
      }
    });
  });

  // --- Mobile menu toggle (safe guards) ---
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    // accessibility
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isActive = navLinks.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isActive));
    });

    // close menu when a nav link is clicked (mobile)
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    // close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  } else {
    // don't throw if elements aren't present
    if (!menuToggle) console.info("menuToggle not found (ok if not on this page)");
    if (!navLinks) console.info("navLinks not found (ok if not on this page)");
  }
});
</script>
