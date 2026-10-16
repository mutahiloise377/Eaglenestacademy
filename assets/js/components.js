/**
 * components.js
 * Eaglenest Academy – Shared injectable components.
 *
 * Exports two functions called by every page:
 *   renderHeader()  → injects sticky navbar into #site-header
 *   renderFooter()  → injects 4-column footer into #site-footer
 *
 * Also appends a floating WhatsApp button directly to <body>.
 *
 * Called at the bottom of each page's <body> (after the DOM exists):
 *   <script src="assets/js/components.js"></script>
 *   <script>
 *     renderHeader();
 *     renderFooter();
 *   </script>
 */

/* ─── Configuration ────────────────────────────────────────────────────── */

const SITE = {
  name:        "Eaglenest Academy",
  tagline:     "Soar Higher. Learn Better.",
  phone:       "+254XXXXXXXXX",               // ← replace with real number
  whatsapp:    "+254XXXXXXXXX",               // ← replace with real number
  email:       "info@eaglenestacademy.ac.ke",
  address:     "P.O. Box 1234, Nairobi, Kenya",
  logoPath:    "assets/images/logo/logo.png", // relative from every page
  year:        new Date().getFullYear(),
};

/** Nav links: { label, href, icon (optional emoji/SVG class) } */
const NAV_LINKS = [
  { label: "Home",        href: "index.html"      },
  { label: "About",       href: "about.html"      },
  { label: "Academics",   href: "academics.html"  },
  { label: "Student Life",href: "student-life.html"},
  { label: "Admissions",  href: "admissions.html" },
  { label: "Contact",     href: "contact.html"    },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href:  "https://facebook.com/eaglenestacademy",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 12a10 10 0 1 0-11.563 9.876v-6.988H7.898V12h2.539V9.797c0-2.506 1.493-3.891 3.777-3.891 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.888h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
          </svg>`,
  },
  {
    label: "Twitter / X",
    href:  "https://twitter.com/eaglenestacademy",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>`,
  },
  {
    label: "Instagram",
    href:  "https://instagram.com/eaglenestacademy",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>`,
  },
  {
    label: "YouTube",
    href:  "https://youtube.com/@eaglenestacademy",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>`,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER – detect active page by comparing current filename to href
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Returns true if the given href matches the current HTML file.
 * Works for /index.html, index.html, and bare "/" (root).
 * @param {string} href
 * @returns {boolean}
 */
function isActivePage(href) {
  const currentFile = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase() || "index.html"; // bare "/" → treat as index.html

  const targetFile = href.split("/").pop().toLowerCase();
  return currentFile === targetFile;
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. HEADER / NAVBAR
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Builds the sticky top navbar and injects it into #site-header.
 *
 * Structure:
 *   <header #site-header>
 *     <nav>
 *       [logo]  [desktop nav links]  [Apply Now btn]  [hamburger]
 *     </nav>
 *     <div #mobile-menu> ... </div>
 *   </header>
 */
function renderHeader() {
  const headerEl = document.getElementById("site-header");
  if (!headerEl) {
    console.warn("components.js: #site-header not found in DOM.");
    return;
  }

  /* ── Build desktop nav link items ─────────────────────────────────── */
  const desktopLinks = NAV_LINKS.map((link) => {
    const active = isActivePage(link.href);
    return `
      <a href="${link.href}"
         class="nav-link relative text-sm font-semibold transition-colors duration-200
                hover:text-leaf-500
                ${active ? "active-link text-leaf-500" : "text-ink"}"
         ${active ? 'aria-current="page"' : ""}>
        ${link.label}
      </a>`;
  }).join("");

  /* ── Build mobile drawer link items ───────────────────────────────── */
  const mobileLinks = NAV_LINKS.map((link) => {
    const active = isActivePage(link.href);
    return `
      <a href="${link.href}"
         class="nav-link block px-4 py-3 text-base font-semibold rounded-lg
                transition-colors duration-200
                hover:bg-leaf-50 hover:text-leaf-600
                ${active ? "bg-leaf-50 text-leaf-600" : "text-ink"}"
         ${active ? 'aria-current="page"' : ""}>
        ${link.label}
      </a>`;
  }).join("");

  /* ── Render HTML ───────────────────────────────────────────────────── */
  headerEl.innerHTML = `
    <!-- Skip link for keyboard / screen-reader users -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- ───────────────────────── Main nav bar ──────────────────────── -->
    <nav id="navbar"
         class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm
                shadow-soft transition-shadow duration-300"
         aria-label="Main navigation">
      <div class="container-xl">
        <div class="flex items-center justify-between h-16 md:h-20">

          <!-- Logo -->
          <a href="index.html" class="flex items-center gap-3 flex-shrink-0" aria-label="${SITE.name} home">
            <img src="${SITE.logoPath}"
                 alt="${SITE.name} logo"
                 class="h-10 w-auto"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <!-- Fallback text logo shown if image is missing -->
            <span class="hidden items-center justify-center w-10 h-10 rounded-xl
                         bg-brand-gradient text-white font-heading font-bold text-lg">E</span>
            <span class="font-heading font-bold text-lg text-ink leading-tight hidden sm:block">
              Eaglenest<br><span class="text-sky-500 font-normal text-sm">Academy</span>
            </span>
          </a>

          <!-- Desktop nav links (hidden on mobile) -->
          <div class="hidden lg:flex items-center gap-6" role="menubar" aria-label="Site links">
            ${desktopLinks}
          </div>

          <!-- Desktop CTA button + mobile hamburger -->
          <div class="flex items-center gap-3">
            <!-- "Apply Now" green button -->
            <a href="admissions.html"
               class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5
                      bg-leaf-500 hover:bg-leaf-600
                      text-white text-sm font-bold rounded-pill
                      transition-colors duration-200 shadow-soft hover:shadow-medium
                      focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2">
              Apply Now
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
              </svg>
            </a>

            <!-- Hamburger button (visible on mobile) -->
            <button id="hamburger-btn"
                    class="lg:hidden flex flex-col items-center justify-center w-10 h-10
                           rounded-lg hover:bg-sky-50 transition-colors duration-200"
                    aria-label="Toggle mobile menu"
                    aria-expanded="false"
                    aria-controls="mobile-menu">
              <!-- Three-bar icon; swapped to ✕ by JS when menu is open -->
              <span class="hamburger-bar block w-6 h-0.5 bg-ink rounded transition-all duration-300"></span>
              <span class="hamburger-bar block w-6 h-0.5 bg-ink rounded transition-all duration-300 my-1.5"></span>
              <span class="hamburger-bar block w-6 h-0.5 bg-ink rounded transition-all duration-300"></span>
            </button>
          </div>

        </div><!-- /flex row -->
      </div><!-- /container -->
    </nav>

    <!-- ──────────────────────── Mobile drawer ────────────────────────── -->
    <!--
      Hidden by default.
      main.js toggles the .hidden CSS class and sets aria-expanded.
      custom.css handles the slide-in transition via transform.
    -->
    <div id="mobile-menu"
         class="hidden fixed inset-0 z-40 lg:hidden"
         aria-label="Mobile navigation">

      <!-- Semi-transparent backdrop -->
      <div id="mobile-menu-backdrop"
           class="absolute inset-0 bg-ink/40 backdrop-blur-sm"></div>

      <!-- Drawer panel -->
      <div class="absolute top-0 right-0 h-full w-72 max-w-[80vw]
                  bg-white shadow-strong flex flex-col">

        <!-- Drawer header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-sky-100">
          <span class="font-heading font-bold text-ink text-base">Menu</span>
          <button id="mobile-menu-close"
                  class="w-9 h-9 flex items-center justify-center rounded-lg
                         hover:bg-sky-50 transition-colors"
                  aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Drawer links -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          ${mobileLinks}
        </nav>

        <!-- Drawer footer CTA -->
        <div class="px-5 py-5 border-t border-sky-100">
          <a href="admissions.html"
             class="flex items-center justify-center gap-2 w-full py-3
                    bg-leaf-500 hover:bg-leaf-600
                    text-white font-bold rounded-xl
                    transition-colors duration-200">
            Apply Now
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
            </svg>
          </a>
          <!-- Quick contact in drawer -->
          <a href="tel:${SITE.phone}"
             class="mt-3 flex items-center justify-center gap-2 text-sm text-sky-600
                    hover:text-sky-700 font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372
                       c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293
                       c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143
                       c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173
                       L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5
                       A2.25 2.25 0 0 0 2.25 4.5v2.25z"/>
            </svg>
            ${SITE.phone}
          </a>
        </div>

      </div><!-- /drawer panel -->
    </div><!-- /mobile-menu -->

    <!-- Spacer that prevents content from hiding behind the fixed navbar -->
    <div class="h-16 md:h-20" aria-hidden="true"></div>
  `;
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. FOOTER
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Builds the 4-column footer and injects it into #site-footer.
 *
 * Columns:
 *   1. About blurb + logo
 *   2. Quick links (same as nav)
 *   3. Contact details
 *   4. Office hours + social icons
 */
function renderFooter() {
  const footerEl = document.getElementById("site-footer");
  if (!footerEl) {
    console.warn("components.js: #site-footer not found in DOM.");
    return;
  }

  /* ── Quick links column ────────────────────────────────────────────── */
  const quickLinks = NAV_LINKS.map(
    (link) => `
      <li>
        <a href="${link.href}"
           class="text-sky-100/80 hover:text-white text-sm transition-colors duration-200
                  flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-leaf-500 flex-shrink-0"
               fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
          </svg>
          ${link.label}
        </a>
      </li>`
  ).join("");

  /* ── Social icons row ──────────────────────────────────────────────── */
  const socialIcons = SOCIAL_LINKS.map(
    (s) => `
      <a href="${s.href}" target="_blank" rel="noopener noreferrer"
         aria-label="${s.name} (opens in new tab)"
         class="w-9 h-9 flex items-center justify-center rounded-full
                bg-white/10 hover:bg-leaf-500
                text-white/80 hover:text-white
                transition-colors duration-200">
        ${s.svg}
      </a>`
  ).join("");

  /* ── Render HTML ───────────────────────────────────────────────────── */
  footerEl.innerHTML = `
    <footer class="bg-ink text-white">

      <!-- ─── Main footer columns ─────────────────────────────────────── -->
      <div class="container-xl py-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- Column 1: About -->
          <div class="lg:col-span-1">
            <!-- Logo in footer -->
            <a href="index.html" class="flex items-center gap-3 mb-4" aria-label="${SITE.name} home">
              <img src="${SITE.logoPath}"
                   alt="${SITE.name} logo"
                   class="h-10 w-auto brightness-0 invert"
                   onerror="this.style.display='none'">
              <span class="font-heading font-bold text-xl text-white">
                Eaglenest<span class="text-sky-400"> Academy</span>
              </span>
            </a>
            <p class="text-sky-100/70 text-sm leading-relaxed mb-4">
              ${SITE.tagline} — Nurturing young minds with quality education,
              strong values, and holistic development since 2005.
            </p>
            <!-- Gradient divider -->
            <div class="divider-gradient opacity-60 mb-4"></div>
            <!-- Social icons -->
            <div class="flex items-center gap-2" aria-label="Social media links">
              ${socialIcons}
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h3 class="font-heading font-semibold text-white text-base mb-5 flex items-center gap-2">
              <span class="w-1 h-5 bg-leaf-500 rounded-pill inline-block" aria-hidden="true"></span>
              Quick Links
            </h3>
            <ul class="space-y-3">
              ${quickLinks}
            </ul>
          </div>

          <!-- Column 3: Contact -->
          <div>
            <h3 class="font-heading font-semibold text-white text-base mb-5 flex items-center gap-2">
              <span class="w-1 h-5 bg-sky-500 rounded-pill inline-block" aria-hidden="true"></span>
              Contact Us
            </h3>
            <address class="not-italic space-y-3 text-sm text-sky-100/80">
              <!-- Address -->
              <p class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0z"/>
                </svg>
                ${SITE.address}
              </p>
              <!-- Phone -->
              <p class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sky-400 flex-shrink-0"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372
                           c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293
                           c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143
                           c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173
                           L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5
                           A2.25 2.25 0 0 0 2.25 4.5v2.25z"/>
                </svg>
                <a href="tel:${SITE.phone}" class="hover:text-white transition-colors">${SITE.phone}</a>
              </p>
              <!-- Email -->
              <p class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sky-400 flex-shrink-0"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15
                           a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0
                           A2.25 2.25 0 0 0 19.5 4.5h-15
                           a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243
                           a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615
                           a2.25 2.25 0 0 1-2.36 0L3.32 8.91
                           a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                </svg>
                <a href="mailto:${SITE.email}" class="hover:text-white transition-colors break-all">${SITE.email}</a>
              </p>
            </address>
          </div>

          <!-- Column 4: Hours -->
          <div>
            <h3 class="font-heading font-semibold text-white text-base mb-5 flex items-center gap-2">
              <span class="w-1 h-5 bg-leaf-500 rounded-pill inline-block" aria-hidden="true"></span>
              Office Hours
            </h3>
            <dl class="space-y-2 text-sm text-sky-100/80">
              <div class="flex justify-between gap-4">
                <dt>Mon – Fri</dt>
                <dd class="font-medium text-white">7:00 AM – 5:00 PM</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt>Saturday</dt>
                <dd class="font-medium text-white">8:00 AM – 12:00 PM</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt>Sunday</dt>
                <dd class="text-sky-100/50">Closed</dd>
              </div>
            </dl>

            <!-- WhatsApp quick contact -->
            <a href="https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}"
               target="_blank" rel="noopener noreferrer"
               class="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl
                      bg-[#25D366]/20 hover:bg-[#25D366]/30
                      text-[#25D366] text-sm font-semibold
                      transition-colors duration-200 border border-[#25D366]/30">
              <!-- WhatsApp icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0"
                   fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
                         -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475
                         -.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
                         .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207
                         -.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
                         -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2
                         5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085
                         1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421
                         7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374
                         a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03
                         6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413
                         -18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547
                         4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005
                         c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

        </div><!-- /grid -->
      </div><!-- /container -->

      <!-- ─── Bottom bar ─────────────────────────────────────────────── -->
      <div class="border-t border-white/10">
        <div class="container-xl py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sky-100/50">
          <p>© ${SITE.year} ${SITE.name}. All rights reserved.</p>
          <p>
            <a href="privacy.html" class="hover:text-white transition-colors">Privacy Policy</a>
            <span class="mx-2" aria-hidden="true">·</span>
            <a href="terms.html"  class="hover:text-white transition-colors">Terms of Use</a>
            <span class="mx-2" aria-hidden="true">·</span>
            <a href="sitemap.xml" class="hover:text-white transition-colors">Sitemap</a>
          </p>
        </div>
      </div>

    </footer>
  `;
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. FLOATING WHATSAPP BUTTON (appended to <body>)
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Creates and appends a sticky WhatsApp FAB (floating action button)
 * in the bottom-right corner of every page.
 * Only appended once – safe to call multiple times.
 */
function renderWhatsAppFAB() {
  if (document.getElementById("whatsapp-fab")) return; // already rendered

  const cleanNumber = SITE.whatsapp.replace(/\D/g, ""); // strip non-digits
  const fab = document.createElement("a");

  fab.id            = "whatsapp-fab";
  fab.href          = `https://wa.me/${cleanNumber}`;
  fab.target        = "_blank";
  fab.rel           = "noopener noreferrer";
  fab.ariaLabel     = "Chat with us on WhatsApp";

  fab.className = [
    "fixed bottom-6 right-6 z-50",
    "w-14 h-14",
    "flex items-center justify-center",
    "rounded-full",
    "bg-[#25D366] hover:bg-[#1ebe5d]",
    "text-white",
    "shadow-strong hover:shadow-none",
    "transition-all duration-300",
    "hover:scale-110",
    "group",
  ].join(" ");

  fab.innerHTML = `
    <!-- WhatsApp icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
               -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475
               -.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
               .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207
               -.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
               -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2
               5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085
               1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421
               7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374
               a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03
               6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413
               -18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547
               4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005
               c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
    <!-- Tooltip label (visible on hover) -->
    <span class="absolute right-full mr-3 px-3 py-1.5
                 bg-ink text-white text-xs font-semibold rounded-lg
                 opacity-0 group-hover:opacity-100 whitespace-nowrap
                 pointer-events-none transition-opacity duration-200 shadow-soft">
      Chat with us
    </span>
  `;

  document.body.appendChild(fab);
}

/* ═══════════════════════════════════════════════════════════════════════════
   AUTO-INIT
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Automatically render all components once the DOM is ready.
 * Pages can also call renderHeader() / renderFooter() manually if they need
 * to do it at a specific point in their own script.
 */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderWhatsAppFAB();
});
