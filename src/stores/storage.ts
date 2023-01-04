/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-05 16:24:22
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-15 17:55:05
 * @项目的路径: \vue-manager-system\src\stores\storage.ts
 * @描述: 本地存储数据管理
 */
import { App } from "/#/app";
import { defineStore } from "pinia";
import localStorage from "@/services/local-storage";

export default defineStore("storage", {
    // 把本地存储放在缓存里的数据
    state: () => {
        return {
            loginUserInfo: <App.LoginUserInfo>{
                // isLogin: false, // 是否登录
                userName: "", // 用户名
                phoneNumber: "", // 手机号
                email: "", // 邮箱
                avatar: "", // 头像
                gender: "1", // 性别
                authAccessCode: "", // 用户授权码
                expiredTime: -1 // 过期时间
            },
            // 示例数据1(简单获取)
            exampleData1: localStorage.getValue(1, "exampleData1") as any,
            // 示例数据3(带有过期时间，需要走getters判断)
            exampleData3: localStorage.getValue(0, "exampleData3") as any
        };
    },
    actions: {
        // 用户登录信息
        login({
            userName,
            phoneNumber,
            email,
            avatar,
            gender,
            token,
            expiredIn
        }: {
            userName: string;
            phoneNumber: string;
            email: string;
            avatar: string;
            gender: string;
            token: string;
            expiredIn: number;
        }) {
            // this.loginUserInfo.isLogin = true;
            this.loginUserInfo.userName = userName;
            this.loginUserInfo.phoneNumber = phoneNumber;
            this.loginUserInfo.email = email;
            this.loginUserInfo.avatar = avatar;
            this.loginUserInfo.gender = gender;
            this.loginUserInfo.authAccessCode = token;
            this.loginUserInfo.expiredTime = new Date().getTime() + expiredIn;
            localStorage.setValue(0, "loginUserInfo", { userName, phoneNumber, email, avatar, gender, authAccessCode: token, expiredTime: this.loginUserInfo.expiredTime });
        },
        // 判断当前用户是否登录
        isLogin() {
            if (this.loginUserInfo.expiredTime === -1) {
                // 初始化本地登录用户信息
                const localLoginUserInfo = localStorage.getValue(0, "loginUserInfo");
                if (!localLoginUserInfo || localLoginUserInfo.expiredTime < new Date().getTime()) {
                    this.loginUserInfo.expiredTime = 0;
                } else {
                    this.loginUserInfo.userName = localLoginUserInfo.userName;
                    this.loginUserInfo.phoneNumber = localLoginUserInfo.phoneNumber;
                    this.loginUserInfo.email = localLoginUserInfo.email;
                    this.loginUserInfo.avatar = localLoginUserInfo.avatar;
                    this.loginUserInfo.gender = localLoginUserInfo.gender;
                    this.loginUserInfo.authAccessCode = localLoginUserInfo.authAccessCode;
                    this.loginUserInfo.expiredTime = localLoginUserInfo.expiredTime;
                }
            }
            return this.loginUserInfo.expiredTime > 0 && this.loginUserInfo.expiredTime > new Date().getTime();
        },
        // 用户退出
        logout() {
            this.loginUserInfo.userName = "";
            this.loginUserInfo.phoneNumber = "";
            this.loginUserInfo.email = "";
            this.loginUserInfo.avatar = "";
            this.loginUserInfo.gender = "";
            this.loginUserInfo.authAccessCode = "";
            this.loginUserInfo.expiredTime = 0;
            localStorage.setValue(0, "loginUserInfo", null);
        },
        // 存储示例数据1-简单存储, 如果value 为 undefined|''|null时会删除本地存储
        setExampleData1(value: any) {
            if (value === undefined) {
                value = null;
            }
            this.exampleData1 = value;
            localStorage.setValue(1, "exampleData1", value);
        },
        // 示例数据1(简单获取)-勿需缓存直接获取
        getExampleData2: function () {
            console.info("...........exampleData2");
            return localStorage.getValue(0, "exampleData2");
        },
        // 存储示例数据2-简单存储, 如果value 为 undefined|''|null时会删除本地存储
        setExampleData2(value) {
            if (value === undefined) {
                value = null;
            }
            localStorage.setValue(0, "exampleData2", value);
        },
        // 获取示例数据3，判断本地存储的数据是否过期
        getExampleData3() {
            console.info("...........exampleData3");
            if (this.exampleData3 && this.exampleData3.expiredTime > new Date().getTime()) {
                return this.exampleData3.value;
            }
            return null;
        },
        // 存储示例数据3-加入过期时间, 如果value 为 undefined|''|null时会删除本地存储
        setExampleData3(value) {
            if (value === undefined || value === null || value === "") {
                localStorage.setValue(0, "exampleData3");
                this.exampleData3 = null;
            } else {
                // 这里预期存储时间为1天， 也可根据实际业务需求传参方式添加
                this.exampleData3 = { value, expiredTime: new Date().getTime() + 24 * 60 * 60 * 1000 };
                localStorage.setValue(0, "exampleData3", this.exampleData3);
            }
        },
        // 获取示例数据4，判断本地存储的数据是否过期(这里不做缓存)
        getExampleData4: function () {
            console.info("...........exampleData4");
            const exampleData4 = localStorage.getValue(0, "exampleData4");
            if (exampleData4 && exampleData4.expiredTime > new Date().getTime()) {
                return exampleData4.value;
            }
            return null;
        },
        // 存储示例数据4-加入过期时间(这里不做缓存), 如果value 为 undefined|''|null时会删除本地存储
        setExampleData4(value) {
            if (value === undefined || value === null || value === "") {
                localStorage.setValue(0, "exampleData4");
            } else {
                // 这里预期存储时间为1天， 也可根据实际业务需求传参方式添加
                localStorage.setValue(0, "setExampleData4", {
                    value,
                    expiredTime: new Date().getTime() + 24 * 60 * 60 * 1000
                });
            }
        }
    }
});
