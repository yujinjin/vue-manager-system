/**
 * 作者：yujinjin9@126.com
 * 时间：2021-12-30
 * app事件管理
 */
export default {
    state: {
        events: <Record<string, Array<Function>>>{},
        onceEvents: <Record<string, Array<Function>>>{}
    },

    mutations: {
        on(state, { eventName, callback }) {
            if (!state.events[eventName]) {
                state.events[eventName] = [];
            }
            state.events[eventName].push(callback);
        },
        // 只绑定一次事件
        once(state, { eventName, callback }) {
            if (!state.onceEvents[eventName]) {
                state.onceEvents[eventName] = [];
            }
            state.onceEvents[eventName].push(callback);
        },
        off(state, { eventName, callback }) {
            let callbacks = state.events[eventName];
            if (callbacks) {
                callbacks.find(function (value, index) {
                    if (value === callback) {
                        callbacks.splice(index, 1);
                        return true;
                    }
                });
            }
            callbacks = state.onceEvents[eventName];
            if (callbacks) {
                callbacks.find(function (value, index) {
                    if (value === callback) {
                        callbacks.splice(index, 1);
                        return true;
                    }
                });
            }
        },

        trigger(state, { eventName, args }) {
            let callbacks = state.events[eventName];
            if (callbacks && callbacks.length > 0) {
                for (let i = 0; i < callbacks.length; i++) {
                    callbacks[i].apply(this, args);
                }
            }
            callbacks = state.onceEvents[eventName];
            if (callbacks && callbacks.length > 0) {
                for (let i = 0; i < callbacks.length; i++) {
                    callbacks[i].apply(this, args);
                }
                delete state.onceEvents[eventName];
            }
        }
    },

    actions: {
        //绑定事件
        on({ commit }, { eventName, callback }) {
            if (!eventName || typeof callback !== "function") {
                logs.debug("错误的参数，不能绑定事件!");
                return;
            }
            commit("on", { eventName, callback });
        },

        //删除事件
        off({ commit }, { eventName, callback }) {
            if (!eventName || typeof callback !== "function") {
                logs.debug("错误的参数，不能消除事件!");
                return;
            }
            commit("off", { eventName, callback });
        },

        //事件触发
        trigger({ commit }, { eventName, args }) {
            if (!eventName) {
                logs.debug("错误的参数，不能触发该事件!");
                return;
            }
            commit("trigger", { eventName, args });
        }
    }
};
