import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Safe Guard specific colors
        safe: {
          50: "hsl(200 100% 97%)",
          100: "hsl(200 95% 94%)",
          200: "hsl(200 90% 87%)",
          300: "hsl(200 85% 75%)",
          400: "hsl(200 80% 60%)",
          500: "hsl(200 95% 45%)",
          600: "hsl(200 90% 35%)",
          700: "hsl(200 85% 25%)",
          800: "hsl(200 80% 15%)",
          900: "hsl(200 75% 8%)",
        },
        success: {
          50: "hsl(160 90% 95%)",
          100: "hsl(160 85% 88%)",
          200: "hsl(160 80% 75%)",
          300: "hsl(160 75% 60%)",
          400: "hsl(160 70% 45%)",
          500: "hsl(160 65% 35%)",
          600: "hsl(160 60% 25%)",
          700: "hsl(160 55% 18%)",
          800: "hsl(160 50% 12%)",
          900: "hsl(160 45% 8%)",
        },
        warning: {
          50: "hsl(45 100% 95%)",
          100: "hsl(45 95% 88%)",
          200: "hsl(45 90% 75%)",
          300: "hsl(45 85% 60%)",
          400: "hsl(45 80% 45%)",
          500: "hsl(45 75% 35%)",
          600: "hsl(45 70% 25%)",
          700: "hsl(45 65% 18%)",
          800: "hsl(45 60% 12%)",
          900: "hsl(45 55% 8%)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
