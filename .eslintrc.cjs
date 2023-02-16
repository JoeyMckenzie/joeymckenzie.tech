/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['*.cjs'],
  extends: ['next/core-web-vitals', 'prettier'],
};
