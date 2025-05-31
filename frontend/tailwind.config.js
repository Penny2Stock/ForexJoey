/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        // Deep space theme with neon accents (futuristic design for Gen Z)
        background: {
          DEFAULT: "#0A1128", // Deep space blue (primary background)
          secondary: "#1A1B25", // Dark slate (secondary background)
        },
        foreground: "#E9ECF5", // Silver gray (text)
        accent: {
          DEFAULT: "#1282A2", // Electric blue (primary accent)
          secondary: "#E6E6FA", // Lavender mist (subtle highlights)
        },
        positive: "#18FF6D", // Neon green (profits, buy signals)
        negative: "#FF3864", // Neon red (losses, sell signals)
        warning: "#FFD400", // Cyber yellow (alerts, notifications)
        neutral: "#7D8597", // Medium slate (neutral indicators)
        card: {
          DEFAULT: "#141824", // Card background
          foreground: "#E9ECF5", // Card text
        },
        border: "#2A2C3E",
        input: {
          DEFAULT: "#20223A",
          foreground: "#E9ECF5",
        },
        ring: "#1282A2",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      },
      fontFamily: {
        sans: ["Inter var", "Inter", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
        display: ["Outfit", "sans-serif"],
      },
      fontSize: {
        "heading-1": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "heading-2": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "heading-3": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px" }],
        "body-base": ["14px", { lineHeight: "20px" }],
        "body-sm": ["12px", { lineHeight: "16px" }],
        "data": ["16px", { lineHeight: "24px", fontFamily: "Roboto Mono" }],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "glow": {
          "0%": { boxShadow: "0 0 5px rgba(18, 130, 162, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(18, 130, 162, 0.8)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(to right, rgba(18, 130, 162, 0.1), rgba(24, 255, 109, 0.05))',
        'card-gradient': 'linear-gradient(135deg, rgba(26, 27, 37, 0.8) 0%, rgba(26, 27, 37, 0.4) 100%)',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(18, 130, 162, 0.7)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
      },
      backdropFilter: {
        'blur': 'blur(16px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
