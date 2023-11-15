/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-11-15 10:20:50
 * @项目的路径: \vue-manager-system\types\global.d.ts
 * @描述: 全局声明
 */
import type { ComponentPublicInstance, FunctionalComponent } from "vue";
import type { App } from "/#/app";

// 定义全局属性，如果当前文件只有此内容，需要添加“export {}”内容在，通过创建一个空的导出对象来告诉 TypeScript 这是一个模块文件。然后声明了一个扩展的全局接口
declare global {
    const config: App.Config;

    const logs: App.Logs;

    interface Window {
        appMain: any;
    }

    interface Document {
        attachEvent(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    }
}

declare module "vue" {
    export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
    import type { CompatVue } from "vue";
    const Vue: CompatVue;
    export default Vue;
    export * from "vue";
}

// 移除 readonly
declare type NotReadonly<T> = {
    -readonly [K in keyof T]: T[K];
};

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const Component: DefineComponent<object, object, any>;
    export default Component;
}
