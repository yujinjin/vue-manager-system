/**
 * 作者：yujinjin9@126.com
 * 时间：2019-11-28
 * 描述：系统管理API接口
 */
import request from "./request";
import { Http } from "/#/http";

export default {
    /**
     * 用户登录
     */
    login(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/login",
                    data: inputData,
                    method: "GET"
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 发送验证码
     */
    sendValidateCode(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/sendValidateCode",
                    data: inputData,
                    method: "POST"
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 获取未读消息列表
     */
    queryUnreadMessages(ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryUnreadMessages",
                    method: "GET"
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 查询登录用户的菜单列表
     */
    queryLoginUserMenus(ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryLoginUserMenus",
                    method: "GET"
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 修改当前用户登录的密码
     */
    updateLoginPassword(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/updateLoginPassword",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 修改当前登录用户的基本信息
     */
    updateLoginUserInfo(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/updateLoginUserInfo",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 查询系统模块列表
     */
    queryModulesList(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryModulesList",
                    data: inputData,
                    method: "GET"
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 新增或修改模块
     */
    addOrUpdateModule(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/addOrUpdateModule",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 删除模块
     */
    deleteModuleById(id: number, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/deleteModuleById",
                    data: { id }
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 分页查询系统菜单列表
     */
    queryPageMenuList(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryPageMenuList",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 查询系统菜单列表
     */
    queryMenuList(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryMenuList",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 新增或修改菜单
     */
    addOrUpdateMenu(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/addOrUpdateMenu",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 根据菜单ID查询角色列表（菜单页面查询绑定的角色列表）
     */
    queryRoleListByMenuId(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryRoleListByMenuId",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 删除菜单
     */
    deleteMenu(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/deleteMenu",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 分页查询角色列表
     */
    queryPageRoleList(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryPageRoleList",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 查询角色列表
     */
    queryRoleList(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryRoleList",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 根据角色ID查询菜单列表（角色页面查询绑定的菜单）
     */
    queryMenuListByRoleId(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryMenuListByRoleId",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 修改角色信息
     */
    addOrUpdateRole(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/addOrUpdateRole",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 更新角色的菜单列表(角色页面绑定菜单)
     */
    updateMenusByRoleId(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/updateMenusByRoleId",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 删除角色信息
     */
    deleteRole(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/deleteRole",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 分页查询系统用户列表
     */
    queryPageUserList(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryPageUserList",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 根据用户ID查询角色列表（用户页面查询绑定角色列表）
     */
    queryRoleListByUserId(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/queryRoleListByUserId",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 新增或修改用户信息
     */
    addOrUpdateUser(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/addOrUpdateUser",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 根据用户ID绑定角色列表（用户页面绑定角色信息）
     */
    updateRoleListByUserId(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/updateRoleListByUserId",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 删除用户信息
     */
    deleteUser(inputData: Record<string, any>, ajaxOptions?: Http.RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/system/deleteUser",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    }
};
