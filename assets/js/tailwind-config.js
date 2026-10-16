/**
 * tailwind-config.js
 * Eaglenest Academy – Tailwind CSS configuration (CDN / browser build).
 *
 * Loaded BEFORE the Tailwind CDN script so the CDN picks it up via
 * the global `tailwind.config` object.
 *
 * Usage in HTML:
 *   <script src="assets/js/tailwind-config.js"></script>
 *   <script src="https://cdn.tailwindcss.com"></script>
 */

tailwind.config = {
  /* ─── Dark-mode strategy ─────────────────────────────────────────────── */
  darkMode: "class",

  theme: {
    extend: {
      /* ─── Brand colour palettes ──────────────────────────────────────── */
      colors: {
        sky: {
          50:  "#F0F9FF",  /* Lightest sky tint  – backgrounds             */
          100: "#E0F2FE",  /* Light sky tint     – section backgrounds      */
          500: "#0EA5E9",  /* Sky mid            – primary accents          */
          600: "#0284C7",  /* Sky deep           – hover / active states    */
        },
        leaf: {
          50:  "#F0FDF4",  /* Lightest leaf tint – subtle backgrounds       */
          100: "#DCFCE7",  /* Light leaf tint    – card backgrounds         */
          500: "#22C55E",  /* Leaf mid           – CTA buttons              */
          600: "#16A34A",  /* Leaf deep          – button hover             */
        },
        /* Single-tone brand ink – used as the default body text colour */
        ink: "#0F2A43",
      },

      /* ─── Typography ─────────────────────────────────────────────────── */
      fontFamily: {
        heading: ['"Century Gothic"', "Questrial", "sans-serif"],
        body:    ["Montserrat", "sans-serif"],
      },

      /* ─── Soft shadow utilities ──────────────────────────────────────── */
      boxShadow: {
        soft:   "0 2px 12px rgba(15, 42, 67, 0.08)",   /* subtle card lift  */
        medium: "0 4px 24px rgba(15, 42, 67, 0.12)",   /* navbar / modal    */
        strong: "0 8px 40px rgba(15, 42, 67, 0.18)",   /* hero / popover    */
      },

      /* ─── Extended border-radius scale ──────────────────────────────── */
      borderRadius: {
        xl:   "0.75rem",    /* cards                                        */
        "2xl":"1rem",       /* modals / feature cards                       */
        "3xl":"1.5rem",     /* hero image frames                            */
        pill: "9999px",     /* fully-rounded pill badges / buttons          */
      },
    },
  },

  plugins: [],
};
