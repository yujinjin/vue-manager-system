/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-29
 * 描述：系统自定义组件入口
 */

import Vue from "vue";
import svgIcon from "./icons";
import searchForm from "./views/search-form";
import actionBar from "./views/action-bar";

export default function() {
	Vue.component("svg-icon", svgIcon);
	Vue.component("search-form", searchForm);
	Vue.component("action-bar", actionBar);
}
