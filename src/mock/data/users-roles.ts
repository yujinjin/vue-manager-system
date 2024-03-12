/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-07 17:17:59
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-07 17:21:03
 * @项目的路径: \vue-manager-system\src\mock\data\users-roles.ts
 * @描述: 用户角色信息列表（多对多关系）
 */
import Mock from "mockjs";
import roles from "./roles";
import users from "./users";

export default (function () {
    const usersRoles: Array<Record<string, any>> = [];
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