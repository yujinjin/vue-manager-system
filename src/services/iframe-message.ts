/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-12-20 17:47:33
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-12-26 09:51:31
 * @项目的路径: \vue-manager-system\src\services\iframe-message.ts
 * @描述: 子应用和中台系统的通信框架
 */
let iframeId: string;

// 接收消息
const receiveMessage = function (event: MessageEvent) {
    if (event.data.eventType === "setIframeId") {
        iframeId = event.data.value;
    }
};

// 发送消息
const sendMessage = function (data: any) {
    window.top?.postMessage(data, "*");
};

export default {
    init() {
        // 接收消息
        window.addEventListener("message", receiveMessage, false);
    },
    /**
     * 打开新的tab page
     * @param url: 页面地址，title: 页面标题，pageId: 指定当前生成的tab page ID(必须唯一，可不传)
     */ 
    openNewTabPage({ url, title, pageId }: { url: string; title: string; pageId?: string }) {
        if(!iframeId) {
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
        if(!id) {
            id = iframeId;
        }
        if(!id) {
            logs.error("未获取到当前页面唯一标识，请检查框架引用时机");
            return;
        }
        sendMessage({
            eventType: "closeTabPage",
            value: id
        });
    },
    destroy() {
        window.removeEventListener("message", receiveMessage);
    }
};
