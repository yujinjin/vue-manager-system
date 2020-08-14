/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-04
 * 描述：常用API接口
 */
export default {
	//图片上传
	imageUpload: function(ajaxOptions, inputData) {
		let formData = new FormData();
		if (inputData && typeof inputData === "object") {
			for (let key in inputData) {
				formData.append(key, inputData[key]);
			}
		}
		return site.ajax.axios.post(
			config.uploadImgServer,
			formData,
			Object.assign(
				{
					headers: {
						"Content-Type": "multipart/form-data"
					}
				},
				ajaxOptions
			)
		);
	}
};
