/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-12 09:47:28
 * @项目的路径: \vue-manager-system\src\components\index.ts
 * @描述: 系统自定义组件入口
 */

import { App } from "vue";
import svgIcon from "./icons";
import searchForm from "./search-form.vue";
import actionBar from "./action-bar.vue";
import dataTable from "./data-table.vue";
import searchPage from "./search-page.vue";

export default function (vueAppInstance: App) {
    vueAppInstance.component("svg-icon", svgIcon);
    vueAppInstance.component("search-form", searchForm);
    vueAppInstance.component("action-bar", actionBar);
    vueAppInstance.component("data-table", dataTable);
    vueAppInstance.component("search-page", searchPage);
}
