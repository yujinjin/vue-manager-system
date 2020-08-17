/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-29
 * 描述：系统自定义组件入口
 */

import Vue from "vue";
import svgIcon from "./icons";

export default function() {
	Vue.component("svg-icon", svgIcon);
}