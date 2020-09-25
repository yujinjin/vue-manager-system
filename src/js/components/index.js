/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-29
 * 描述：系统自定义组件入口
 */

import Vue from "vue";
import svgIcon from "./icons";
import searchForm from "./views/search-form";
import actionBar from "./views/action-bar";
import imgUpload from "./views/img-upload";
import videoUpload from "./views/video-upload";
import webEditor from "./views/web-editor";
import viewInfo from "./views/view-info";
import formInput from "./views/form-input";
import dialogForm from "./views/dialog-form";
import dataTable from "./views/data-table";
import pageForm from "./views/page-form";

export default function() {
	Vue.component("svg-icon", svgIcon);
	Vue.component("search-form", searchForm);
	Vue.component("action-bar", actionBar);
	Vue.component("img-upload", imgUpload);
	Vue.component("video-upload", videoUpload);
	Vue.component("web-editor", webEditor);
	Vue.component("view-info", viewInfo);
	Vue.component("form-input", formInput);
	Vue.component("dialog-form", dialogForm);
	Vue.component("data-table", dataTable);
	Vue.component("page-form", pageForm);
}
