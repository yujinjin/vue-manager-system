/**
 * 作者：yujinjin9@126.com
 * 时间：2020-09-08
 * 描述：弹窗插件
 */
import Vue from "vue";
import dialogPlayer from "./views/dialog-player";

export default (function () {
	let DialogPlayerConstructor = Vue.extend(dialogPlayer);
	let dialogPlayerInstance = null;

	//创建实例
	const createInstance = function (options) {
		dialogPlayerInstance = new DialogPlayerConstructor({
			el: document.createElement("div"),
			data: options
		});
		dialogPlayerInstance.onClose = function () {
			dialogPlayerInstance.$el.parentNode.removeChild(dialogPlayerInstance.$el);
			if (dialogPlayerInstance) {
				dialogPlayerInstance = null;
			}
		};
		return dialogPlayerInstance;
	};

	return {
		install(Vue) {
			site = site || {};
			site.dialogPlayer = Vue.prototype.$dialogPlayer = function (options) {
				if (!dialogPlayerInstance) {
					createInstance(options);
					document.body.appendChild(dialogPlayerInstance.$el);
				} else if (options) {
					for (let key in options) {
						dialogPlayerInstance[key] = options[key];
					}
				}
			};
		}
	};
});
