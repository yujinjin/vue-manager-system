/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-03 17:14:51
 * @项目的路径: \vue-manager-system\src\components\index.ts
 * @描述: 系统自定义组件入口
 */

import { App } from "vue";
import svgIcon from "./icons";
import imgUpload from "./img-upload.vue";
import webEditor from "./web-editor.vue";
import inputForm from "./input-form.vue";
import searchForm from "./search-form.vue";
import actionBar from "./action-bar.vue";
import dataTable from "./data-table.vue";
import searchPage from "./search-page.vue";
import dialogForm from "./dialog-form.vue";

export default function (vueAppInstance: App) {
    vueAppInstance.component("img-upload", imgUpload);
    vueAppInstance.component("svg-icon", svgIcon);
    vueAppInstance.component("web-editor", webEditor);
    vueAppInstance.component("input-form", inputForm);
    vueAppInstance.component("search-form", searchForm);
    vueAppInstance.component("action-bar", actionBar);
    vueAppInstance.component("data-table", dataTable);
    vueAppInstance.component("search-page", searchPage);
    vueAppInstance.component("dialog-form", dialogForm);
}
