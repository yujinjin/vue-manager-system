/*
 * @创建者: yujinjin9@126.com
 * @描述: app数据管理入口文件
 */
import { defineStore } from "pinia";

interface LocationInfo {
    /** 是否显示侧边栏 */
    isShowSideBar: boolean;
}

export default defineStore("data", {
    state: () => ({
        /* 站点临时数据*/
        locationInfo: <LocationInfo>{
            isShowSideBar: true
        },
        // 按钮操作权限
        buttonPermissions: {} as Record<string, string[]>
    }),
    actions: {
        //修改站点临时数据
        updateLocationInfo(data: Array<{ key: keyof LocationInfo; value: LocationInfo[keyof LocationInfo] }>) {
            data.forEach(item => {
                this.locationInfo[item.key] = item.value;
            });
        },
        // 批量更新当前站点临时数据
        batchUpdateLocationInfo({ key, value }: { key: keyof LocationInfo; value: LocationInfo[keyof LocationInfo] }) {
            this.locationInfo[key] = value;
        }
    }
});
