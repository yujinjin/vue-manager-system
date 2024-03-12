/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-07 17:46:28
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-07 17:51:15
 * @项目的路径: \vue-manager-system\src\mock\common.ts
 * @描述: commom模块mock数据
 */
import Mock from "mockjs";
import wrapResponse from "./wrap-response";

export default [
    // 上传图片
    {
        url: "/common/uploadImage",
        type: "post",
        data: () => wrapResponse(Mock.Random.image(undefined, Mock.Random.color(), Mock.Random.color()))
    }
]