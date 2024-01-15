/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-13 13:55:10
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-15 14:20:01
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
    app.post("/system/login", function (request, response) {
        response.json(
            wrapResponse({
                "token": "@word(120)",
                "expiredIn": "@integer(3600000, 864000000)",
                "userName": "@name()",
                "email": "@email",
                "avatar|1": new Array(20).fill(0).map(() => Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5))),
                "gender|1": ["1", "2"],
                "phoneNumber": Mock.mock(/1[3456789]\d{9}/) // 手机号码
            })
        );
    });

    // 发送验证码
    app.post("/system/sendValidateCode", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 获取未读消息列表
    app.get("/system/queryUnreadMessages", function (request, response) {
        const time = new Date().getTime();
        response.json(
            wrapResponse(
                [
                    {
                        "id": "@id()",
                        "title": "@cword(4, 10)",
                        "senderAvatar|1": new Array(20).fill(0).map(() => Mock.Random.image("200x200", Mock.Random.color(), "#FFF", "png", Mock.Random.string("upper", 2, 5))),
                        "content": "@csentence(5, 200)",
                        "sendTime": "@integer(" + (time - 2 * 24 * 60 * 60 * 1000) + ", " + time + ")"
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
    app.post("/system/updateLoginPassword", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 修改当前登录用户信息
    app.post("/system/updateLoginUserInfo", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 分页查询模块列表
    app.get("/system/queryPageModuleList", function (request, response) {
        const pageNo = parseInt(request.query.pageNo || "1", 10);
        const pageSize = parseInt(request.query.pageSize || "50", 10);
        const queryList = modules.filter(item => {
            if(request.query.moduleName && !item.name.includes(request.query.moduleName) && !item.code.toLowerCase().includes(request.query.moduleName.toLowerCase())) {
                return false;
            }
            return true;
        });
        response.json(wrapResponse({
            total: queryList.length,
            rows: queryList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
        }));
    });

    // 查询模块列表
    app.get("/system/queryModuleList", function (request, response) {
        const queryList = modules.filter(item => {
            if(request.query.moduleName && item.moduleName !== request.query.moduleName) {
                return false;
            }
            if(request.query.code && !item.code === request.query.code) {
                return false;
            }
            return true;
        });
        response.json(wrapResponse(queryList));
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
        const pageNo = parseInt(request.query.pageNo || "1", 10);
        const pageSize = parseInt(request.query.pageSize || "50", 10);
        const queryList = menus.filter(item => {
            if (request.query.keyword && !item.name.includes(request.query.keyword) && !item.code.toLowerCase().includes(request.query.keyword.toLowerCase()) && !item.url?.toLowerCase().includes(request.query.keyword.toLowerCase())) {
                return false;
            }
            if (request.query.moduleCode && item.moduleCode !== request.query.moduleCode) {
                return false;
            }
            if (request.query.status && item.status !== request.query.status) {
                return false;
            }
            return true;
        });
        response.json(
            wrapResponse({
                total: queryList.length,
                rows: queryList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
            })
        );
    });

    // 查询系统菜单列表
    app.get("/system/queryMenuList", function (request, response) {
        response.json(
            wrapResponse(
                menus.filter(item => {
                    if (request.query.code && item.code !== request.query.code) {
                        return false;
                    }
                    if (request.query.name && item.name !== request.query.name) {
                        return false;
                    }
                    if (request.query.moduleCode && item.moduleCode !== request.query.moduleCode) {
                        return false;
                    }
                    if (request.query.status && item.status !== request.query.status) {
                        return false;
                    }
                    return true;
                })
            )
        );
    });

    // 根据菜单ID查询角色列表（菜单页面查询绑定的角色列表）
    app.get("/system/queryRoleListByMenuId", function (request, response) {
        const menuId = request.query.menuId;
        const roleIdList = rolesMenus.filter(item => item.menuId.includes(menuId));
        response.json(
            wrapResponse(
                roles.filter(role => roleIdList.length > 0 && roleIdList.findIndex(({ roleId }) => roleId === role.id) !== -1),
                false
            )
        );
    });

    // 新增或修改菜单
    app.post("/system/addOrUpdateMenu", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 修改菜单锁定状态信息
    app.post("/system/updateMenuLockStatus", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 删除菜单
    app.post("/system/deleteMenu", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 上传批量菜单EXCEL(批量新增菜单)
    app.post("/system/uploadMenusExcel", function (request, response) {
        setTimeout(() => {
            response.json(wrapResponse(menus, true));
        }, parseInt((Math.random() * 10 * 1000).toFixed(0), 10));
    });

    // 批量新增菜单信息
    app.post("/system/batchInsertMenus", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 分页查询角色列表
    app.get("/system/queryPageRoleList", function (request, response) {
        const pageNo = parseInt(request.query.pageNo || "1", 10);
        const pageSize = parseInt(request.query.pageSize || "50", 10);
        // const status = request.query.status ? parseInt(request.query.status, 10) : null;
        const queryList = roles.filter(item => {
            // if (request.query.code && !item.code.includes(request.query.code)) {
            //     return false;
            // }
            if (request.query.name && !item.name.includes(request.query.name) && !item.code.includes(request.query.name)) {
                return false;
            }
            if (request.query.moduleCode && item.moduleCode !== request.query.moduleCode) {
                return false;
            }
            if (request.query.status && item.status !== request.query.status) {
                return false;
            }
            return true;
        });
        response.json(
            wrapResponse({
                total: queryList.length,
                rows: queryList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
            })
        );
    });

    // 查询角色列表
    app.get("/system/queryRoleList", function (request, response) {
        const queryList = roles.filter(item => {
            if (request.query.code && item.code !== request.query.code) {
                return false;
            }
            if (request.query.name && item.name !== request.query.name) {
                return false;
            }
            if (request.query.moduleCode && item.moduleCode !== request.query.moduleCode) {
                return false;
            }
            if (request.query.status && item.status !== request.query.status) {
                return false;
            }
            return true;
        });
        response.json(
            wrapResponse(queryList)
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

    // 修改角色锁定状态信息
    app.post("/system/updateRoleLockStatus", function (request, response) {
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

    // 上传批量角色EXCEL(批量新增角色)
    app.post("/system/uploadRolesExcel", function (request, response) {
        setTimeout(() => {
            response.json(wrapResponse(roles, true));
        }, parseInt((Math.random() * 10 * 1000).toFixed(0), 10));
    });

    // 批量新增角色信息
    app.post("/system/batchInsertRoles", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 分页查询系统用户列表
    app.get("/system/queryPageUserList", function (request, response) {
        const pageNo = parseInt(request.query.pageNo || "1", 10);
        const pageSize = parseInt(request.query.pageSize || "50", 10);
        const queryList = users.filter(item => {
            if (request.query.name && !item.name.includes(request.query.name) && !item.loginName.includes(request.query.name)) {
                return false;
            }
            if (request.query.email && !item.email.includes(request.query.email)) {
                return false;
            }
            if (request.query.status && item.status !== request.query.status) {
                return false;
            }
            return true;
        });
        response.json(
            wrapResponse({
                total: queryList.length,
                rows: queryList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
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

    // 修改用户锁定状态信息
    app.post("/system/updateUserLockStatus", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 重置用户密码
    app.post("/system/resetUerPassword", function (request, response) {
        response.json(wrapResponse(null, true));
    });

    // 上传批量用户EXCEL(批量新增用户)
    app.post("/system/uploadUsersExcel", function (request, response) {
        setTimeout(() => {
            response.json(wrapResponse(users, true));
        }, parseInt((Math.random() * 10 * 1000).toFixed(0), 10));
    });

    // 批量新增用户信息
    app.post("/system/batchInsertUers", function (request, response) {
        response.json(wrapResponse(null, true));
    });
};
