/**
 * 作者：yujinjin9@126.com
 * 时间：2018-07-15
 * 描述：svg文件
 */

import svgIcon from "./svg-icon.vue";
// 加载所有svg文件
let svgs = require.context("./svg", true, /\.svg$/);
// 生成所有的svg样式
(function(requireContext) {
	return requireContext.keys().map(requireContext);
})(svgs);
export default svgIcon;
