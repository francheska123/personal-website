document.addEventListener("DOMContentLoaded", () => {

    // ── Typing effect ──
    const headline = document.querySelector(".hero-headline");
    if (headline) {
        const parts = [
            { text: "I help robotics and tech companies go from ", em: false },
            { text: "technical spec", em: true },
            { text: " to ", em: false },
            { text: "human story", em: true },
        ];

        headline.innerHTML = '<span class="cursor"></span>';
        const cursor = headline.querySelector(".cursor");
        let partIndex = 0;
        let charIndex = 0;
        const speed = 38;

        function type() {
            if (partIndex >= parts.length) return;
            const part = parts[partIndex];
            const span = document.createElement("span");
            if (part.em) span.style.cssText = "font-style:italic; color:var(--pink)";
            span.textContent = part.text[charIndex];
            headline.insertBefore(span, cursor);
            charIndex++;
            if (charIndex >= part.text.length) { partIndex++; charIndex = 0; }
            setTimeout(type, speed);
        }

        setTimeout(type, 600);
    }

    // ── Mobile menu ──
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle && navLinks) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.addEventListener("click", () => {
            const isActive = navLinks.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(isActive));
        });
        navLinks.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ── Gallery carousel ──
    const track = document.querySelector(".gallery-track");
    const prevBtn = document.querySelector(".gallery-btn.prev");
    const nextBtn = document.querySelector(".gallery-btn.next");
    if (track && prevBtn && nextBtn) {
        nextBtn.addEventListener("click", () => track.scrollBy({ left: 310, behavior: "smooth" }));
        prevBtn.addEventListener("click", () => track.scrollBy({ left: -310, behavior: "smooth" }));
    }

});