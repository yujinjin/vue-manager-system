/* eslint-disable no-console */
const path = require("path");
const webpack = require("webpack");
const Alphabet = require("alphabetjs");
const chalk = require("chalk");
console.log(chalk.bgBlueBright("--------------------------------------------------"));
console.log(chalk.blue(Alphabet("JACK YU", "planar")));
console.log(chalk.bgBlueBright("--------------------------------------------------"));
const pkg = require("./package.json");
const mock = require("./mock/index");
const bodyParser = require("body-parser");

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
                "@assets": pathResolve("src/assets"),
                "@imgs": pathResolve("src/assets/images"),
                "@style": pathResolve("src/assets/style"), // 视图
                "@views": pathResolve("src/views"), // 视图
                "@components": pathResolve("src/components") // 视图内的组件
            }
        },
        optimization: {
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    element: {
                        name: "element-plus",
                        priority: 20,
                        test: /[\\/]node_modules[\\/]_?element-plus(.*)/
                    }
                }
            }
        }
    },
    chainWebpack: config => {
        config.module.rule("svg").exclude.add(pathResolve("src/components/icons")).end();

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
            .set("parser", {
                dataUrlCondition: {
                    maxSize: 10 * 1024
                }
            })
            .exclude.add(pathResolve("src/assets/static"))
            .end();

        config.module
            .rule("static-images")
            .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
            .set("type", "asset")
            .set("generator", {
                filename: "build/img/[name].[hash:8][ext]"
            })
            .set("parser", {
                dataUrlCondition: {
                    maxSize: 0
                }
            })
            .include.add(pathResolve("src/assets/static"))
            .end();

        config.plugin("define").tap(options => {
            // DefinePlugin注入全局变量
            options[0]["process.env"]["VUE_APP_BUILD_TIME"] = new Date().getTime();
            options[0]["process.env"]["VUE_APP_VERSION"] = JSON.stringify(pkg.version);
            options[0]["process.env"]["VUE_APP_NAME"] = JSON.stringify(pkg.name);
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
        setupMiddlewares: function (middlewares, devServer) {
            if (!devServer) {
                throw new Error("webpack-dev-server is not defined");
            }
            if (process.env.MOCK_DATA === "1") {
                devServer.app.use(bodyParser.json());
                mock(devServer.app);
            }
            // devServer.app.get('/some/path', function (req, res) {
            //   res.json({ custom: 'response' });
            // });
            return middlewares;
        },
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        historyApiFallback: true,
        allowedHosts: "all",
        hot: false,
        port: process.env.VUE_APP_PORT,
        client: {
            overlay: {
                warnings: false,
                errors: true
            }
        }
    }
};
