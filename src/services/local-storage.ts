/*
 * @创建者: yujinjin9@126.com
 * @描述: 站点本地存储信息
 */
import logs from "./logs";
import config from "@/config";

class AppStorage {
    /** 本地存储的应用名称 */
    private localStorageName: string;

    constructor() {
        this.localStorageName = config.appName + "_Storage";
    }

    /**
     * 本地存储操作
     * @param type 存储类型 0: localStorage, 1: sessionStorage
     * @param value 存储的值，如果值为undefined表示获取${localStorageName}值，为null或者''时表示删除
     */
    storage(type: 0 | 1 = 0, value?: string) {
        if (!window) {
            // eslint-disable-next-line no-alert
            alert("您开启了秘密浏览或无痕浏览模式，请关闭!");
            return;
        }
        const storage = type === 0 ? window.localStorage : window.sessionStorage;
        if (!storage) {
            // eslint-disable-next-line no-alert
            alert("您开启了秘密浏览或无痕浏览模式，请关闭!");
            return;
        }
        if (value === undefined) {
            return storage.getItem(this.localStorageName);
        } else if (value === null || value === "") {
            storage.removeItem(this.localStorageName);
        } else {
            storage.setItem(this.localStorageName, value);
        }
    }
}

// 实例化本地存储对象
let appStorageInstance: null | AppStorage = null;

/**
 * 根据key值获取本地存储信息
 * @param key 存储业务对象key值，如果不传返回整个站点存储对象
 * @param type 存储类型默认是0, 0: localStorage, 1: sessionStorage
 */
export const getValue = function (key?: string | null, type: 0 | 1 = 0): any {
    if (!appStorageInstance) {
        appStorageInstance = new AppStorage();
    }
    // 获取本地存储内容
    const localStorageContents = appStorageInstance.storage(type);
    // 返回站点存储的对象
    let localStorageObject: Record<string, any> = {};
    if (localStorageContents) {
        try {
            localStorageObject = JSON.parse(localStorageContents);
        } catch (error) {
            logs.warn(error, localStorageContents);
        }
    }
    if (key) {
        return localStorageObject[key];
    }
    return localStorageObject;
};

/**
 * 根据key值设置本地存储信息
 * @param key 存储业务对象key值
 * @param value 存储的业务对象value值, undefined|''|null时表示删除
 */
export const setValue = function (key: string, value?: any, type: 0 | 1 = 0): void {
    const localStorageObject = getValue(undefined, type) || {};
    if (value === undefined || value === null || value === "") {
        if (Object.keys(localStorageObject).includes(key)) {
            delete localStorageObject[key];
        }
    } else {
        localStorageObject[key] = value;
    }
    appStorageInstance!.storage(type, JSON.stringify(localStorageObject));
};
