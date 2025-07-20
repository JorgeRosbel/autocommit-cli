/** @type {import("prettier").Options} */
export default {
    // Reglas generales para TypeScript
    semi: true,
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
    trailingComma: "es5",
    bracketSpacing: true,
    arrowParens: "avoid",
  
    // Sólo aplicar estas reglas a archivos .ts
    overrides: [
      {
        files: "*.ts",
        options: { parser: "typescript" }
      }
    ]
  };
  