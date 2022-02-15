module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ["plugin:vue/essential", "@vue/prettier"],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		// 缩进使用不做限制
		indent: "off",
		"no-control-regex": 0,
		// 允许使用tab
		"no-tabs": "off",
		"no-unused-vars": "off",
		"max-len": [
			"error",
			{
				code: 500,
				ignoreUrls: true
			}
		]
	},
	globals: {
		$: true,
		jquery: true,
		jQuery: true,
		config: true,
		site: true
	},
	parserOptions: {
		parser: "babel-eslint"
	},
	overrides: [
		{
			files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
			env: {
				jest: true
			}
		}
	]
};
