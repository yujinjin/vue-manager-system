/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-04
 * 描述：常用API接口
 */
export default {
	//图片上传
	imageUpload: function(inputData, ajaxOptions) {
		let formData = new FormData();
		if (inputData && typeof inputData === "object") {
			for (let key in inputData) {
				formData.append(key, inputData[key]);
			}
		}
		return site.ajax.axios.post(
			// config.uploadImgServer,
			"https://resource.jk724.com/Uploader/UploadImage",
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
	},

	sendValidateCode(ajaxOptions) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, 500);
		});
	}
};
