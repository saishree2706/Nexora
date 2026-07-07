// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    // Optimize/resize/cache images at the edge via Vercel's Image Optimization API.
    imageService: true,
  }),
});