import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";


const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  baseDirectory: import.meta.url,
});

export default [
  { ignores: ["node_modules/**", "dist/**", "*.config.js"]},
  
  ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ),
  { rules: { /* … */ } }
];

// const { FlatCompat } = require('@eslint/eslintrc');
// const js = require('@eslint/js');

// const compat = new FlatCompat({
//   recommendedConfig: js.configs.recommended,
//   baseDirectory: __dirname, 
// });

// module.exports = [
//   { ignores: ['node_modules/**', 'dist/**', '*.config.js'] },

//   ...compat.extends(
//     'plugin:@typescript-eslint/recommended',
//     'prettier'
//   ),

//   { rules: {
//     // Tus reglas personalizadas aquí
//   } }
// ];
