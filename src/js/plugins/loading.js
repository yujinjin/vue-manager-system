/**
 * 作者：yujinjin9@126.com
 * 时间：2020-08-12
 * 描述：封装第三方加载插件，由于Loading的加载是单例的，所以这里要做到如果被多次调用显示，以最后一次的close才真正关闭
 */
import { Loading } from "element-ui";

export default function () {
	site = site || {};
	let loadingInstance = null;
	let showTimes = 0;
	site.showLoading = function (options) {
		++showTimes;
		loadingInstance = Loading.service(Object.assign({}, options || {}, { target: ".page-body" }));
	};

	site.hideLoading = function () {
		--showTimes;
		if (loadingInstance && showTimes == 0) {
			loadingInstance.close();
		}
	};
}
