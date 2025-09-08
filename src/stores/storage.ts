/*
 * @创建者: yujinjin9@126.com
 * @描述: 本地存储数据管理
 */
import { defineStore } from "pinia";
import { randomId } from "@yujinjin/utils";
import { getValue, setValue } from "@/services/local-storage";

/** 当前登录用户信息 */
interface LoginUserInfo {
    /** 登录用户号 */
    userName: string;

    /** 手机号 */
    phoneNumber: string;

    /** 邮箱 */
    email: string;

    /** 头像 */
    avatar: string;

    /** 性别 */
    gender: string;

    /** 过期时间 */
    expiredTime: number;

    /** 用户授权码 */
    authAccessCode: string;
}

export default defineStore("storage", {
    // 把本地存储放在缓存里的数据
    state: () => {
        return {
            // 页面路由数据（页面URL传参内容太大会有限制，这里临时存储到sessionStorage到另外一个页面取用）
            pageRouteDatas: getValue("pageRouteDatas", 1) || {},
            // 当前用户登录信息
            loginUserInfo: <LoginUserInfo>{
                // isLogin: false, // 是否登录
                userName: "", // 用户名
                phoneNumber: "", // 手机号
                email: "", // 邮箱
                avatar: "", // 头像
                gender: "1", // 性别
                authAccessCode: "", // 用户授权码
                expiredTime: -1 // 过期时间
            },
            // 侧边菜单栏的折叠状态
            menuCollapseState: getValue("menuCollapseState") || false
            /*****
            // 示例数据1(简单获取)
            exampleData1: getValue("exampleData1", 1) as any,
            // 示例数据3(带有过期时间，需要走getters判断)
            exampleData3: getValue("exampleData3") as any
            ****/
        };
    },
    actions: {
        // 获取页面路由数据
        getPageRouteData(id: string) {
            return JSON.parse(JSON.stringify(this.pageRouteDatas[id]));
        },
        // 存储页面路由数据, 返回一个随机ID作为唯一标识
        setPageRouteData(data: Record<string, any> | Array<Record<string, any>> | string) {
            const id = randomId();
            this.pageRouteDatas[id] = JSON.parse(JSON.stringify(data));
            setValue("pageRouteDatas", this.pageRouteDatas, 1);
            return id;
        },
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
            setValue("loginUserInfo", { userName, phoneNumber, email, avatar, gender, authAccessCode: token, expiredTime: this.loginUserInfo.expiredTime });
        },
        // 判断当前用户是否登录
        isLogin() {
            if (this.loginUserInfo.expiredTime === -1) {
                // 初始化本地登录用户信息
                const localLoginUserInfo = getValue("loginUserInfo");
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
            setValue("loginUserInfo");
        },
        // 获取固定菜单数据列表(这里不做缓存)
        getFixedMenuData(): string[] | undefined {
            return getValue("fixedMenuList");
        },
        // 设置固定菜单数据列表(这里不做缓存)
        setFixedMenuData(menuIdList?: string[]) {
            // 删除本地固定菜单数据
            setValue("fixedMenuList", menuIdList);
        },
        // 设置侧边菜单栏的本地折叠状态(取缓存状态并存储本地)
        setMenuCollapseState(isCollapse: boolean) {
            this.menuCollapseState = isCollapse;
            setValue("menuCollapseState", isCollapse);
        },
        // 获取当前进入系统引导提示信息的版本值(这里不做缓存)
        getSystemTourVersionValue(): string | undefined {
            return getValue("systemTourVersionValue");
        },
        // 设置当前进入系统引导提示信息的版本值(这里不做缓存)
        setSystemTourVersionValue(value: string) {
            setValue("systemTourVersionValue", value);
        },
        // 刷新页面的时间是否过期
        isExpireForTryReloadTime(): boolean {
            const tryReloadTime = getValue("tryReloadTime", 1);
            return !tryReloadTime || tryReloadTime < Date.now();
        },
        // 设置当前由于发版的缘故造成请求文件404问题，尝试刷新页面的时间过期时间(这里放sessionStorage，且不做缓存)
        setTryReloadTimeValue() {
            // 设置30 分钟后才可以尝试重新刷新页面
            setValue("tryReloadTime", Date.now() + 30 * 60 * 1000, 1);
        }
        /**
        // 存储示例数据1-简单存储, 如果value 为 undefined|''|null时会删除本地存储
        setExampleData1(value: any) {
            if (value === undefined) {
                value = null;
            }
            this.exampleData1 = value;
            setValue("exampleData1", value, 1);
        },
        // 示例数据1(简单获取)-勿需缓存直接获取
        getExampleData2: function () {
            logs.info("...........exampleData2");
            return getValue("exampleData2");
        },
        // 存储示例数据2-简单存储, 如果value 为 undefined|''|null时会删除本地存储
        setExampleData2(value?: any) {
            if (value === undefined) {
                value = null;
            }
            setValue("exampleData2", value);
        },
        // 获取示例数据3，判断本地存储的数据是否过期
        getExampleData3() {
            logs.info("...........exampleData3");
            if (this.exampleData3 && this.exampleData3.expiredTime > new Date().getTime()) {
                return this.exampleData3.value;
            }
            return null;
        },
        // 存储示例数据3-加入过期时间, 如果value 为 undefined|''|null时会删除本地存储
        setExampleData3(value?: any) {
            if (value === undefined || value === null || value === "") {
                setValue("exampleData3");
                this.exampleData3 = null;
            } else {
                // 这里预期存储时间为1天， 也可根据实际业务需求传参方式添加
                this.exampleData3 = { value, expiredTime: new Date().getTime() + 24 * 60 * 60 * 1000 };
                setValue("exampleData3", this.exampleData3);
            }
        },
        // 获取示例数据4，判断本地存储的数据是否过期(这里不做缓存)
        getExampleData4: function () {
            logs.info("...........exampleData4");
            const exampleData4 = getValue("exampleData4");
            if (exampleData4 && exampleData4.expiredTime > new Date().getTime()) {
                return exampleData4.value;
            }
            return null;
        },
        // 存储示例数据4-加入过期时间(这里不做缓存), 如果value 为 undefined|''|null时会删除本地存储
        setExampleData4(value?: any) {
            if (value === undefined || value === null || value === "") {
                setValue("exampleData4");
            } else {
                // 这里预期存储时间为1天， 也可根据实际业务需求传参方式添加
                setValue("setExampleData4", {
                    value,
                    expiredTime: new Date().getTime() + 24 * 60 * 60 * 1000
                });
            }
        }
        */
    }
});
