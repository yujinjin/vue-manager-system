/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-30 14:50:24
 * @项目的路径: \vue-manager-system\src\stores\event.ts
 * @描述: app事件管理
 */
import { defineStore } from "pinia";

export default defineStore("events", {
    state: () => ({
        events: <Record<string, Array<(...args: any[]) => any>>>{},
        onceEvents: <Record<string, Array<(...args: any[]) => any>>>{}
    }),

    actions: {
        //绑定事件
        on({ eventName, callback }) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
        },
        // 只绑定一次事件
        once({ eventName, callback }) {
            if (!this.onceEvents[eventName]) {
                this.onceEvents[eventName] = [];
            }
            this.onceEvents[eventName].push(callback);
        },
        //删除事件
        off({ eventName, callback }) {
            let callbacks = this.events[eventName];
            if (callbacks) {
                callbacks.find(function (value, index) {
                    if (value === callback) {
                        callbacks.splice(index, 1);
                        return true;
                    }
                });
            }
            callbacks = this.onceEvents[eventName];
            if (callbacks) {
                callbacks.find(function (value, index) {
                    if (value === callback) {
                        callbacks.splice(index, 1);
                        return true;
                    }
                });
            }
        },
        //事件触发
        trigger({ eventName, args = [] as Array<any> }) {
            let callbacks = this.events[eventName];
            if (callbacks && callbacks.length > 0) {
                for (let i = 0; i < callbacks.length; i++) {
                    callbacks[i].apply(this, args);
                }
            }
            callbacks = this.onceEvents[eventName];
            if (callbacks && callbacks.length > 0) {
                for (let i = 0; i < callbacks.length; i++) {
                    callbacks[i].apply(this, args);
                }
                delete this.onceEvents[eventName];
            }
        }
    }
});
