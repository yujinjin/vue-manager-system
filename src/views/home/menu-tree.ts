// 菜单树数据
export interface MenuTree {
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

    // 子菜单列表
    childList: Array<MenuTree>;
}
