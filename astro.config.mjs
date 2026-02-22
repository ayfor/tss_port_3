// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ayfor.github.io',
  base: '/tss_port_3',
  vite: {
    plugins: [tailwindcss()]
  }
});