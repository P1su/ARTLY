import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['dist'], // 검사 제외 폴더
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended', 'prettier'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: { globals: globals.browser },
  },
  pluginReact.configs.flat.recommended,
]);
