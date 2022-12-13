import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

/**
 * ajax 请求
 */
declare namespace Http {
    // 请求配置项
    interface RequestConfig extends AxiosRequestConfig {
        // 是否让框架自动显示错误提示信息
        isShowError?: boolean;

        // 是否处理返回的response数据，默认系统框架会处理数据
        isResultData?: boolean;

        // 是否显示loading加载
        isShowLoading?: boolean;

        // 延迟加载定时器ID
        showLoadingTimerId?: number;
    }

    // 请求接口返回的错误
    interface ResponseError {
        message?: string; // 返回的错误消息
        details?: any; // 返回详细错误消息对象
    }

    // 请求接口返回的结果数据
    interface ResponseData<T = any> {
        success: boolean;
        code?: string;
        error?: ResponseError;
        data: T;
    }

    // 请求接口响应返回数据
    interface Response<T = any> extends AxiosResponse {
        config: RequestConfig;
        data: ResponseData<T>;
    }

    // 异常失败
    interface Error extends AxiosError {
        config: RequestConfig;
        response?: Response;
    }

    // 下载配置项
    interface DownloadConfig {
        url: string; // 下载地址URL
        method: "get" | "post"; // 请求的地址方法（post只能使用form提交）
        inputData?: Record<string, number | string | boolean>; // 请求的参数
        type: "iframe" | "form" | "a" | "open" | "blob"; // 下载使用的技术方案
        fileName?: string; // 下载下来的自定义文件名（只有a标签才有用）
    }
}
