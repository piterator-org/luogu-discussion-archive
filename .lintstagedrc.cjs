const eslint = "eslint --fix";
const prettier = "prettier --write";
const prettierCheck = "prettier --check";
const prisma = "prisma format --schema";

module.exports = {
  "*.{js,mjs,cjs,jsx,ts,tsx}": [eslint, prettierCheck],
  "*.{md,html,css,scss,json,yml,yaml}": prettier,
  "*.prisma": prisma,
};
