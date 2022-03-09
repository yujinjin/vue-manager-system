const path = require("path");
const webpack = require("webpack");
const Alphabet = require("alphabetjs");
const chalk = require("chalk");
const str = Alphabet("JACK YU", "planar");
console.log(chalk.bgBlueBright("--------------------------------------------------"));
console.log(chalk.blue(str));
console.log(chalk.bgBlueBright("--------------------------------------------------"));
const pkg = require("./package.json");
function pathResolve(dir) {
    return path.resolve(process.cwd(), ".", dir);
}

module.exports = {
    publicPath: "/",
    assetsDir: "build",
    productionSourceMap: process.env.VUE_APP_ENV === "UAT" || process.env.VUE_APP_ENV === "DEV",
    lintOnSave: true,
    pages: {
        index: {
            entry: "src/main.ts",
            template: "src/index.html",
            favicon: "src/assets/favicon.ico",
            filename: "index.html"
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                "@": pathResolve("src"),
                "@api": pathResolve("src/api"),
                "@imgs": pathResolve("src/assets/images"),
                "@style": pathResolve("src/assets/style"), // 视图
                "@views": pathResolve("src/views"), // 视图
                "@components": pathResolve("src/components") // 视图内的组件
            }
        }
    },
    chainWebpack: config => {
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(pathResolve("src/components/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({ symbolId: "icon-[name]" })
            .end();

        config.module
            .rule("images")
            .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
            .exclude.add(pathResolve("src/assets/static"))
            .end()
            .use("url-loader")
            .loader("url-loader")
            .tap(options => Object.assign(options, { limit: 8192 }))
            .end();

        config.module
            .rule("static-images")
            .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
            .include.add(pathResolve("src/assets/static"))
            .end()
            .use("url-loader")
            .loader("url-loader")
            .options({ limit: 0, name: "build/img/[name].[hash:7].[ext]" })
            .end();

        config.module
            .rule("fonts")
            .test(/.(ttf|otf|eot|woff|woff2)$/)
            .use("url-loader")
            .loader("url-loader")
            .tap(options => {
                options = {
                    // limit: 10000,
                    name: "build/fonts/[name].[ext]"
                };
                return options;
            })
            .end();

        config.plugin("define").tap(options => {
            // DefinePlugin注入全局变量
            options[0]["process.env"]["VUE_APP_BUILD_TIME"] = new Date().getTime();
            options[0]["process.env"]["VUE_APP_VERSION"] = JSON.stringify(pkg.version);
            return options;
        });

        // 自动分析重用的模块并且打包成单独的文件
        config.plugin("provide").use(webpack.ProvidePlugin, [
            {
                config: [pathResolve("src/config.ts"), "default"],
                logs: [pathResolve("src/services/logs.ts"), "default"]
            }
        ]);
    },
    devServer: {
        // proxy: "",
        // before: app => {
        //     // 启用mock
        //     // mock.init(app)
        // },
        disableHostCheck: true, // 禁用服务检查
        hot: false,
        port: process.env.VUE_APP_PORT,
        overlay: {
            warnings: false,
            errors: true
        }
    }
};
