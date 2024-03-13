/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-12 14:23:14
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-13 10:59:11
 * @项目的路径: \vue-manager-system\src\mock\index.ts
 * @描述: dev server mock数据
 */
import Mock from "mockjs";
import common from "./common";
import demo from "./demo";
import system from "./system";

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
        return mockItem.data({ body });
    });
});
