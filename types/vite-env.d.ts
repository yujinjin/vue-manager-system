/// <reference types="vite/client" />

interface ViteTypeOptions {
    // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
    // 这样就不允许有未知的键值了。
    strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
    // 当前web项目是否是Hash模式（1：是，0：否）
    readonly VITE_APP_WEB_HASH: string;

    // 项目名称（build时候会取package.json的name值，自动替换掉）
    readonly VITE_APP_NAME: string;

    // API服务地址
    readonly VITE_APP_API_DOMAIN: string;

    // 资源服务地址
    readonly VITE_APP_RESOURCE_DOMAIN: string;

    // 上传服务地址
    readonly VITE_APP_UPLOAD_DOMAIN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// 当前项目构建时间（build时候实时获取当前时间，自动替换掉）
declare const VITE_APP_BUILD_TIME: number;

// 当前web项目服务部署根目录（路径）
declare const VITE_APP_PROJECT_CONTENT_PATH: string;

// 当前是否是mock数据模式（1：是，0：否）
declare const VITE_MOCK_DATA: string;
