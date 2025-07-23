/*
 * @创建者: yujinjin9@126.com
 * @描述: 系统模块mock数据
 */

import Mock, { type MockjsRequestOptions } from "mockjs";
import wrapResponse from "./wrap-response";
import menus from "./data/menus";
import modules from "./data/modules";
import roles from "./data/roles";
import users from "./data/users";
import rolesMenus from "./data/roles-menus";
import usersRoles from "./data/users-roles";
import messages from "./data/messages";

export default [
    // 登录
    {
        url: "/system/login",
        type: "post",
        data: function () {
            return wrapResponse({
                "token": "@word(120)",
                "expiredIn": "@integer(3600000, 864000000)",
                "userName": "@name()",
                "email": "@email",
                "avatar|1": new Array(20).fill(0).map(() => Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5))),
                "gender|1": ["1", "2"],
                "phoneNumber": Mock.mock(/1[3456789]\d{9}/) // 手机号码
            });
        }
    },
    // 发送验证码
    {
        url: "/system/sendValidateCode",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 获取未读消息列表
    {
        url: "/system/queryUnreadMessages",
        type: "get",
        data: function () {
            const time = new Date().getTime();
            return wrapResponse(
                [
                    {
                        "id": "@id()",
                        "title": "@cword(4, 20)",
                        "senderAvatar|1": new Array(20).fill(0).map(() => Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5))),
                        "content": "@csentence(5, 200)",
                        "sendTime": "@integer(" + (time - 2 * 24 * 60 * 60 * 1000) + ", " + time + ")",
                        "created": "@first()"
                    }
                ],
                false,
                Mock.mock("@integer(0, 20)")
            );
        }
    },
    // 查询登录用户的菜单列表
    {
        url: "/system/queryLoginUserMenus",
        type: "get",
        data: function () {
            return wrapResponse(menus);
        }
    },
    // 修改当前用户登录的密码
    {
        url: "/system/updateLoginPassword",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 修改当前登录用户信息
    {
        url: "/system/updateLoginUserInfo",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 分页查询模块列表
    {
        url: "/system/queryPageModuleList",
        type: "",
        data: function ({ body }: MockjsRequestOptions) {
            const pageNo = parseInt(body.pageNo || "1", 10);
            const pageSize = parseInt(body.pageSize || "50", 10);
            const queryList = modules.filter(item => {
                if (body.moduleName && !item.name.includes(body.moduleName) && !item.code.toLowerCase().includes(body.moduleName.toLowerCase())) {
                    return false;
                }
                return true;
            });
            return wrapResponse({
                total: queryList.length,
                rows: queryList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
            });
        }
    },
    // 查询模块列表
    {
        url: "/system/queryModuleList",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const queryList = modules.filter(item => {
                if (body.moduleName && item.name !== body.moduleName) {
                    return false;
                }
                if (body.code && !item.code === body.code) {
                    return false;
                }
                return true;
            });
            return wrapResponse(queryList);
        }
    },
    // 新增或修改模块
    {
        url: "/system/addOrUpdateModule",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 删除模块
    {
        url: "/system/deleteModuleById",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 查询系统菜单列表
    {
        url: "/system/queryPageMenuList",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const pageNo = parseInt(body.pageNo || "1", 10);
            const pageSize = parseInt(body.pageSize || "50", 10);
            const queryList = menus.filter(item => {
                if (
                    body.keyword &&
                    !item.name.includes(body.keyword) &&
                    !item.code.toLowerCase().includes(body.keyword.toLowerCase()) &&
                    !item.url?.toLowerCase().includes(body.keyword.toLowerCase())
                ) {
                    return false;
                }
                if (body.moduleCode && body.moduleCodes.length > 0 && !body.moduleCodes.includes(item.moduleCode)) {
                    return false;
                }
                if (body.status && item.status !== body.status) {
                    return false;
                }
                return true;
            });
            return wrapResponse({
                total: queryList.length,
                rows: queryList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
            });
        }
    },
    // 查询系统菜单列表
    {
        url: "/system/queryMenuList",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            return wrapResponse(
                menus.filter(item => {
                    if (body.code && item.code !== body.code) {
                        return false;
                    }
                    if (body.name && item.name !== body.name) {
                        return false;
                    }
                    if (body.moduleCode && item.moduleCode !== body.moduleCode) {
                        return false;
                    }
                    if (body.status && item.status !== body.status) {
                        return false;
                    }
                    return true;
                })
            );
        }
    },
    // 根据菜单ID查询角色列表（菜单页面查询绑定的角色列表）
    {
        url: "/system/queryRoleListByMenuId",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const menuId = body.menuId;
            const roleIdList = rolesMenus.filter(item => item.menuId.includes(menuId));
            return wrapResponse(
                roles.filter(role => roleIdList.length > 0 && roleIdList.findIndex(({ roleId }) => roleId === role.id) !== -1),
                false
            );
        }
    },
    // 新增或修改菜单
    {
        url: "/system/addOrUpdateMenu",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 修改菜单锁定状态信息
    {
        url: "/system/updateMenuLockStatus",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 删除菜单
    {
        url: "/system/deleteMenu",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 上传批量菜单EXCEL(批量新增菜单)
    {
        url: "/system/uploadMenusExcel",
        type: "post",
        data: function () {
            return wrapResponse(menus, true);
        }
    },
    // 批量新增菜单信息
    {
        url: "/system/batchInsertMenus",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 分页查询角色列表
    {
        url: "/system/queryPageRoleList",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const pageNo = parseInt(body.pageNo || "1", 10);
            const pageSize = parseInt(body.pageSize || "50", 10);
            // const status = body.status ? parseInt(body.status, 10) : null;
            const queryList = roles.filter(item => {
                // if (body.code && !item.code.includes(body.code)) {
                //     return false;
                // }
                if (body.name && !item.name.includes(body.name) && !item.code.includes(body.name)) {
                    return false;
                }
                if (body.moduleCode && item.moduleCode !== body.moduleCode) {
                    return false;
                }
                if (body.status && item.status !== body.status) {
                    return false;
                }
                return true;
            });
            return wrapResponse({
                total: queryList.length,
                rows: queryList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
            });
        }
    },
    // 查询角色列表
    {
        url: "/system/queryRoleList",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const queryList = roles.filter(item => {
                if (body.code && item.code !== body.code) {
                    return false;
                }
                if (body.name && item.name !== body.name) {
                    return false;
                }
                if (body.moduleCode && item.moduleCode !== body.moduleCode) {
                    return false;
                }
                if (body.status && item.status !== body.status) {
                    return false;
                }
                return true;
            });
            return wrapResponse(queryList);
        }
    },
    // 根据角色ID查询菜单列表（角色页面查询绑定的菜单）
    {
        url: "/system/queryMenuListByRoleId",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const roleId = body.roleId;
            return wrapResponse(rolesMenus.filter(item => item.roleId === roleId));
        }
    },
    // 新增或修改角色信息
    {
        url: "/system/addOrUpdateRole",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 修改角色锁定状态信息
    {
        url: "/system/updateRoleLockStatus",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 删除角色
    {
        url: "/system/deleteRole",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 更新角色的菜单列表(角色页面绑定菜单)
    {
        url: "/system/updateMenusByRoleId",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 上传批量角色EXCEL(批量新增角色)
    {
        url: "/system/uploadRolesExcel",
        type: "post",
        data: function () {
            return wrapResponse(roles, true);
        }
    },
    // 批量新增角色信息
    {
        url: "/system/batchInsertRoles",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 分页查询系统用户列表
    {
        url: "/system/queryPageUserList",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const pageNo = parseInt(body.pageNo || "1", 10);
            const pageSize = parseInt(body.pageSize || "50", 10);
            const queryList = users.filter(item => {
                if (body.name && !item.name.includes(body.name) && !item.loginName.includes(body.name)) {
                    return false;
                }
                if (body.email && !item.email.includes(body.email)) {
                    return false;
                }
                if (body.status && item.status !== body.status) {
                    return false;
                }
                return true;
            });
            return wrapResponse({
                total: queryList.length,
                rows: queryList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
            });
        }
    },
    // 根据用户ID查询角色列表（用户页面查询绑定角色列表）
    {
        url: "/system/queryRoleListByUserId",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const userId = body.userId;
            return wrapResponse(usersRoles.filter(item => item.userId === userId));
        }
    },
    // 新增或修改用户信息
    {
        url: "/system/addOrUpdateUser",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 根据用户ID绑定角色列表（用户页面绑定角色信息）
    {
        url: "/system/updateRoleListByUserId",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 删除用户
    {
        url: "/system/deleteUser",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 修改用户锁定状态信息
    {
        url: "/system/updateUserLockStatus",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 重置用户密码
    {
        url: "/system/resetUerPassword",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 上传批量用户EXCEL(批量新增用户)
    {
        url: "/system/uploadUsersExcel",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 批量新增用户信息
    {
        url: "/system/batchInsertUers",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    },
    // 分页查询站内信列表（创建的数量）
    {
        url: "/system/queryPageMessageList",
        type: "get",
        data: function ({ body }: MockjsRequestOptions) {
            const pageNo = parseInt(body.pageNo || "1", 10);
            const pageSize = parseInt(body.pageSize || "50", 10);
            const queryList = messages.filter(item => {
                if (body.keyword && !item.title.includes(body.keyword) && !item.content.includes(body.keyword)) {
                    return false;
                }
                if (body.moduleCode && item.moduleCode !== body.moduleCode) {
                    return false;
                }
                return true;
            });
            return wrapResponse({
                total: queryList.length,
                rows: queryList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
            });
        }
    },
    // 发送站内信
    {
        url: "/system/sendMessage",
        type: "post",
        data: function () {
            return wrapResponse(null, true);
        }
    }
];
