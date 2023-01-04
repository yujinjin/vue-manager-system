/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-14 18:26:21
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-15 11:35:23
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
            return menus.find(item => item.id === menu.parentId) === -1;
        })
        .forEach(menu => {
            if (!bottomMenus[menu.moduleCode]) {
                bottomMenus[menu.moduleCode] = {};
            }
            bottomMenus[menu.moduleCode][menu.id + ""] = menu.id;
        });

    roles.forEach(role => {
        if (!bottomMenus[role.moduleCode]) {
            return;
        }
        const randomMenus = Mock.mock({ ["menus|1-" + Object.keys(bottomMenus[role.moduleCode]).length]: bottomMenus[role.moduleCode] });
        Object.values(randomMenus.menus).forEach(menuId => {
            menusRoles.push({
                menuId,
                roleId: role.id
            });
        });
    });
    return menusRoles;
})();
