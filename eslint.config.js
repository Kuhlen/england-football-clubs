import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],

    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },

    // TypeScript files only (exclude config files and Svelte)
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.app.json",
                createDefaultProgram: true,
            },
        },
        rules: {
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowHigherOrderFunctions: true,
                    allowDirectConstAssertionInArrowFunctions: true,
                    allowConciseArrowFunctionExpressionsStartingWithVoid: true,
                },
            ],
            "@typescript-eslint/typedef": [
                "error",
                {
                    parameter: true,
                    propertyDeclaration: true,
                    memberVariableDeclaration: true,
                    variableDeclaration: false,
                    arrowParameter: false,
                },
            ],
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/array-type": ["error", { default: "array" }],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "no-undef": "off",
        },
    },

    // Svelte files (without project reference)
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: ts.parser,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "no-unused-vars": "off",
            "no-undef": "off",
            "svelte/no-at-debug-tags": "error",
            // Disable prefer-writable-derived if you want to use $state + $effect
            "svelte/prefer-writable-derived": "off",
        },
    },

    // Config files (JavaScript only, no TypeScript project needed)
    {
        files: ["*.config.js", "eslint.config.js", "svelte.config.js", "vite.config.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "no-undef": "off",
            "@typescript-eslint/no-require-imports": "off",
        },
    },

    {
        ignores: [
            "build/**",
            "dist/**",
            "node_modules/**",
            "**/*.d.ts",
            ".svelte-kit/**",
            "vite.config.ts.timestamp-*",
        ],
    },
];
