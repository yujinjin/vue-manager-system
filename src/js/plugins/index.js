/**
 * 作者：yujinjin9@126.com
 * 时间：2017-05-12
 * 描述：系统自定义插件入口
 */

import Vue from "vue";
import toastr from "./toastr";
import loading from "./loading";
import player from "./player";
import message from "./message";
import dialogPlayer from "./dialog-player";

export default function () {
	Vue.use(toastr);
	loading();
	message();
	Vue.use(player());
	Vue.use(dialogPlayer());
}
