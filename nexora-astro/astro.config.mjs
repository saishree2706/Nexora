// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  server: {
  host: '0.0.0.0',
  port: 10000,
},
});