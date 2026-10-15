module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix --no-warn-ignored', 'prettier --write'],
  '*.{json,md,css}': ['prettier --write'],
};
