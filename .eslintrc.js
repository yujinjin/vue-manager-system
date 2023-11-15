/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-10-31 16:26:23
 * @项目的路径: \vue-manager-system\.eslintrc.js
 * @描述: eslingt 配置
 */
const { defineConfig } = require("eslint-define-config");
module.exports = defineConfig({
    root: true,
    env: {
        "browser": true,
        "node": true,
        "es6": true,
        "vue/setup-compiler-macros": true
    },
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
    extends: ["eslint:recommended", "plugin:vue/vue3-essential", "@vue/eslint-config-typescript/recommended", "@vue/eslint-config-prettier", "@vue/eslint-config-prettier/skip-formatting", "plugin:promise/recommended"],
    rules: {
        // 允许调用 console 对象的方法
        "no-console": "error",
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
        "no-tabs": ["error", { allowIndentationTabs: true }],
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
        // (默认) 要求尽可能地使用双引号
        "quotes": ["error", "double"],
        // 如果有属性名称要求使用引号，则所有的属性名称都要使用引号；否则，禁止所有的属性名称使用引号
        "quote-props": ["error", "consistent-as-needed"],
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
        "@typescript-eslint/consistent-type-imports": ["error", { disallowTypeAnnotations: false }],
        "@typescript-eslint/ban-ts-comment": ["off", { "ts-ignore": false }],
        // "@typescript-eslint/quotes": ["error", "double"]
        "import/named": "off",
        "vue/script-setup-uses-vars": "error",
        "vue/custom-event-name-casing": "off",
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
        "vue/multi-word-component-names": "off"
    }
});
