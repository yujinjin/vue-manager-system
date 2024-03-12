/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-07 16:27:49
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-07 17:07:42
 * @项目的路径: \vue-manager-system\src\mock\data\messages.ts
 * @描述: 站内信列表
 */
import Mock from "mockjs";
import modules from "./modules";
import roles from "./roles";

export default (function () {
    return new Array(Mock.Random.integer(10, 200)).fill(0).map(() => {
        return Mock.mock({
            "id": "@id",
            "title": "@ctitle", // 标题
            "content": "@cparagraph", // 内容
            "moduleCode": Mock.mock("@boolean(1, 4, false)") ? Mock.Random.pick(modules.map(item => item.code)) : null, // 所属模块
            "roles": function () {
                if(this.moduleCode) {
                    const moduleList = roles.filter(item => item.moduleCode === this.moduleCode).map(item => item.code);
                    // @ts-ignore
                    return Mock.Random.shuffle(moduleList, 0, moduleList.length).join(",");
                } 
                return null;
            },
            "status": "@pick([\"0\", \"1\", \"2\"])", // 状态
            "estimateSendNumber|0-1000": 0, // 预计发送数量
            "realSendNumber|0-1000": 0, // 实际发送数量
            "created": "@first()",
            "createTime": new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
        });
    });
})();
