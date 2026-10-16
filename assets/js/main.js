/**
 * main.js
 * Eaglenest Academy – Global interactive behaviour.
 *
 * Features:
 *   1. Mobile menu toggle (hamburger ↔ close)
 *   2. Scroll-reveal via IntersectionObserver
 *   3. Animated stat counters
 *   4. Accordion (FAQ / collapsible sections)
 *   5. Back-to-top button
 *   6. Navbar shadow on scroll
 *
 * Depends on:
 *   - components.js  (must run first so #site-header / mobile-menu exist)
 *   - custom.css     (provides .reveal, .active-link, #back-to-top, etc.)
 *
 * No external dependencies – plain vanilla JS (ES2020).
 */

/* ═══════════════════════════════════════════════════════════════════════════
   WAIT FOR DOM
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initScrollReveal();
  initStatCounters();
  initAccordions();
  initBackToTop();
  initNavbarScroll();
});

/* ═══════════════════════════════════════════════════════════════════════════
   1. MOBILE MENU TOGGLE
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Wires up the hamburger button, close button, and backdrop to
 * open / close the #mobile-menu drawer injected by components.js.
 *
 * Accessibility:
 *   - Sets aria-expanded on the hamburger button.
 *   - Traps body scroll while drawer is open.
 *   - Closes on Escape key.
 */
function initMobileMenu() {
  const hamburgerBtn    = document.getElementById("hamburger-btn");
  const mobileMenu      = document.getElementById("mobile-menu");
  const closeBtn        = document.getElementById("mobile-menu-close");
  const backdrop        = document.getElementById("mobile-menu-backdrop");

  // Guard: components might not have been injected yet (e.g. 404 page)
  if (!hamburgerBtn || !mobileMenu) return;

  /** Open the drawer */
  function openMenu() {
    mobileMenu.classList.remove("hidden");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // prevent background scroll

    // Animate hamburger bars → X
    const bars = hamburgerBtn.querySelectorAll(".hamburger-bar");
    if (bars.length === 3) {
      bars[0].style.transform = "translateY(8px) rotate(45deg)";
      bars[1].style.opacity   = "0";
      bars[2].style.transform = "translateY(-8px) rotate(-45deg)";
    }
  }

  /** Close the drawer */
  function closeMenu() {
    mobileMenu.classList.add("hidden");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = ""; // restore scroll

    // Reset hamburger bars
    const bars = hamburgerBtn.querySelectorAll(".hamburger-bar");
    if (bars.length === 3) {
      bars[0].style.transform = "";
      bars[1].style.opacity   = "1";
      bars[2].style.transform = "";
    }
  }

  hamburgerBtn.addEventListener("click", openMenu);
  if (closeBtn)   closeBtn.addEventListener("click",   closeMenu);
  if (backdrop)   backdrop.addEventListener("click",   closeMenu);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
      closeMenu();
      hamburgerBtn.focus(); // return focus to trigger
    }
  });

  // Close if viewport widens past the lg breakpoint (1024 px)
  const mediaQuery = window.matchMedia("(min-width: 1024px)");
  mediaQuery.addEventListener("change", (e) => {
    if (e.matches) closeMenu();
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. SCROLL-REVEAL  (IntersectionObserver)
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Observes every element with a .reveal / .reveal-left / .reveal-right /
 * .reveal-scale class and adds .revealed once it enters the viewport.
 *
 * Stagger siblings:  Add data-delay-step="150" (ms) to a parent element
 * and children with .reveal will receive increasing transition-delays
 * automatically.
 *
 * Usage in HTML:
 *   <div class="reveal">...</div>
 *   <div class="reveal reveal-left" data-delay="200">...</div>
 *
 *   <!-- Stagger group -->
 *   <div data-delay-step="100">
 *     <div class="reveal">Card 1</div>
 *     <div class="reveal">Card 2</div>
 *     <div class="reveal">Card 3</div>
 *   </div>
 */
function initScrollReveal() {
  // Respect user's reduced-motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // Make everything immediately visible – skip animations
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
      .forEach((el) => el.classList.add("revealed"));
    return;
  }

  /* Apply stagger delays to children inside [data-delay-step] parents */
  document.querySelectorAll("[data-delay-step]").forEach((parent) => {
    const step = parseInt(parent.dataset.delayStep, 10) || 100;
    const children = parent.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    children.forEach((child, i) => {
      child.style.setProperty("--delay", `${i * step}ms`);
      child.style.transitionDelay = `${i * step}ms`;
    });
  });

  /* Apply explicit data-delay attributes */
  document.querySelectorAll("[data-delay]").forEach((el) => {
    const delay = el.dataset.delay;
    if (delay) el.style.transitionDelay = `${delay}ms`;
  });

  const revealSelector = ".reveal, .reveal-left, .reveal-right, .reveal-scale";

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target); // animate once only
        }
      });
    },
    {
      threshold: 0.12,  // trigger when 12% of element is visible
      rootMargin: "0px 0px -40px 0px", // slightly before bottom edge
    }
  );

  document.querySelectorAll(revealSelector).forEach((el) => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. ANIMATED STAT COUNTERS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Animates numeric values inside elements with [data-counter].
 *
 * Usage in HTML:
 *   <span data-counter data-target="1200" data-duration="2000">0</span>
 *   <span data-counter data-target="98"   data-suffix="%">0</span>
 *   <span data-counter data-target="25"   data-prefix="+" data-suffix=" yrs">0</span>
 *
 * Attributes:
 *   data-target    – final numeric value (required)
 *   data-duration  – animation length in ms (default: 2000)
 *   data-prefix    – string prepended to the number (optional)
 *   data-suffix    – string appended to the number (optional)
 *   data-separator – add "true" to format 1000 → 1,000 (optional)
 */
function initStatCounters() {
  const counterEls = document.querySelectorAll("[data-counter]");
  if (!counterEls.length) return;

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        animateCounter(entry.target, prefersReducedMotion);
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach((el) => observer.observe(el));
}

/**
 * Runs the counting animation for a single element.
 * @param {HTMLElement} el
 * @param {boolean} instant  – skip animation (reduced motion)
 */
function animateCounter(el, instant) {
  const target    = parseFloat(el.dataset.target)  || 0;
  const duration  = parseInt(el.dataset.duration, 10) || 2000;
  const prefix    = el.dataset.prefix    || "";
  const suffix    = el.dataset.suffix    || "";
  const separator = el.dataset.separator === "true";
  const decimals  = (String(target).split(".")[1] || "").length; // preserve decimals

  if (instant) {
    el.textContent = formatNumber(target, decimals, separator, prefix, suffix);
    return;
  }

  const startTime = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current  = easeOutQuart(progress) * target;

    el.textContent = formatNumber(current, decimals, separator, prefix, suffix);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Ensure final value is exact
      el.textContent = formatNumber(target, decimals, separator, prefix, suffix);
    }
  }

  requestAnimationFrame(step);
}

/**
 * Formats a number for display inside a counter element.
 * @param {number} value
 * @param {number} decimals
 * @param {boolean} separator
 * @param {string} prefix
 * @param {string} suffix
 * @returns {string}
 */
function formatNumber(value, decimals, separator, prefix, suffix) {
  let str = value.toFixed(decimals);
  if (separator) {
    const parts = str.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    str = parts.join(".");
  }
  return `${prefix}${str}${suffix}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. ACCORDION
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Adds click handling to accordion items.
 *
 * Markup pattern expected (e.g. for FAQ):
 *
 *   <div class="accordion-group">
 *
 *     <div class="accordion-item">
 *       <button class="accordion-trigger" aria-expanded="false" aria-controls="faq-1">
 *         Question text
 *       </button>
 *       <div class="accordion-panel" id="faq-1" hidden>
 *         Answer text
 *       </div>
 *     </div>
 *
 *     <div class="accordion-item">
 *       <button class="accordion-trigger" aria-expanded="false" aria-controls="faq-2">
 *         Another question
 *       </button>
 *       <div class="accordion-panel" id="faq-2" hidden>
 *         Another answer
 *       </div>
 *     </div>
 *
 *   </div>
 *
 * Add data-accordion-single="true" to .accordion-group to auto-close
 * other items when one is opened (single-open mode).
 */
function initAccordions() {
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      const panelId    = trigger.getAttribute("aria-controls");
      const panel      = panelId ? document.getElementById(panelId) : null;
      const group      = trigger.closest(".accordion-group");

      // Single-open mode: close all siblings first
      if (group && group.dataset.accordionSingle === "true" && !isExpanded) {
        group.querySelectorAll(".accordion-trigger").forEach((sibling) => {
          if (sibling !== trigger) {
            sibling.setAttribute("aria-expanded", "false");
            const sibPanelId = sibling.getAttribute("aria-controls");
            const sibPanel   = sibPanelId ? document.getElementById(sibPanelId) : null;
            if (sibPanel) {
              sibPanel.hidden = true;
              sibPanel.style.maxHeight = "0";
            }
            // Rotate icon back
            toggleAccordionIcon(sibling, false);
          }
        });
      }

      // Toggle current item
      const nowExpanded = !isExpanded;
      trigger.setAttribute("aria-expanded", String(nowExpanded));

      if (panel) {
        if (nowExpanded) {
          panel.hidden = false;
          // Use max-height animation for smooth open/close
          panel.style.maxHeight = panel.scrollHeight + "px";
          panel.style.overflow  = "hidden";
          panel.style.transition = "max-height 0.35s ease";
        } else {
          panel.style.maxHeight = "0";
          panel.style.overflow  = "hidden";
          panel.style.transition = "max-height 0.35s ease";
          // Hide after transition
          panel.addEventListener(
            "transitionend",
            () => {
              if (panel.style.maxHeight === "0px") panel.hidden = true;
            },
            { once: true }
          );
        }
      }

      toggleAccordionIcon(trigger, nowExpanded);
    });
  });
}

/**
 * Rotates a chevron icon inside an accordion trigger button.
 * Looks for a child element with .accordion-icon class.
 * @param {HTMLElement} trigger
 * @param {boolean} expanded
 */
function toggleAccordionIcon(trigger, expanded) {
  const icon = trigger.querySelector(".accordion-icon");
  if (!icon) return;
  icon.style.transform = expanded ? "rotate(180deg)" : "rotate(0deg)";
  icon.style.transition = "transform 0.3s ease";
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. BACK-TO-TOP BUTTON
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Creates a back-to-top button (if it doesn't exist in HTML) and shows /
 * hides it based on scroll position.
 *
 * The button is styled by custom.css (#back-to-top).
 */
function initBackToTop() {
  // Create button if not already in the HTML
  let btn = document.getElementById("back-to-top");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5"/>
      </svg>`;
    document.body.appendChild(btn);
  }

  // Show / hide based on scroll depth
  const SHOW_AFTER_PX = 400;

  function onScroll() {
    if (window.scrollY > SHOW_AFTER_PX) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled

  // Scroll to top on click
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. NAVBAR SHADOW ON SCROLL
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Adds a heavier shadow to the navbar once the user scrolls down,
 * giving a visual sense of elevation.
 * The navbar element is injected by components.js with id="navbar".
 */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add("shadow-medium");
      navbar.classList.remove("shadow-soft");
    } else {
      navbar.classList.add("shadow-soft");
      navbar.classList.remove("shadow-medium");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // initial state
}
