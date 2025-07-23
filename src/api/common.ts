/**
 * 作者：yujinjin9@126.com
 * 描述：公用api 应用程序接口
 */
import request, { type RequestConfig, type HttpResponse } from "./request";

// 下载配置项
interface DownloadConfig {
    url: string; // 下载地址URL
    method?: "get" | "post"; // 请求的地址方法（post只能使用form提交）
    inputData?: Record<string, number | string | boolean>; // 请求的参数
    type: "iframe" | "form" | "a" | "open" | "blob"; // 下载使用的技术方案
    fileName?: string; // 下载下来的自定义文件名（只有a标签才有用）
}

export default {
    /**
     * 通过form表单提交数据
     * @param inputData 表单数据参数
     * @param url 请求的地址URL
     * @param method 请求的数据方法
     */
    formSubmit(inputData: Record<string, any>, url: string, method = "post") {
        const formElement = document.createElement("form");
        document.body.appendChild(formElement);
        Object.keys(inputData).forEach(key => {
            const hiddenInputElement = document.createElement("input");
            hiddenInputElement.type = "hidden";
            hiddenInputElement.name = key;
            hiddenInputElement.value = inputData[key];
            formElement.appendChild(hiddenInputElement);
        });
        formElement.enctype = "multipart/form-data";
        formElement.method = method;
        formElement.action = url;
        formElement.submit();
        document.body.removeChild(formElement);
    },

    /**
     * 文件上传
     * @param inputData 表单数据参数
     * @param url 请求的地址URL
     * @param requestConfig 请求配置参数
     */
    upload(inputData: Record<string, any>, url: string, requestConfig?: RequestConfig) {
        const formData = new FormData();
        if (inputData && typeof inputData === "object") {
            for (const key in inputData) {
                formData.append(key, inputData[key]);
            }
        }
        return request(
            Object.assign(
                {
                    url,
                    data: formData
                },
                requestConfig || {},
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
        );
    },

    /**
     * 文件下载无刷新,通过iFrame下载文件
     * @param url 下载地址URL
     * @param method 请求的地址方法（post只能使用form提交）
     * @param fileName 下载下来的自定义文件名（只有a标签才有用）
     * @param type 下载使用的技术方案
     * @param inputData 请求的参数
     */
    // download({ url = "", method = <"get" | "post">"get", type = <"iframe" | "form" | "a" | "open" | "blob">"iframe", fileName = "", inputData = <Record<string, any> | null>null } = {}) {
    async download(downloadConfig: DownloadConfig) {
        // DownloadConfig
        downloadConfig = Object.assign({ mehthod: "get", type: "iframe" }, downloadConfig);
        const iframeElement: HTMLIFrameElement = document.createElement("iframe");
        iframeElement.name = "downloadIframe" + new Date().getTime();
        iframeElement.style.display = "none";
        document.body.appendChild(iframeElement);
        if (downloadConfig.inputData && downloadConfig.method === "get") {
            const parameters: string[] = [];
            Object.keys(downloadConfig.inputData).forEach(key => {
                parameters.push(key + "=" + encodeURIComponent(String(downloadConfig.inputData![key])));
            });
            if (parameters.length > 0) {
                downloadConfig.url += (downloadConfig.url.indexOf("?") > 0 ? "&" : "?") + parameters.join("&");
            }
        }
        switch (downloadConfig.type) {
            case "iframe":
                iframeElement.src = downloadConfig.url;
                break;
            case "form": {
                const formElement: HTMLFormElement = document.createElement("form");
                formElement.method = downloadConfig.method || "post";
                if (downloadConfig.inputData && downloadConfig.method === "post") {
                    Object.keys(downloadConfig.inputData).forEach(key => {
                        const hiddenInputElement = document.createElement("input");
                        hiddenInputElement.type = "hidden";
                        hiddenInputElement.name = key;
                        hiddenInputElement.value = String(downloadConfig.inputData![key]);
                        formElement.appendChild(hiddenInputElement);
                    });
                }
                formElement.action = downloadConfig.url;
                formElement.target = iframeElement.name;
                document.body.appendChild(formElement);
                formElement.submit();
                document.body.removeChild(formElement);
                break;
            }
            case "open":
                window.open(downloadConfig.url, iframeElement.name);
                break;
            case "a": {
                const aElement = document.createElement("a");
                if (downloadConfig.fileName) {
                    aElement.setAttribute("download", downloadConfig.fileName);
                }
                aElement.setAttribute("href", downloadConfig.url);
                aElement.setAttribute("target", iframeElement.name);
                aElement.click();
                break;
            }
            case "blob": {
                const {
                    data,
                    headers: { "content-disposition": fileName }
                } = (await request({
                    url: downloadConfig.url,
                    method: downloadConfig.method,
                    data: downloadConfig.inputData,
                    responseType: "blob"
                })) as HttpResponse;
                if (!downloadConfig.fileName) {
                    if (fileName) {
                        downloadConfig.fileName = decodeURIComponent(fileName.split("filename=")[1]);
                    } else {
                        downloadConfig.fileName = new Date().getTime() + "";
                    }
                }
                const aElement = document.createElement("a");
                aElement.setAttribute("download", downloadConfig.fileName);
                aElement.setAttribute("href", window.URL.createObjectURL(data));
                aElement.setAttribute("target", iframeElement.name);
                aElement.click();
            }
        }
        iframeElement.onload = function () {
            document.body.removeChild(iframeElement);
        };
    },

    // 上传图片
    uploadImage(inputData: Record<string, any>, requestConfig?: RequestConfig) {
        return this.upload(inputData, "/common/uploadImage", requestConfig);
    }
};
