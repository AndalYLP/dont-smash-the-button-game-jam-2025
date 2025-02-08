import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";

export default [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                jsx: true,
                useJSXTextNode: true,
                ecmaVersion: 2018,
                sourceType: "module",
                project: "./tsconfig.json"
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            "@typescript-eslint/array-type": [
                "warn",
                {
                    default: "generic",
                    readonly: "generic",
                },
            ],
            "@typescript-eslint/no-floating-promises": [
                "error",
                {
                    ignoreVoid: true,
                },
            ],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "args": "all",
                    "argsIgnorePattern": "^_",
                    "caughtErrors": "all",
                    "caughtErrorsIgnorePattern": "^_",
                    "destructuredArrayIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "ignoreRestSiblings": true
                }
            ],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-use-before-define": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-unused-expressions": "warn",
            "@typescript-eslint/no-empty-object-type": "off",

            curly: ["warn", "multi-line", "consistent"],
            "no-constant-condition": [
                "error",
                {
                    checkLoops: false,
                },
            ],
            "no-debugger": "off",
            "no-empty": [
                "error",
                {
                    allowEmptyCatch: true,
                },
            ],
            "no-extra-boolean-cast": "off",
            "prefer-const": "off",


            "prettier/prettier": [
                "warn",
                {
                    semi: true,
                    trailingComma: "all",
                    singleQuote: false,
                    printWidth: 100,
                    tabWidth: 4,
                    useTabs: true,
                    arrowParens: "avoid",
                },
            ],
        },
    },
];