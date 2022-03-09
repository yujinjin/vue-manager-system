/**
 * 作者：yujinjin9@126.com
 * 时间：2022-02-24
 * 描述：系统自定义组件入口
 */

import { App } from "vue";
import svgIcon from "./icons";

export default function (vueAppInstance: App) {
    vueAppInstance.component("svg-icon", svgIcon);
}
