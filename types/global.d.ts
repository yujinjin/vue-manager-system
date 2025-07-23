/*
 * @创建者: yujinjin9@126.com
 * @描述: 全局声明
 */

// 定义全局属性，如果当前文件只有此内容，需要添加“export {}”内容在，通过创建一个空的导出对象来告诉 TypeScript 这是一个模块文件。然后声明了一个扩展的全局接口
declare global {
    interface Window {
        appMain: any;
    }

    interface Document {
        attachEvent(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    }
}

// 移除 readonly
declare type NotReadonly<T> = {
    -readonly [K in keyof T]: T[K];
};

export {};
