import type { Config } from "tailwindcss";

// Token mapping from site.md §11.8 (colors/spacing/radius/fonts) and
// §13.3 (breakpoints matching site.md §11.7 / PLAN.md §17).
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        border: "var(--color-border)",
        "home-bg": "var(--home-bg)",
        "home-surface": "var(--home-surface)",
        "home-surface-2": "var(--home-surface-2)",
        "home-text": "var(--home-text)",
        "home-muted": "var(--home-text-muted)",
        "home-border": "var(--home-border)",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
        24: "96px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        full: "9999px",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        container: "1200px",
      },
      fontSize: {
        "display-1": ["clamp(3rem, 9vw, 8.5rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "display-2": ["clamp(2.25rem, 5.5vw, 4.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-3": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1", letterSpacing: "-0.01em" }],
        ghost: ["clamp(5rem, 20vw, 20rem)", { lineHeight: "0.82" }],
      },
      boxShadow: {
        // Restrained warm drop only — no hard 1px ring, no wide bloom.
        "glow-primary": "0 22px 50px -24px rgba(217,98,43,0.38)",
        "glow-accent": "0 22px 50px -24px rgba(242,169,59,0.32)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-11px,0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "50%": { transform: "translate3d(9px,7px,0) rotate(2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.04)" },
        },
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        drift: "drift 13s ease-in-out infinite",
        "pulse-glow": "pulse-glow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
