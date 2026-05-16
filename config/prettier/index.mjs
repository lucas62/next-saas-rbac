/**
 * @type {import("prettier").Config} PrettierConfig
 */

/** @type {PrettierConfig} */
const config = {
    plugins: [
        "prettier-plugin-tailwindcss"
    ],
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    bracketSpacing: true,
    arrowParens: "always",
    trailingComma: "es5",
    bracketSameLine: false,
    quoteProps: "as-needed",
    jsxSingleQuote: false,
    endOfLine: "auto",
}

export default config;