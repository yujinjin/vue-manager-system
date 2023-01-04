/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-14 18:27:43
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-15 11:35:28
 * @项目的路径: \vue-manager-system\mock\data\users-roles.js
 * @描述: 用户角色信息列表（多对多关系）
 */
const Mock = require("mockjs");

// 中台系统角色列表
const roles = require("./roles");
// 中台系统用户列表
const users = require("./users");

module.exports = (function () {
    const usersRoles = [];
    const roleIds = {};
    roles.forEach(role => {
        roleIds[role.id] = role.id;
    });
    users.forEach(user => {
        const randomRoleIds = Mock.mock({ ["roleIds|1-" + roles.length]: roleIds });
        Object.values(randomRoleIds.roleIds).forEach(roleId => {
            usersRoles.push({
                roleId,
                userId: user.id
            });
        });
    });
    return usersRoles;
})();
