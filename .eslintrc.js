// @ts-check
const { defineConfig } = require("eslint-define-config");
module.exports = defineConfig({
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
        "vue/setup-compiler-macros": true
    },
    // extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/typescript/recommended", "@vue/prettier", "@vue/prettier/@typescript-eslint"],
    // parserOptions: {
    //     ecmaVersion: 2020
    // },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2020,
        sourceType: "module",
        jsxPragma: "React",
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ["prettier", "vue", "@typescript-eslint/eslint-plugin", "promise"],
    globals: {
        logs: true,
        config: true
    },
    extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/typescript/recommended", "@vue/prettier", "@vue/prettier/@typescript-eslint", "plugin:promise/recommended"],
    rules: {
        "vue/script-setup-uses-vars": "error",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-empty-function": "off",
        "vue/custom-event-name-casing": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_"
            }
        ],
        "no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_"
            }
        ],
        "space-before-function-paren": "off",
        "vue/attributes-order": "off",
        "vue/one-component-per-file": "off",
        "vue/html-closing-bracket-newline": "off",
        "vue/max-attributes-per-line": "off",
        "vue/multiline-html-element-content-newline": "off",
        "vue/singleline-html-element-content-newline": "off",
        "vue/attribute-hyphenation": "off",
        "vue/require-default-prop": "off",
        "vue/require-explicit-emits": "off",
        "vue/html-self-closing": [
            "error",
            {
                html: {
                    void: "always",
                    normal: "never",
                    component: "always"
                },
                svg: "always",
                math: "always"
            }
        ],
        "vue/multi-word-component-names": "off",
        "promise/always-return": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/catch-or-return": "error",
        "promise/no-native": "off",
        "promise/no-nesting": "warn",
        "promise/no-promise-in-callback": "warn",
        "promise/no-callback-in-promise": "warn",
        "promise/avoid-new": "off",
        "promise/no-new-statics": "error",
        "promise/no-return-in-finally": "warn",
        "promise/valid-params": "warn"
    }
});
