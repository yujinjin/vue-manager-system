/**
 * 作者：yujinjin9@126.com
 * 时间：2017-02-07
 * 描述：自定义指令
 */
//  bind: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
//  inserted: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
//  update: 被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新（详细的钩子函数参数见下）。
//  componentUpdated: 被绑定元素所在模板完成一次更新周期时调用。
//  unbind: 只调用一次， 指令与元素解绑时调用。
import store from "@js/store/";

export default {
	focus: {
		inserted: function (el, { value, arg }) {
			if (value === true || value === "true" || value === arg) {
				el.focus();
			}
		},
		update: function (el, { value, arg }) {
			if (el.tagName != "INPUT") {
				// 判断当前元素是否有包含input表单
				el = el.querySelector("input");
			}
			if (value === true || value === "true" || value === arg) {
				el.focus();
			}
		}
	},

	// 用户操作权限指令
	permission: function (el, binding) {
		let permissionValue = binding.arg || binding.value;
		if (permissionValue) {
			permissionValue = permissionValue.replace(/-/g, ".");
		}
		if (permissionValue && store.state.datapermissions && store.state.datapermissions.length > 0 && store.state.datapermissions.findIndex(c => c.toLocaleLowerCase() === permissionValue.toLocaleLowerCase()) === -1) {
			el.style.display = "none";
		}
	}
};
