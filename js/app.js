(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isSmallScreen = function () { return window.innerWidth <= 700; };

  /* ---------------- Boot screen: CRT monitor, click/key to power on ---------------- */
  (function boot() {
    var screen = document.getElementById("boot-screen");
    var monitor = document.querySelector(".crt-monitor");
    var promptEl = document.getElementById("boot-prompt");
    var textEl = document.getElementById("boot-text");
    var lines = [
      "🧙‍♀️ francheska's cauldron",
      "tossing in a pinch of curiosity",
      "a dash of strategy",
      "a spoonful of good taste",
      "",
      "loading my next brew..."
    ];

    var started = false;
    var dismissed = false;

    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      screen.classList.add("hidden");
      window.setTimeout(function () {
        screen.hidden = true;
      }, 450);
    }

    function typeLine(lineIndex) {
      if (lineIndex >= lines.length) {
        window.setTimeout(dismiss, 700);
        return;
      }
      textEl.textContent += (lineIndex > 0 ? "\n" : "") + lines[lineIndex];
      window.setTimeout(function () {
        typeLine(lineIndex + 1);
      }, 260);
    }

    function powerOn() {
      if (started) return;
      started = true;
      monitor.classList.add("powered-on");
      promptEl.hidden = true;
      textEl.hidden = false;

      if (prefersReducedMotion) {
        textEl.textContent = lines.join("\n");
        window.setTimeout(dismiss, 900);
        return;
      }
      typeLine(0);
    }

    screen.addEventListener("click", function () {
      if (!started) {
        powerOn();
      } else {
        dismiss(); // clicking again once it's running skips straight to the desktop
      }
    });
    document.addEventListener("keydown", function (e) {
      if (screen.hidden) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        if (!started) {
          powerOn();
        } else {
          dismiss();
        }
      }
    });

    // Safety net: never trap a visitor on the boot screen.
    window.setTimeout(function () {
      if (!started) powerOn();
    }, 6000);
    window.setTimeout(dismiss, 10000);
  })();

  /* ---------------- Menu bar clock ---------------- */
  (function clock() {
    var el = document.getElementById("menubar-clock");
    function tick() {
      var now = new Date();
      var h = now.getHours();
      var m = String(now.getMinutes()).padStart(2, "0");
      var ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      el.textContent = h + ":" + m + " " + ampm;
    }
    tick();
    window.setInterval(tick, 15000);
  })();

  /* ---------------- Start menu ---------------- */
  (function startMenu() {
    var btn = document.getElementById("start-button");
    var menu = document.getElementById("start-menu");

    function closeMenu() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
    function openMenu() {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.hidden) {
        openMenu();
      } else {
        closeMenu();
      }
    });
    menu.querySelectorAll("[data-open]").forEach(function (item) {
      item.addEventListener("click", closeMenu);
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) closeMenu();
    });
  })();

  /* ---------------- Window manager ---------------- */
  var windowTitles = {
    about: "About Me",
    work: "Work",
    links: "Links",
    contact: "Contact",
    fortune: "Fortune.txt",
    game: "Lox Café",
    videos: "Videos",
    "cultural-icons": "Cultural Icons",
    "tica-linda": "Tica Linda"
  };
  var windowIcons = {
    about: '<svg viewBox="0 0 32 32" width="18" height="18"><defs><linearGradient id="tb-faceGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#faf3e7"/><stop offset="100%" stop-color="#e3c6a8"/></linearGradient></defs><circle cx="16" cy="16" r="13" fill="url(#tb-faceGrad)" stroke="#3a1809" stroke-width="1.5"/><circle cx="11.5" cy="14.5" r="1.5" fill="#3a1809"/><circle cx="20.5" cy="14.5" r="1.5" fill="#3a1809"/><ellipse cx="9.5" cy="19" rx="2.4" ry="1.5" fill="#8a3e1f" opacity="0.4"/><ellipse cx="22.5" cy="19" rx="2.4" ry="1.5" fill="#8a3e1f" opacity="0.4"/><path d="M11 20.5 Q16 25 21 20.5" stroke="#3a1809" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="11" cy="9" rx="4" ry="2.2" fill="#fff" opacity="0.5"/></svg>',
    work: '<svg viewBox="0 0 32 32" width="18" height="18"><defs><linearGradient id="tb-folderBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a8531f"/><stop offset="100%" stop-color="#8a3e1f"/></linearGradient><linearGradient id="tb-folderFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eaef8e"/><stop offset="100%" stop-color="#c7cf4d"/></linearGradient></defs><rect x="3" y="7" width="14" height="7" rx="2.5" fill="url(#tb-folderBack)" stroke="#3a1809" stroke-width="1.5"/><rect x="3" y="11" width="26" height="17" rx="4" fill="url(#tb-folderFront)" stroke="#3a1809" stroke-width="1.5"/><ellipse cx="9.5" cy="16" rx="4" ry="2.2" fill="#fff" opacity="0.45"/></svg>',
    links: '<svg viewBox="0 0 32 32" width="18" height="18"><defs><linearGradient id="tb-linkGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8fd4f2"/><stop offset="100%" stop-color="#6ebfea"/></linearGradient><linearGradient id="tb-linkGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a7ba3"/><stop offset="100%" stop-color="#2a4d73"/></linearGradient></defs><rect x="4" y="13" width="14" height="10" rx="5" fill="none" stroke="url(#tb-linkGrad2)" stroke-width="3.5"/><rect x="14" y="9" width="14" height="10" rx="5" fill="none" stroke="url(#tb-linkGrad)" stroke-width="3.5"/><rect x="4" y="13" width="14" height="10" rx="5" fill="none" stroke="#3a1809" stroke-width="1.2"/><rect x="14" y="9" width="14" height="10" rx="5" fill="none" stroke="#3a1809" stroke-width="1.2"/><ellipse cx="19" cy="11.5" rx="2.6" ry="1.3" fill="#fff" opacity="0.5"/></svg>',
    contact: '<svg viewBox="0 0 32 32" width="18" height="18"><defs><linearGradient id="tb-envGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#faf3e7"/><stop offset="100%" stop-color="#e8dcc8"/></linearGradient></defs><rect x="3" y="8" width="26" height="18" rx="3.5" fill="url(#tb-envGrad)" stroke="#3a1809" stroke-width="1.5"/><path d="M4 9.5 L16 19 L28 9.5" fill="none" stroke="#2a4d73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="9.5" cy="12" rx="3.5" ry="1.8" fill="#fff" opacity="0.5"/></svg>',
    fortune: '<svg viewBox="0 0 32 32" width="18" height="18"><defs><radialGradient id="tb-ballGrad" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#bfe4f7"/><stop offset="55%" stop-color="#6ebfea"/><stop offset="100%" stop-color="#2a4d73"/></radialGradient></defs><ellipse cx="16" cy="27" rx="8" ry="2.2" fill="#8a3e1f"/><rect x="12" y="24" width="8" height="3" rx="1.2" fill="#a8531f" stroke="#3a1809" stroke-width="1"/><circle cx="16" cy="15" r="11" fill="url(#tb-ballGrad)" stroke="#3a1809" stroke-width="1.5"/><ellipse cx="11.5" cy="10" rx="3.6" ry="2" fill="#fff" opacity="0.55"/><path d="M24 6 l1 2 2 1 -2 1 -1 2 -1 -2 -2 -1 2 -1 z" fill="#dde35f"/></svg>',
    game: '<svg viewBox="0 0 32 32" width="18" height="18"><defs><linearGradient id="tb-mugGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#faf3e7"/><stop offset="100%" stop-color="#e3c6a8"/></linearGradient></defs><ellipse cx="15" cy="27" rx="11" ry="2.3" fill="#e3c6a8" stroke="#3a1809" stroke-width="1.2"/><path d="M23 13 q6 0 6 5.5 q0 5.5 -6 5.5" fill="none" stroke="#3a1809" stroke-width="2.2" stroke-linecap="round"/><rect x="6" y="11" width="18" height="14" rx="3" fill="url(#tb-mugGrad)" stroke="#3a1809" stroke-width="1.5"/><path d="M7.3 13 h15.4 q0.6 2.2 -1.1 3.4 h-13.2 q-1.7 -1.2 -1.1 -3.4 z" fill="#8a3e1f"/><path d="M11 9 q-1.5 -2 0 -4 M16 9 q-1.5 -2 0 -4" fill="none" stroke="#6ebfea" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/><ellipse cx="9.3" cy="16.5" rx="2.6" ry="1.6" fill="#fff" opacity="0.45"/></svg>',
    videos: '<svg viewBox="0 0 32 32" width="18" height="18"><defs><linearGradient id="tb-clapBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#faf3e7"/><stop offset="100%" stop-color="#e3c6a8"/></linearGradient></defs><rect x="4" y="13" width="24" height="15" rx="2.5" fill="url(#tb-clapBody)" stroke="#3a1809" stroke-width="1.5"/><g transform="rotate(-7 16 10)"><rect x="3" y="6" width="26" height="7" rx="1.5" fill="#3a1809"/><rect x="7" y="6" width="3" height="7" fill="#eaef8e"/><rect x="14" y="6" width="3" height="7" fill="#eaef8e"/><rect x="21" y="6" width="3" height="7" fill="#eaef8e"/><rect x="3" y="6" width="26" height="7" rx="1.5" fill="none" stroke="#3a1809" stroke-width="1.5"/></g><circle cx="24.5" cy="17.5" r="1.3" fill="#3a1809"/><ellipse cx="10" cy="19" rx="3" ry="1.6" fill="#fff" opacity="0.4"/></svg>',
    "cultural-icons": '<svg viewBox="0 0 32 32" width="18" height="18"><defs><linearGradient id="tb-frameGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eaef8e"/><stop offset="100%" stop-color="#c7cf4d"/></linearGradient></defs><rect x="4" y="4" width="24" height="24" rx="3" fill="url(#tb-frameGrad)" stroke="#3a1809" stroke-width="1.5"/><rect x="8" y="8" width="16" height="16" rx="1.5" fill="#faf3e7" stroke="#3a1809" stroke-width="1.2"/><circle cx="16" cy="14" r="3.2" fill="#8a3e1f"/><path d="M10 22 Q16 16 22 22 Z" fill="#8a3e1f"/></svg>',
    "tica-linda": '<svg viewBox="0 0 32 32" width="18" height="18"><defs><linearGradient id="tb-tlBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a2410"/><stop offset="100%" stop-color="#3a1809"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="10" fill="url(#tb-tlBg)" stroke="#3a1809" stroke-width="1.5"/><path d="M7 10 h8 v2.6 h-2.7 v9.4 h-2.6 v-9.4 h-2.7 z" fill="#6ebfea"/><path d="M17 10 h2.6 v9.4 h4.4 v2.6 h-7 z" fill="#6ebfea"/><path d="M24 5 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 z" fill="#faf3e7"/></svg>'
  };
  var windowStatus = {
    about: "3 paragraph(s)",
    work: "11 project(s)",
    links: "4 link(s)",
    contact: "Ready",
    fortune: "Ready",
    game: "Playable",
    videos: "1 video",
    "cultural-icons": "2 videos",
    "tica-linda": "Ready"
  };

  var layer = document.getElementById("windows-layer");
  var taskbarItems = document.getElementById("taskbar-items");
  var openWindows = {}; // id -> { el, taskbarBtn }
  var zCounter = 10;
  var cascade = 0;

  function focusWindow(id) {
    var entry = openWindows[id];
    if (!entry) return;
    if (entry.el.classList.contains("minimized")) {
      entry.el.classList.remove("minimized");
    }
    zCounter += 1;
    entry.el.style.zIndex = zCounter;
    Object.keys(openWindows).forEach(function (k) {
      openWindows[k].taskbarBtn.classList.toggle("active", k === id);
    });
    var closeBtn = entry.el.querySelector(".window-close");
    if (closeBtn) closeBtn.focus();
  }

  function minimizeWindow(id) {
    var entry = openWindows[id];
    if (!entry) return;
    entry.el.classList.add("minimized");
    entry.taskbarBtn.classList.remove("active");
  }

  function toggleMaximize(id) {
    var entry = openWindows[id];
    if (!entry) return;
    var win = entry.el;
    if (win.classList.contains("maximized")) {
      win.classList.remove("maximized");
      win.style.left = win.dataset.prevLeft || "";
      win.style.top = win.dataset.prevTop || "";
      win.style.width = win.dataset.prevWidth || "";
    } else {
      win.dataset.prevLeft = win.style.left;
      win.dataset.prevTop = win.style.top;
      win.dataset.prevWidth = win.style.width;
      win.classList.add("maximized");
      win.style.left = "";
      win.style.top = "";
      win.style.width = "";
    }
    focusWindow(id);
  }

  function closeWindow(id) {
    var entry = openWindows[id];
    if (!entry) return;
    entry.el.remove();
    entry.taskbarBtn.remove();
    delete openWindows[id];
    var iconBtn = document.querySelector('.icon[data-open="' + id + '"]');
    if (iconBtn) {
      iconBtn.classList.remove("active");
      iconBtn.focus();
    }
  }

  function makeDraggable(win, handle) {
    var startX, startY, originX, originY, dragging = false;

    handle.addEventListener("pointerdown", function (e) {
      if (isSmallScreen()) return; // full-screen on mobile, no dragging
      if (win.classList.contains("maximized")) return;
      if (e.target.closest(".window-btn")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      var rect = win.getBoundingClientRect();
      originX = rect.left;
      originY = rect.top;
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      var newX = Math.min(Math.max(originX + dx, 0), window.innerWidth - 80);
      var newY = Math.min(Math.max(originY + dy, 44), window.innerHeight - 60);
      win.style.left = newX + "px";
      win.style.top = newY + "px";
    });

    function endDrag() { dragging = false; }
    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
  }

  function openWindow(id) {
    if (openWindows[id]) {
      focusWindow(id);
      return;
    }

    var template = document.getElementById("tpl-" + id);
    if (!template) return;

    var win = document.createElement("section");
    win.className = "window";
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", windowTitles[id] || id);

    var titlebar = document.createElement("div");
    titlebar.className = "window-titlebar";

    var titleIcon = document.createElement("span");
    titleIcon.className = "window-title-icon";
    titleIcon.setAttribute("aria-hidden", "true");
    titleIcon.innerHTML = windowIcons[id] || "";

    var title = document.createElement("span");
    title.className = "window-title";
    title.textContent = windowTitles[id] || id;

    var controls = document.createElement("div");
    controls.className = "window-controls";

    var minimizeBtn = document.createElement("button");
    minimizeBtn.type = "button";
    minimizeBtn.className = "window-btn window-btn--minimize";
    minimizeBtn.setAttribute("aria-label", "Minimize " + (windowTitles[id] || id));
    minimizeBtn.textContent = "–";
    minimizeBtn.addEventListener("click", function () { minimizeWindow(id); });

    var maximizeBtn = document.createElement("button");
    maximizeBtn.type = "button";
    maximizeBtn.className = "window-btn window-btn--maximize";
    maximizeBtn.setAttribute("aria-label", "Maximize " + (windowTitles[id] || id));
    maximizeBtn.textContent = "□";
    maximizeBtn.addEventListener("click", function () { toggleMaximize(id); });

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "window-btn window-close";
    closeBtn.setAttribute("aria-label", "Close " + (windowTitles[id] || id));
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", function () { closeWindow(id); });

    controls.appendChild(minimizeBtn);
    controls.appendChild(maximizeBtn);
    controls.appendChild(closeBtn);

    titlebar.appendChild(titleIcon);
    titlebar.appendChild(title);
    titlebar.appendChild(controls);

    var body = document.createElement("div");
    body.className = "window-body";
    body.appendChild(template.content.cloneNode(true));

    var statusbar = document.createElement("div");
    statusbar.className = "window-statusbar";
    var statusLeft = document.createElement("span");
    statusLeft.textContent = windowStatus[id] || "Ready";
    var statusRight = document.createElement("span");
    statusRight.textContent = "Ready";
    statusbar.appendChild(statusLeft);
    statusbar.appendChild(statusRight);

    win.appendChild(titlebar);
    win.appendChild(body);
    win.appendChild(statusbar);

    if (!isSmallScreen()) {
      cascade = (cascade + 1) % 6;
      win.style.left = 60 + cascade * 26 + "px";
      win.style.top = 90 + cascade * 22 + "px";
    }

    layer.appendChild(win);
    makeDraggable(win, titlebar);

    var taskbarBtn = document.createElement("button");
    taskbarBtn.type = "button";
    taskbarBtn.className = "taskbar-item";
    taskbarBtn.textContent = windowTitles[id] || id;
    taskbarBtn.addEventListener("click", function () { focusWindow(id); });
    taskbarItems.appendChild(taskbarBtn);

    openWindows[id] = { el: win, taskbarBtn: taskbarBtn };

    var iconBtn = document.querySelector('.icon[data-open="' + id + '"]');
    if (iconBtn) iconBtn.classList.add("active");

    focusWindow(id);

    if (id === "fortune") setupFortune(body);
    if (id === "work") setupWorkToggle(body);
  }

  document.querySelectorAll("[data-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openWindow(btn.getAttribute("data-open"));
    });
  });

  // Escape closes the lightbox if open, otherwise the topmost window.
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!lightbox.hidden) { closeLightbox(); return; }
    var topId = null, topZ = -1;
    Object.keys(openWindows).forEach(function (k) {
      var z = parseInt(openWindows[k].el.style.zIndex || "0", 10);
      if (z > topZ) { topZ = z; topId = k; }
    });
    if (topId) closeWindow(topId);
  });

  // Bring a window to front when clicked anywhere inside it.
  layer.addEventListener("pointerdown", function (e) {
    var winEl = e.target.closest(".window");
    if (!winEl) return;
    Object.keys(openWindows).forEach(function (k) {
      if (openWindows[k].el === winEl) focusWindow(k);
    });
  });

  /* ---------------- Lightbox (shared by any [data-lightbox-src] trigger) ---------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCloseBtn = document.getElementById("lightbox-close");
  var lightboxBackdrop = document.getElementById("lightbox-backdrop");
  var lightboxLastFocus = null;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    lightboxLastFocus = document.activeElement;
    lightboxCloseBtn.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    if (lightboxLastFocus) lightboxLastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-lightbox-src]");
    if (trigger) {
      openLightbox(trigger.getAttribute("data-lightbox-src"), trigger.getAttribute("data-lightbox-alt"));
    }
  });
  lightboxCloseBtn.addEventListener("click", closeLightbox);
  lightboxBackdrop.addEventListener("click", closeLightbox);

  /* ---------------- Fortune easter egg ---------------- */
  var fortunes = [
    "A good font pairing will get you further than a good excuse.",
    "The desktop is a metaphor. So is everything else, honestly.",
    "You will soon replace a placeholder with something real.",
    "Ctrl+Z works on code, not on decisions. Choose wisely.",
    "Somewhere, a CRT monitor misses you.",
    "Today's forecast: warm colors, low contrast, high charm."
  ];
  function setupFortune(scope) {
    var line = scope.querySelector("#fortune-line");
    var btn = scope.querySelector("#fortune-btn");
    btn.addEventListener("click", function () {
      var next = fortunes[Math.floor(Math.random() * fortunes.length)];
      line.textContent = next;
    });
  }

  /* ---------------- Work: Featured / Matrix toggle + case study detail ---------------- */
  function setupWorkToggle(scope) {
    var toggleRow = scope.querySelector(".view-toggle");
    var buttons = scope.querySelectorAll(".view-toggle-btn");
    var panels = scope.querySelectorAll(".work-view");

    function showPanel(target) {
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-view-panel") !== target;
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-view");
        buttons.forEach(function (b) {
          var isActive = b === btn;
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        toggleRow.hidden = false;
        showPanel(target);
      });
    });

    var detailTag = scope.querySelector("#work-detail-tag");
    var detailTitle = scope.querySelector("#work-detail-title");
    var detailBody = scope.querySelector("#work-detail-body");
    var detailTools = scope.querySelector("#work-detail-tools");
    var detailEmbed = scope.querySelector("#work-detail-embed");
    var detailMiniBrowser = scope.querySelector("#work-detail-mini-browser");
    var backBtn = scope.querySelector(".work-back");

    function openCard(card) {
      detailTag.textContent = card.querySelector(".work-tag").textContent;
      detailTitle.textContent = card.querySelector("h3").textContent;
      detailBody.innerHTML = card.querySelector(".work-full").innerHTML;
      detailTools.innerHTML = card.querySelector(".work-tools-full").innerHTML;
      var embedSource = card.querySelector(".work-embed");
      if (embedSource) {
        detailEmbed.innerHTML = embedSource.innerHTML;
        detailMiniBrowser.hidden = false;
      } else {
        detailEmbed.innerHTML = "";
        detailMiniBrowser.hidden = true;
      }
      toggleRow.hidden = true;
      showPanel("detail");
    }

    var cardsByProject = {};
    scope.querySelectorAll(".work-card").forEach(function (card) {
      cardsByProject[card.getAttribute("data-project")] = card;
      card.addEventListener("click", function () {
        openCard(card);
      });
    });

    scope.querySelectorAll(".matrix-chip[data-project]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var card = cardsByProject[chip.getAttribute("data-project")];
        if (card) openCard(card);
      });
    });

    if (backBtn) {
      backBtn.addEventListener("click", function () {
        toggleRow.hidden = false;
        buttons.forEach(function (b) {
          var isActive = b.getAttribute("data-view") === "featured";
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        showPanel("featured");
      });
    }
  }
})();
