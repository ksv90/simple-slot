import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    title: 'Simple slot',
    meta: {
      viewport:
        'width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no',
    },
  },
  plugins: [pluginReact()],
  output: {
    assetPrefix: '/simple-slot/',
  },
});
