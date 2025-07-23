/*
 * @创建者: yujinjin9@126.com
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
];
