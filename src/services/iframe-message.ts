/*
 * @创建者: yujinjin9@126.com
 * @描述: 子应用和中台系统的通信框架
 */
import logs from "./logs";

// 中台系统当前页面的唯一标识
let iframeId: string;

// 回调函数集合（页面发送消息后，中台返回的结果）
const callbackFunctions: Record<string, (value: any) => any> = {};

// 接收消息
const receiveMessage = function (event: MessageEvent) {
    if (event.data.eventType === "setIframeId") {
        iframeId = event.data.value;
    } else if (event.data.eventType === "callback" && callbackFunctions[event.data.callbackId]) {
        callbackFunctions[event.data.callbackId](event.data.value);
        delete callbackFunctions[event.data.callbackId];
    }
};

// 发送消息
const sendMessage = function (data: any) {
    window.top?.postMessage(data, "*");
};

// 生成回调函数ID
const generateCallbackId = function (callback: (value: any) => any) {
    const callbackId = Date.now() + "";
    callbackFunctions[callbackId] = callback;
    return callbackId;
};

export default {
    // 初始化
    init() {
        // 接收消息
        window.addEventListener("message", receiveMessage, false);
    },
    /**
     * 打开新的tab page
     * @param url: 页面地址，title: 页面标题，pageId: 指定当前生成的tab page ID(必须唯一，可不传)
     */
    openNewTabPage({ url, title, pageId }: { url: string; title: string; pageId?: string }) {
        if (!iframeId) {
            logs.error("未获取到当前页面唯一标识，请检查框架引用时机");
            return;
        }
        sendMessage({
            eventType: "openNewTabPage",
            value: { url, title, iframeId, pageId }
        });
    },
    /**
     * 关闭当前tab page
     * @param id 指定tab page的ID，如果不传则关闭当前tab page
     * @description 怎么拿到其他tab page的ID？有个前提就是当前页面知道自己有使用openNewTabPage去打开过页面，
     * <br/> 在使用openNewTabPage方法时指定ID，或者关联的页面放sessionLocaStroage共享获取ID，这些方案都是自己的业务代码想办法实现
     * <br/> 框架不考虑这些
     */
    closeTabPage(id?: string) {
        if (!id) {
            id = iframeId;
        }
        if (!id) {
            logs.error("未获取到当前页面唯一标识，请检查框架引用时机");
            return;
        }
        sendMessage({
            eventType: "closeTabPage",
            value: id
        });
    },
    /**
     * 跳转tab page
     * @param pageId 指定tab id; callback: 回调函数，当前页面是否关闭成功
     */
    gotoTabPage({ pageId, callback }: { pageId: string; callback: (value: boolean) => void }) {
        if (!iframeId) {
            logs.error("未获取到当前页面唯一标识，请检查框架引用时机");
            return;
        }
        sendMessage({
            eventType: "gotoTabPage",
            value: { pageId, iframeId, callbackId: generateCallbackId(callback) }
        });
    },
    /**
     * 当前登录的用户token过期
     */
    loginTokenExpired() {
        if (!iframeId) {
            logs.error("未获取到当前页面唯一标识，请检查框架引用时机");
            return;
        }
        sendMessage({
            eventType: "loginTokenExpired",
            value: iframeId
        });
    },
    /**
     * 销毁
     */
    destroy() {
        window.removeEventListener("message", receiveMessage);
    }
};
