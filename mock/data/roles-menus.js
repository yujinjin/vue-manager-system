/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-14 18:26:21
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-11 11:50:36
 * @项目的路径: \vue-manager-system\mock\data\roles-menus.js
 * @描述: 角色菜单信息列表（多对多管理）
 */
const Mock = require("mockjs");
// 菜单列表
const menus = require("./menus");
// 中台系统角色列表
const roles = require("./roles");

module.exports = (function () {
    const menusRoles = [];
    const bottomMenus = {};
    menus
        .filter(menu => {
            return menus.findIndex(item => item.parentId === menu.id) === -1;
        })
        .forEach(menu => {
            if (!bottomMenus[menu.moduleCode]) {
                bottomMenus[menu.moduleCode] = [];
            }
            bottomMenus[menu.moduleCode].push(menu.id);
        });

    roles.forEach(role => {
        if (!bottomMenus[role.moduleCode]) {
            return;
        }
        const randomMenus = Mock.Random.shuffle(bottomMenus[role.moduleCode], 1, bottomMenus[role.moduleCode].length);
        menusRoles.push(...randomMenus.map(menuId => ({ menuId, roleId: role.id })));
    });
    return menusRoles;
})();
