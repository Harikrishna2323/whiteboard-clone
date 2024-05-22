/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./common/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  purge: [
    "./common/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// "./pages/**/*.{js,ts,jsx,tsx}",
// "./common/**/*.{js,ts,jsx,tsx}",
// "./modules/**/*.{js,ts,jsx,tsx}",

// "./src/**/*.{js,jsx,ts,tsx}",
// "./common/**/*.{js,ts,jsx,tsx}",
// "./modules/**/*.{js,ts,jsx,tsx}",
// "./modules/home/**/*.{js,ts,jsx,tsx}",
// "./modules/home/components/**/*.{js,ts,jsx,tsx}",

// "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
// "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
// "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
// "./common/**/*.{js,ts,jsx,tsx,mdx}",
// "./modules/**/*.{js,ts,jsx,tsx,mdx}",
