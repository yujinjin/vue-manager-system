import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginImportX from "eslint-plugin-import-x";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginVue from "eslint-plugin-vue";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import eslintPluginMarkdown from "eslint-plugin-markdown";
import eslintPluginVitest from "eslint-plugin-vitest";
// import eslintConfigPrettier from "eslint-config-prettier";

// const DOMGlobals = ['window', 'document']
// const NodeGlobals = ['module', 'require']

export default tseslint.config(
    /** js推荐配置*/
    eslint.configs.recommended,
    /** ts推荐配置 */
    ...tseslint.configs.recommended,
    /** vue推荐配置 */
    ...eslintPluginVue.configs["flat/recommended"],
    /** markdown 推荐配置 */
    ...eslintPluginMarkdown.configs.recommended,
    /** jsonc 推荐配置（一定放在tseslint后面，不然json文件会提示报错） */
    ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],
    /**
     * prettier 配置
     * 会合并根目录下的.prettier.config.js 文件
     */
    eslintPluginPrettierRecommended,
    /** import-x 配置 */
    {
        plugins: {
            "import-x": eslintPluginImportX
        },
        settings: {
            "import-x/parsers": {
                "@typescript-eslint/parser": ["**/*.ts", "**/*.tsx"]
            },
            "import-x/resolver": {
                typescript: true,
                node: true
                // node: {
                //     extensions: [".js", ".jsx", ".ts", ".tsx"]
                // }
            }
        },
        rules: {
            ...eslintPluginImportX.configs.recommended.rules,
            "import-x/no-unresolved": "off",
            "import-x/order": "error",
            "import-x/consistent-type-specifier-style": ["error", "prefer-inline"],
            "import-x/namespace": "off"
            // "import-x/named": "off"
        }
    },
    /**
     * 通用配置
     * @see https://typescript-eslint.io/rules
     * @see https://eslint.org/docs/latest/rules
     */
    {
        files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx,vue}"],
        languageOptions: {
            globals: {
                Nullable: true
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        rules: {
            // 允许调用 console 对象的方法
            "no-console": ["off"],
            // 是否使用 debugger
            "no-debugger": "error",
            // 禁止在循环中 出现 await
            "no-await-in-loop": "error",
            // 禁用不必要的 return await function()
            "no-return-await": "error",
            // 不允许使用 var
            "no-var": "error",
            // 生产模式禁止出现空语句块
            "no-empty": "error",
            // 禁止重复导入(imports)
            // "no-duplicate-imports": "error",
            // 禁用 tab
            "no-tabs": "error",
            // 要求使用 === 和 !==
            "eqeqeq": ["error", "always"],
            // 禁用 Alert、prompt 和 confirm
            "no-alert": "error",
            // 警告：在 else 前有 return（如果 if 块中包含了一个 return 语句，else 块就成了多余的了。可以将其内容移至块外。）
            "no-else-return": "warn",
            // 禁用 eval()
            "no-eval": "error",
            // 禁用 eval()
            "no-implied-eval": "error",
            // 禁用不必要的嵌套块
            "no-lone-blocks": "error",
            // 禁用一成不变的循环条件
            "no-unmodified-loop-condition": "error",
            "no-unused-vars": "off",
            // 强制在 parseInt() 使用基数参数
            "radix": "error",
            // 禁止在变量定义之前使用它们
            "no-use-before-define": "error",
            // 强制使用骆驼拼写法命名约定
            "camelcase": ["error", { properties: "always" }],
            // 强制块语句的最大可嵌套深度
            "max-depth": ["error", 4],
            // 要求或禁止末尾逗号
            "comma-dangle": "error",
            // (默认) 要求尽可能地使用双引号（eslint9 弃用）
            // "quotes": ["error", "double"],
            // 如果有属性名称要求使用引号，则所有的属性名称都要使用引号；否则，禁止所有的属性名称使用引号（eslint9 弃用）
            // "quote-props": ["error", "consistent-as-needed"],
            // 针对匿名函数表达式必须空格 (比如 function () {})|针对命名的函数表达式禁止空格 (比如 function foo() {})|针对异步的箭头函数表达式必须空格 (比如 async () => {})。
            "space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],
            // ts
            // 函数与类方法的返回值可以依赖类型推导
            "@typescript-eslint/explicit-module-boundary-types": "off",
            // 允许显式的 any的使用
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            // 允许非空断言与可选链同时使用：foo?.bar!
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            // 约束使用 import type {} 进行类型的导入
            // "@typescript-eslint/consistent-type-imports": ["error", { disallowTypeAnnotations: false }],
            "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", disallowTypeAnnotations: false }],
            "@typescript-eslint/ban-ts-comment": ["off", { "ts-ignore": false }],
            "@typescript-eslint/no-unused-vars": ["error", { args: "none", caughtErrors: "none" }]
            // "@typescript-eslint/quotes": ["error", "double"]
        }
    },
    /** d.ts 配置 */
    {
        files: ["*.d.ts"],
        rules: {}
    },
    /** js 配置 */
    {
        files: ["*.js"],
        // ...tseslint.configs.disableTypeChecked,
        rules: {}
    },
    /** vue 配置 */
    {
        files: ["*.vue", "**/*.vue"],
        languageOptions: {
            // parser: "vue-eslint-parser",
            parserOptions: {
                parser: "@typescript-eslint/parser",
                ecmaVersion: "latest",
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        rules: {
            // vue
            "vue/multi-word-component-names": "off"
        }
    },
    /** json 配置 */
    {
        files: ["*.json", "*.json5", "*.jsonc"],
        // ...tseslint.configs.disableTypeChecked,
        languageOptions: {
            // parser: "jsonc-eslint-parser"
        },
        rules: {}
    },
    /** 单元测试 配置 */
    {
        files: ["**/__tests__/**"],
        plugins: {
            vitest: eslintPluginVitest
        },
        languageOptions: {
            globals: {
                ...eslintPluginVitest.environments.env.globals
            }
        },
        rules: {
            "no-console": "off",
            "no-restricted-globals": "off",
            "no-restricted-syntax": "off",
            "vitest/no-disabled-tests": "error",
            "vitest/no-focused-tests": "error"
        }
    },
    /** 忽略文件 */
    {
        ignores: [".vscode/*", "node_modules", "dist", ".husky", "public", ".idea/"]
    }
);
