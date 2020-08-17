const path = require("path"),
	webpack = require("webpack");

// 获取当前执行的命令
let rawArgv = process.argv.slice(2).toString();
if (rawArgv.split(",")[0] === "build") {
	process.env.NODE_ENV = "production";
}

let resolve = function(pathStr) {
	return path.resolve(__dirname, "./", pathStr);
};

module.exports = {
	publicPath: "/",
	assetsDir: "build",
	productionSourceMap: process.env.VUE_APP_ENV === "UAT" || process.env.VUE_APP_ENV === "DEV",
	transpileDependencies: [],
	lintOnSave: process.env.NODE_ENV === "development",
	pages: {
		index: {
			entry: "src/js/index.js",
			template: "src/index.html",
			favicon: "src/imgs/site.ico",
			filename: "index.html",
			chunks: ["chunk-elementUI", "chunk-libs", "chunk-commons", "runtime", "index"]
		}
	},
	configureWebpack: {
		name: "vue-manager-system",
		resolve: {
			alias: {
				"@src": resolve("src"),
				"@js": resolve("src/js"),
				"@imgs": resolve("src/imgs"), // 图片资源
				"@style": resolve("src/style"), // 视图
				"@views": resolve("src/views"), // 视图
				"@components": resolve("src/views/components") // 视图内的组件
			}
		}
	},
	chainWebpack(config) {
		config.plugins.delete("preload-index");
		config.plugins.delete("prefetch-index");

		// config.module
		// 	.rule("js")
		// 	.include.add(/node_modules/)
		// 	.end();

		config.module
			.rule("svg")
			.exclude.add(resolve("src/js/components/icons"))
			.end();

		config.module
			.rule("icons")
			.test(/\.svg$/)
			.include.add(resolve("src/js/components/icons"))
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({ symbolId: "icon-[name]" })
			.end();

		config.module
			.rule("images")
			.test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
			.exclude.add(resolve("src/imgs/static"))
			.end()
			.use("url-loader")
			.loader("url-loader")
			.tap(options => Object.assign(options, { limit: 8192 }))
			.end();

		config.module
			.rule("static-images")
			.test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
			.include.add(resolve("src/imgs/static"))
			.end()
			.use("url-loader")
			.loader("url-loader")
			.options({ limit: 0, name: "build/img/[name].[hash:7].[ext]" })
			.end();

		config.when(process.env.NODE_ENV === "development", config => config.devtool("cheap-source-map"));

		// 分块策略
		config.optimization.splitChunks({
			chunks: "all",
			cacheGroups: {
				libs: {
					name: "chunk-libs",
					test: /[\\/]node_modules[\\/]/,
					priority: 10,
					chunks: "initial" // 只打包初始时依赖的第三方
				},
				elementUI: {
					name: "chunk-elementUI", // 单独将 elementUI 拆包
					priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
					test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
				},
				commons: {
					name: "chunk-commons",
					test: resolve("src/components"), // can customize your rules
					minChunks: 3, // 最小共用次数
					priority: 5,
					reuseExistingChunk: true
				}
			}
		});

		// 创建一个在所有生成 chunk 之间共享的运行时文件
		// TODO: 这个设置还和pages里的runtime有关系，找机会还是得查一下
		config.optimization.runtimeChunk("single");

		// 自动分析重用的模块并且打包成单独的文件
		config.plugin("provide").use(webpack.ProvidePlugin, [
			{
				$: "jquery",
				jquery: "jquery",
				jQuery: "jquery",
				"window.jQuery": "jquery",
				config: resolve("src/js/config/" + (process.env.VUE_APP_ENV ? process.env.VUE_APP_ENV : "DEV") + ".js"),
				site: [resolve("src/js/site.js"), "default"]
			}
		]);
	},
	devServer: {
		// host: '0.0.0.0',
		// port: 8100,
		// open: true,
		disableHostCheck: true, // 禁用服务检查
		hot: false,
		overlay: {
			warnings: false,
			errors: true
		}
	}
};
