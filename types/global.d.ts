/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-08 15:15:28
 * @项目的路径: \vue-manager-system\types\global.d.ts
 * @描述: 全局声明
 */
import type { ComponentPublicInstance, FunctionalComponent } from "vue";
import type { App } from "/#/app";
declare global {
    const config: App.Config;

    const logs: App.Logs;
}

declare module "vue" {
    export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
    import { CompatVue } from "@vue/runtime-dom";
    const Vue: CompatVue;
    export default Vue;
    export * from "@vue/runtime-dom";
}

// 移除 readonly
declare type NotReadonly<T> = {
    -readonly [K in keyof T]: T[K];
};
