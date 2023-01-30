/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-17 17:26:30
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-18 14:27:47
 * @项目的路径: \vue-manager-system\mock\index.js
 * @描述: dev server mock数据
 */
const common = require("./common");
const system = require("./system");
const demo = require("./demo");

module.exports = function (app) {
    common(app);
    system(app);
    demo(app);
};
