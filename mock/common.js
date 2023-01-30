/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-01-18 14:26:46
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-18 14:27:17
 * @项目的路径: \vue-manager-system\mock\common.js
 * @描述: commom模块mock数据
 */
const Mock = require("mockjs");
const wrapResponse = require("./wrap-response");

module.exports = function (app) {
    // 上传图片
    app.post("/common/uploadImage", function (request, response) {
        response.json(wrapResponse(Mock.Random.image(null, Mock.Random.color(), Mock.Random.color())));
    });
};
