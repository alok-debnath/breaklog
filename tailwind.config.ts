import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'), 'prettier-plugin-tailwindcss'],
  daisyui: {
    themes: ['light', 'dark', 'synthwave', 'cyberpunk', 'forest', 'retro'],
  },
};
export default config;
