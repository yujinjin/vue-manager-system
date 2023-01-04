/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-13 13:55:10
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-04 14:34:48
 * @项目的路径: \vue-manager-system\mock\system.js
 * @描述: 系统模块mock数据
 */
const Mock = require("mockjs");
const wrapResponse = require("./wrap-response");
// 菜单列表
const menus = require("./data/menus");
// 中台系统模块列表
const modules = require("./data/modules");
// 中台系统角色列表
const roles = require("./data/roles");
// 中台系统用户列表
const users = require("./data/users");
// 中台系统角色菜单列表
const rolesMenus = require("./data/roles-menus");
// 中台系统用户角色列表
const usersRoles = require("./data/users-roles");

module.exports = function (app) {
    // 登录
    app.get("/system/login", function (request, response) {
        response.json(
            wrapResponse({
                token: "@word(120)",
                expiredIn: "@integer(300000, 6000000)",
                userName: "@name()",
                email: "@email",
                "avatar|1": new Array(20).fill(0).map(() => Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5))),
                "gender|1": ["1", "2"],
                phoneNumber: Mock.mock(/1[3456789]\d{9}/) // 手机号码
            })
        );
    });

    // 发送验证码
    app.get("/system/sendValidateCode", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 获取未读消息列表
    app.get("/system/queryUnreadMessages", function (request, response) {
        const time = new Date().getTime();
        response.json(
            wrapResponse(
                [
                    {
                        id: "@id()",
                        title: "@cword(4, 10)",
                        "senderAvatar|1": new Array(20).fill(0).map(() => Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5))),
                        content: "@csentence(5, 200)",
                        sendTime: "@integer(" + (time - 2 * 24 * 60 * 60 * 1000) + ", " + time + ")"
                    }
                ],
                false,
                Mock.mock("@integer(0, 20)")
            )
        );
    });

    // 查询登录用户的菜单列表
    app.get("/system/queryLoginUserMenus", function (request, response) {
        response.json(wrapResponse(menus));
    });

    // 修改当前用户登录的密码
    app.get("/system/updateLoginPassword", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 修改当前登录用户信息
    app.get("/system/updateLoginUserInfo", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 查询模块列表
    app.get("/system/queryModulesList", function (request, response) {
        response.json(wrapResponse(modules));
    });

    // 新增或修改模块
    app.post("/system/addOrUpdateModule", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 删除模块
    app.post("/system/deleteModuleById", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 查询系统菜单列表
    app.get("/system/queryPageMenuList", function (request, response) {
        const start = parseInt(request.query.start || "0", 10);
        const length = parseInt(request.query.length || "50", 10);
        const status = request.query.status ? parseInt(request.query.status, 10) : null;
        const queryList = menus.filter(item => {
            if (request.query.code && !item.code.includes(request.query.code)) {
                return false;
            }
            if (request.query.name && !item.name.includes(request.query.name)) {
                return false;
            }
            if (request.query.moduleCode && item.moduleCode !== request.query.moduleCode) {
                return false;
            }
            if ((status || status === 0) && item.status !== status) {
                return false;
            }
            return true;
        });
        response.json(
            wrapResponse({
                total: queryList.length,
                rows: queryList.slice(start, length)
            })
        );
    });

    // 查询系统菜单列表
    app.get("/system/queryMenuList", function (request, response) {
        const status = request.query.status ? parseInt(request.query.status, 10) : null;
        response.json(
            wrapResponse(
                menus.filter(item => {
                    if (request.query.code && !item.code.includes(request.query.code)) {
                        return false;
                    }
                    if (request.query.name && !item.name.includes(request.query.name)) {
                        return false;
                    }
                    if (request.query.moduleCode && item.moduleCode !== request.query.moduleCode) {
                        return false;
                    }
                    if ((status || status === 0) && item.status !== status) {
                        return false;
                    }
                    return true;
                })
            )
        );
    });

    // 根据菜单ID查询角色列表（菜单页面查询绑定的角色列表）
    app.get("/system/queryRoleListByMenuId", function (request, response) {
        const menudId = request.query.menudId;
        response.json(
            wrapResponse(
                rolesMenus.filter(item => item.menudId === menudId),
                false
            )
        );
    });

    // 新增或修改菜单
    app.post("/system/addOrUpdateMenu", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 删除菜单
    app.post("/system/deleteMenu", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 查询角色列表
    app.get("/system/queryPageRoleList", function (request, response) {
        const start = parseInt(request.query.start || "0", 10);
        const length = parseInt(request.query.length || "50", 10);
        const status = request.query.status ? parseInt(request.query.status, 10) : null;
        const queryList = roles.filter(item => {
            if (request.query.code && !item.code.includes(request.query.code)) {
                return false;
            }
            if (request.query.name && !item.name.includes(request.query.name)) {
                return false;
            }
            if (request.query.moduleCode && item.moduleCode !== request.query.moduleCode) {
                return false;
            }
            if ((status || status === 0) && item.status !== status) {
                return false;
            }
            return true;
        });
        response.json(
            wrapResponse({
                total: queryList.length,
                rows: queryList.slice(start, length)
            })
        );
    });

    // 根据角色ID查询菜单列表
    app.get("/system/queryMenuListByRoleId", function (request, response) {
        const status = request.query.status ? parseInt(request.query.status, 10) : null;
        response.json(
            wrapResponse(
                roles.filter(item => {
                    if (request.query.code && !item.code.includes(request.query.code)) {
                        return false;
                    }
                    if (request.query.name && !item.name.includes(request.query.name)) {
                        return false;
                    }
                    if (request.query.moduleCode && item.moduleCode !== request.query.moduleCode) {
                        return false;
                    }
                    if ((status || status === 0) && item.status !== status) {
                        return false;
                    }
                    return true;
                })
            )
        );
    });

    // 根据角色ID查询菜单列表（角色页面查询绑定的菜单）
    app.get("/system/queryMenuListByRoleId", function (request, response) {
        const roleId = request.query.roleId;
        response.json(wrapResponse(rolesMenus.filter(item => item.roleId === roleId)));
    });

    // 新增或修改角色信息
    app.post("/system/addOrUpdateRole", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 删除角色
    app.post("/system/deleteRole", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 更新角色的菜单列表(角色页面绑定菜单)
    app.post("/system/updateMenusByRoleId", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 分页查询系统用户列表
    app.get("/system/queryPageUserList", function (request, response) {
        const start = parseInt(request.query.start || "0", 10);
        const length = parseInt(request.query.length || "50", 10);
        const status = request.query.status ? parseInt(request.query.status, 10) : null;
        const queryList = users.filter(item => {
            if (request.query.loginName && !item.loginName.includes(request.query.loginName)) {
                return false;
            }
            if (request.query.name && !item.name.includes(request.query.name)) {
                return false;
            }
            if (request.query.email && !item.email.includes(request.query.email)) {
                return false;
            }
            if ((status || status === 0) && item.status !== status) {
                return false;
            }
            return true;
        });
        response.json(
            wrapResponse({
                total: queryList.length,
                rows: queryList.slice(start, length)
            })
        );
    });

    // 根据用户ID查询角色列表（用户页面查询绑定角色列表）
    app.get("/system/queryRoleListByUserId", function (request, response) {
        const userId = request.query.userId;
        response.json(wrapResponse(usersRoles.filter(item => item.userId === userId)));
    });

    // 新增或修改用户信息
    app.post("/system/addOrUpdateUser", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 根据用户ID绑定角色列表（用户页面绑定角色信息）
    app.post("/system/updateRoleListByUserId", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 删除用户
    app.post("/system/deleteUser", function (request, response) {
        response.json(wrapResponse(null, true));
    });
};
