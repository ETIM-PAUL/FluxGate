/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "var(--color-border)", // slate-200
          input: "var(--color-input)", // white
          ring: "var(--color-ring)", // orange-500
          background: "var(--color-background)", // white
          foreground: "var(--color-foreground)", // slate-900
          surface: "var(--color-surface)", // slate-50
          primary: {
            DEFAULT: "var(--color-primary)", // slate-800
            foreground: "var(--color-primary-foreground)", // white
          },
          secondary: {
            DEFAULT: "var(--color-secondary)", // slate-500
            foreground: "var(--color-secondary-foreground)", // white
          },
          accent: {
            DEFAULT: "var(--color-accent)", // orange-500
            foreground: "var(--color-accent-foreground)", // white
          },
          destructive: {
            DEFAULT: "var(--color-destructive)", // red-500
            foreground: "var(--color-destructive-foreground)", // white
          },
          success: {
            DEFAULT: "var(--color-success)", // emerald-500
            foreground: "var(--color-success-foreground)", // white
          },
          warning: {
            DEFAULT: "var(--color-warning)", // amber-500
            foreground: "var(--color-warning-foreground)", // white
          },
          error: {
            DEFAULT: "var(--color-error)", // red-500
            foreground: "var(--color-error-foreground)", // white
          },
          muted: {
            DEFAULT: "var(--color-muted)", // slate-50
            foreground: "var(--color-muted-foreground)", // slate-600
          },
          popover: {
            DEFAULT: "var(--color-popover)", // white
            foreground: "var(--color-popover-foreground)", // slate-900
          },
          card: {
            DEFAULT: "var(--color-card)", // white
            foreground: "var(--color-card-foreground)", // slate-900
          },
        },
        fontFamily: {
          heading: ["var(--font-heading)"],
          body: ["var(--font-body)"],
          caption: ["var(--font-caption)"],
          data: ["var(--font-data)"],
        },
        borderRadius: {
          lg: "var(--radius-lg)",
          md: "var(--radius-md)",
          sm: "var(--radius-sm)",
        },
        boxShadow: {
          sm: "var(--shadow-sm)",
          DEFAULT: "var(--shadow-default)",
          md: "var(--shadow-md)",
          lg: "var(--shadow-lg)",
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          "fade-in": {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          "slide-in-from-top": {
            "0%": { transform: "translateY(-100%)" },
            "100%": { transform: "translateY(0)" },
          },
          "slide-in-from-bottom": {
            "0%": { transform: "translateY(100%)" },
            "100%": { transform: "translateY(0)" },
          },
          "pulse-soft": {
            "0%, 100%": { opacity: "1" },
            "50%": { opacity: "0.8" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "fade-in": "fade-in 0.2s ease-out",
          "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
          "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
          "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
        transitionTimingFunction: {
          "ease-smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
        },
        zIndex: {
          '100': '100',
          '200': '200',
          '300': '300',
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }