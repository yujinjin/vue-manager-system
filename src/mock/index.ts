/*
 * @创建者: yujinjin9@126.com
 * @描述: dev server mock数据
 */
import Mock, { type MockjsRequestOptions } from "mockjs";
import common from "./common";
import demo from "./demo";
import system from "./system";
import config from "@/config";

[...common, ...demo, ...system].forEach(mockItem => {
    Mock.mock(RegExp(config.webApiDomain + mockItem.url + "(\\?(\\w+=.*)+)?$"), mockItem.type, function ({ body, type, url }) {
        if (type.toLowerCase() === "get") {
            body = body || {};
            url = url.substring(url.lastIndexOf("?") + 1);
            url.split("&").forEach(param => {
                if (!param) {
                    return;
                }
                body[param.split("=")[0]] = decodeURIComponent(param.split("=")[1] || "");
            });
        }
        return mockItem.data({ body } as MockjsRequestOptions);
    });
});
