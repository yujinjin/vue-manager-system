/*
 * @创建者: yujinjin9@126.com
 * @描述: 用户信息列表
 */
import Mock from "mockjs";

export default (function () {
    return new Array(Mock.Random.integer(10, 200)).fill(0).map(() => {
        return {
            id: Mock.mock("@id"),
            loginName: Mock.mock("@first"), // 登录名
            name: Mock.mock("@cname"), // 姓名
            email: Mock.mock("@email()"), // 邮箱地址
            phoneNumber: Mock.mock(/1[3456789]\d{9}/), // 手机号码
            avatar: Mock.Random.pick(new Array(20).fill(0).map(() => Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5)))),
            status: Mock.mock('@pick(["0", "1"])'), // 状态
            lastLoginTime: new Date().getTime() - Mock.Random.integer(0, 365 * 24 * 60 * 60 * 1000), // 最后登录时间
            gender: Mock.mock('@pick(["1", "2"])'), // 性别
            updated: Mock.mock("@first()"),
            updateTime: new Date().getTime() - Mock.Random.integer(0, 30 * 24 * 60 * 60 * 1000)
        };
    });
})();
