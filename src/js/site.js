/**
 * 作者：yujinjin9@126.com
 * 时间：2016-03-03
 * 描述：站点核心框架
 */

export default {
	config: {
		env: "", //当前编译环境
		isRunMode: true, // 当前是否是运行模式
		releaseTime: "", //发布时间
		isDebug: false, //是否是前端调试状态
		releaseTime: "2020.08.13", //发布时间
		errorImgUrl: require("@imgs/static/error.jpg"), // 默认错误图片地址
		logoImgUrl: require("@imgs/static/logo.png"), // logo图片地址
		webApiDomain: "", //web站点的接口地址
		siteDomain: "", // 服务站点地址
		uploadImgServer: "", //图片上传服务
		uploadFileServer: "", // 文件上传服务器
		resourceDomain: "", //资源服务路径
		h5ServerDomain: "", // 移动端H5服务路径
		localDomain: window.location.origin //本地站点的地址
	}
};
