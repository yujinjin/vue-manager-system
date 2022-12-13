/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-08 15:15:20
 * @项目的路径: \vue-manager-system\types\module.d.ts
 * @描述: 模块功能声明
 */
declare module "*.vue" {
    import { DefineComponent } from "vue";
    const Component: DefineComponent<{}, {}, any>;
    export default Component;
}

declare interface Window {
    appMain: any;
}

declare interface Document {
    attachEvent(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
}
