/**
 * 作者：yujinjin9@126.com
 * 时间：2021-12-29
 * 描述：站点本地存储信息
 */
import { App } from "/#/app";

class AppStorage implements App.Storage {
    /** 本地存储的应用名称 */
    private localStorageName: string;

    constructor() {
        this.localStorageName = config.appName + "LocalStorage";
    }

    /**
     * 本地存储
     * @param value 本地存储的内容，不传值会直接删除
     */
    localStorage(value?: string) {
        if (!window || !window.localStorage) {
            alert("您开启了秘密浏览或无痕浏览模式，请关闭!");
            return;
        }
        if (value === undefined) {
            return window.localStorage.getItem(this.localStorageName);
        } else if (value === null || value === "") {
            window.localStorage.removeItem(this.localStorageName);
        } else {
            window.localStorage.setItem(this.localStorageName, value);
        }
    }

    /**
     * 获取站点本地存储信息
     * @param key 存储业务对象key值，如果不传返回整个站点存储对象
     */
    getSiteLocalStorage(key?: string) {
        // 获取本地存储内容
        const localStorageContents = this.localStorage();
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
        } else {
            return localStorageObject;
        }
    }

    /**
     * 设置站点本地存储信息
     * @param key 存储业务对象key值
     * @param value 存储的业务对象value值
     */
    setSiteLocalStorage(key: string, value?: any) {
        const localStorageObject = this.getSiteLocalStorage();
        if (value === undefined || value === null || value === "") {
            if (Object.keys(localStorageObject).includes(key)) {
                delete localStorageObject[key];
            }
        } else {
            localStorageObject[key] = value;
        }
        this.localStorage(JSON.stringify(localStorageObject));
    }
}

// 实例化本地存储对象
const appStorageInstance = new AppStorage();

export default {
    setUserInfo(): void {
        appStorageInstance.setSiteLocalStorage("test", 1);
    }
};
