import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess : preprocess({
    typescript: true,
  }),
  kit: {
    adapter: adapter({ split: false }),
    target: '#svelte',

    vite: () => ({
      resolve: {
        alias: {
          '@components': '/src/components',
        },
      },
      server: {
        https: true,
      },
      envPrefix: 'CLIENT',
    }),
  },
};

export default config;
