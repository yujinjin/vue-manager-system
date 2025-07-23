import path from "node:path";
// import { type PluginOption, defineConfig } from "vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";

export default defineConfig(({ mode }) => {
    const isDev = process.env.NODE_ENV === "development" || mode === "dev";

    const PROJECT_CONTENT_PATH = isDev ? "/" : "/crm";

    return {
        base: PROJECT_CONTENT_PATH,
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@views": path.resolve(__dirname, "src/views"),
                "@components": path.resolve(__dirname, "src/components"),
                "@style": path.resolve(__dirname, "src/assets/style"),
                "@imgs": path.resolve(__dirname, "src/assets/images"),
                "@api": path.resolve(__dirname, "src/api")
            }
        },
        define: {
            VITE_APP_BUILD_TIME: new Date().getTime(),
            VITE_APP_PROJECT_CONTENT_PATH: JSON.stringify(PROJECT_CONTENT_PATH),
            VITE_MOCK_DATA: JSON.stringify(process.env.MOCK_DATA || "0")
        },
        // plugins,
        plugins: [vue(), vueJsx(), svgLoader()],
        esbuild: {
            drop: isDev ? [] : ["console", "debugger"]
        },
        server: {
            host: true,
            port: 8081,
            proxy: {
                // '/api': 'http://localhost:4567'
            },
            warmup: {
                clientFiles: ["./src/views/**/*.vue"]
            }
        },
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: "assets/js/[name]-[hash].js",
                    chunkFileNames: "assets/js/[name]-[hash].js",
                    assetFileNames: assetInfo => {
                        if (assetInfo.names[0]?.endsWith(".css")) {
                            return "assets/style/[name]-[hash].[ext]";
                        } else if (assetInfo.names[0]?.endsWith(".eot") || assetInfo.names[0]?.endsWith(".svg") || assetInfo.names[0]?.endsWith(".ttf") || assetInfo.names[0]?.endsWith(".woff")) {
                            return "assets/fonts/[name]-[hash].[ext]";
                        } else if (assetInfo.names[0]?.endsWith(".png") || assetInfo.names[0]?.endsWith(".jpg") || assetInfo.names[0]?.endsWith(".jpeg") || assetInfo.names[0]?.endsWith(".gif")) {
                            return "assets/images/[name]-[hash].[ext]";
                        }
                        return "assets/[ext]/[name]-[hash].[ext]";
                    },
                    // 配置输出文件名和路径
                    manualChunks(id) {
                        if (id.includes("src/config.ts")) {
                            // 要单独打包的文件路径
                            return "config";
                        } else if (id.includes("node_modules")) {
                            if (id.includes("element-plus")) {
                                return "element-plus";
                            } else if (id.includes("echarts")) {
                                return "echarts";
                            } else if (id.includes("monaco-editor")) {
                                return "monaco-editor/index";
                            }
                            return "vendor";
                        }
                        // 其他文件可以按照默认规则打包
                        return;
                    }
                    // manualChunks: {
                    //     "echarts": ["echarts"],
                    //     "element-plus": ["element-plus"]
                    // }
                }
            }
        }
    };
});
