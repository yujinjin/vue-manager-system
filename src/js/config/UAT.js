/**
 * 作者：yujinjin9@126.com
 * 时间：2016-03-07
 * 描述：uat 外部接口配置文件
 */
module.exports = {
	//当前环境
	env: "UAT",
	//web站点的接口地址
	webApiDomain: "",
	// 服务站点地址
	siteDomain: "",
	//图片上传服务
	uploadImgServer: "",
	// 文件上传服务器
	uploadFileServer: "",
	//资源服务路径
	resourceDomain: "",
	//移动端H5服务路径
	h5ServerDomain: "",
	//本地站点的地址
	localDomain: window.location.origin
};
