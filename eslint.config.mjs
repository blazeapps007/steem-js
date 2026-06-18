// ESLint v9 flat config (replaces the old .eslintrc). Lints `src` via `npm run lint`.
// The source mixes ESM (`import`/`export`) and CommonJS (`require`/`module.exports`);
// the default parser (espree) handles both, and node+browser globals cover `Buffer`,
// `process`, `module`, `require`, `window`, etc. so `no-undef` doesn't misfire.
import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-undef': 'error',
      'no-const-assign': 'error',
      'no-this-before-super': 'error',
      'use-isnan': 'error',

      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-unused-vars': 'warn',
      'no-unreachable': 'warn',
      'no-shadow': 'warn',
      'no-constant-condition': 'warn',
      'no-shadow-restricted-names': 'off',
    },
  },
];
