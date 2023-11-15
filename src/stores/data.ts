/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-15 17:55:29
 * @项目的路径: \vue-manager-system\src\stores\data.ts
 * @描述: app数据管理入口文件
 */
import type { App } from "/#/app";
import { defineStore } from "pinia";

export default defineStore("data", {
    state: () => ({
        /* 站点临时数据*/
        locationInfo: <App.LocationInfo>{
            isShowSideBar: true
        },
        // 按钮操作权限
        buttonPermissions: {}
    }),
    actions: {
        //修改站点临时数据
        updateLocationInfo(data: Array<{ key; value }>) {
            data.forEach(item => {
                this.locationInfo[item.key] = item.value;
            });
        },
        // 批量更新当前站点临时数据
        batchUpdateLocationInfo({ key, value }) {
            this.locationInfo[key] = value;
        }
    }
});
