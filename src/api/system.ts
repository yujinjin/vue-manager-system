/**
 * 作者：yujinjin9@126.com
 * 时间：2019-11-28
 * 描述：系统管理API接口
 */
import ajax from "./ajax";

export default {
    /**
     * 用户登录
     */
    login(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/login",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 查询登录用户的菜单列表
     */
    queryLoginUserMenus(ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/queryLoginUserMenus"
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 查询登录用户的菜单列表
     */
    queryMenuList(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/queryMenuList",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 新增菜单
     */
    addMenu(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/addMenu",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 修改菜单
     */
    updateMenu(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/updateMenu",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 删除菜单
     */
    deleteMenu(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/deleteMenu",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 查询角色列表
     */
    queryRoleList(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/queryRoleList",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 修改角色信息
     */
    updateRole(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/updateRole",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 删除角色信息
     */
    deleteRole(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/deleteRole",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 查询系统用户列表
     */
    queryUserList(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/queryUserList",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 修改用户信息
     */
    updateUser(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/updateUser",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 删除用户信息
     */
    deleteUser(inputData: Record<string, any>, ajaxOptions?) {
        return ajax(
            Object.assign(
                {
                    url: "/system/deleteUser",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    }
};
