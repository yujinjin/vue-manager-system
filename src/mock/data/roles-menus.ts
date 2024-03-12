/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-07 17:08:05
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-07 17:18:46
 * @项目的路径: \vue-manager-system\src\mock\data\roles-menus.ts
 * @描述: 角色菜单信息列表（多对多管理）
 */
import Mock from "mockjs";
import menus from "./menus";
import roles from "./roles";

export default (function () {
    const menusRoles: Array<Record<string, any>> = [];
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
        // @ts-ignore
        const randomMenus = Mock.Random.shuffle(bottomMenus[role.moduleCode], 1, bottomMenus[role.moduleCode].length);

        menusRoles.push(...randomMenus.map(menuId => ({ menuId, roleId: role.id })));
    });
    return menusRoles;
})();
