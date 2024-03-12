/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-06 16:41:20
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-07 15:10:39
 * @项目的路径: \vue-manager-system\mock\test.js
 * @描述: 测试mock接口数据
 */

import Mock from "mockjs";
import wrapResponse from "./wrap-response"

// 设置拦截ajax请求的响应时间
Mock.setup({
    timeout: "10-10000"
});

Mock.mock("http://10.96.144.203:8081/demo/addOrder", "post", function (options) {
    console.info("options>>>>>>>>>>>>>>>", options);
    return wrapResponse(null, true);
})

console.info("loaded>>>>>>>>>>>>>>>>mock.test.js");

export default {}