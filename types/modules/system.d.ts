/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-11-09 11:48:04
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-11-09 15:46:29
 * @项目的路径: \vue-manager-system\types\modules\system.d.ts
 * @描述: 系统模块功能声明
 */
declare namespace System {

    // 菜单树数据
    interface MenuTree {
        // 菜单ID
        id: string;

        // 所属父级菜单，必须是以菜单ID开头（最顶级的菜单为null）
        parentId: string | null;

        // 菜单名称
        name: string;

        // 菜单图标
        icons: string;

        // 菜单地址(如果有子菜单该数据为null)
        url: string;

        // 菜单所属业务模块CODE
        moduleCode: string;

        // 当前菜单是否已经激活
        isActive: boolean;

        // 当前菜单是否已经展开
        isOpen: boolean;

        // 子菜单列表
        childList: Array<MenuTree>;
    }
}

export { System }