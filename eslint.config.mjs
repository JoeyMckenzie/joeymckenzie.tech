import antfu from '@antfu/eslint-config';
import tailwind from 'eslint-plugin-tailwindcss';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  antfu({
    vue: true,
    typescript: true,
    stylistic: {
      semi: true,
    },
  }),
  ...tailwind.configs['flat/recommended'],
);
