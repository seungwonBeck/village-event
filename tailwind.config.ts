import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#3A2A1E",
        black: "#3A2A1E",
        shin: {
          red: "#EE3B2F",
          yellow: "#FFD23F",
          pink: "#FF6FAE",
          sky: "#5BC8F0",
          grass: "#6CC04A",
          board: "#2F6B4F",
          wood: "#C08A4F",
          paper: "#FFF4C2",
        },
        paper: "#f3ede3",
        cream: "#f3ede3",
        sky: "#9edcf5",
        pink: "#f16da1",
        yellow: "#ffda44",
        green: "#188752",
        crayon: {
          yellow: "#FFF34F",
          pink: "#FF55AE",
          blue: "#69CFF6",
          red: "#F04444",
          bg: "#FFF4C2",
          text: "#171717",
          green: "#4ADE80",
          purple: "#A78BFA",
          orange: "#FB923C",
          dark: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["A2Z", "sans-serif"],
        hand: ["A2Z", "sans-serif"],
      },
      // 에이투지체 굵기에 맞춘 재매핑: black은 800(제목), extrabold 700, bold 600
      fontWeight: {
        black: "800",
        extrabold: "700",
        bold: "600",
      },
      boxShadow: {
        pop: "4px 4px 0px #3A2A1E",
        "pop-lg": "6px 6px 0px #3A2A1E",
        "pop-xl": "8px 8px 0px #3A2A1E",
        "pop-sm": "2px 2px 0px #3A2A1E",
        "pop-hover": "2px 2px 0px #3A2A1E",
      },
      borderRadius: {
        "2xl": "18px 14px 20px 13px / 14px 19px 13px 20px",
        "3xl": "30px 22px 32px 20px / 22px 30px 20px 32px",
      },
      borderWidth: {
        3: "3px",
        5: "5px",
        6: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
