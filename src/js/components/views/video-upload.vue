<template>
	<!-- 视频上传 -->
	<div class="video-upload">
		<div class="el-upload el-upload--picture">
			<el-button @click="handleClick" size="small" type="primary">选取文件</el-button>
			<el-button style="margin-left: 10px;" size="small" type="success" @click="submit" :disabled="isUploading">上传到服务器</el-button>
			<input ref="input" :accept="accept" @change="handChange($event)" class="el-upload__input" type="file" name="file" :multiple="isMultiple" />
		</div>
		<div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过{{ videoMaxSize }}MB</div>
		<transition-group tag="ul" :class="['el-upload-list', 'el-upload-list--text']" name="el-list">
			<li v-for="file in fileList" :class="['el-upload-list__item', 'is-' + file.status]" :key="file.uid">
				<a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{ file.name }}</a>
				<label class="el-upload-list__item-status-label">
					<i class="el-icon-upload-success el-icon-circle-check"></i>
				</label>
				<i class="el-icon-close" @click="handleRemove(file)"></i>
				<el-progress v-if="file.status === 'uploading'" type="line" :stroke-width="2" :percentage="file.percentage | parsePercentage"> </el-progress>
			</li>
		</transition-group>
	</div>
</template>
<script>
import OSS from "@js/lib/aliyun/aliyun-oss-sdk-5.3.1.min";
import "@js/lib/aliyun/aliyun-upload-sdk-1.5.0.min.js";

export default {
	data() {
		return {
			//阿里云sdk实例
			uploaderInstance: null,
			//上传的文件队列
			fileList: [],
			isMultiple: false,
			isSingle: false // 是否单独一个视频上传
		};
	},
	props: {
		//支持上传的视频文件类型
		accept: {
			default: "video/mp4,audio/mp4",
			type: String
		},
		value: Array,
		// 文件最大尺寸(单位:MB)
		videoMaxSize: {
			type: Number,
			default: 500
		},
		limit: {
			type: Number,
			default: 1
		},
		videoIdKey: {
			type: String,
			default: "videoId"
		},
		nameKey: {
			type: String,
			default: "title"
		}
	},
	watch: {
		value(val) {
			this.generateFileList();
		}
	},
	filters: {
		parsePercentage(val) {
			return parseInt(val, 10);
		}
	},
	computed: {
		isUploading() {
			if (!this.fileList || this.fileList.length == 0) {
				return false;
			}
			return this.fileList.findIndex(file => file.status == "uploading") != -1;
		}
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			if (this.limit > 1) {
				this.isSingle = false;
			} else {
				this.isSingle = true;
			}
			this.initSDK();
			this.generateFileList();
		},
		initSDK() {
			window.OSS = OSS;
			this.uploaderInstance = new AliyunUpload.Vod({
				// 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
				region: "cn-shanghai",
				// 阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
				userId: "1789125535642956",
				//分片大小默认1M，不能小于100K
				partSize: 1048576,
				//并行上传分片个数，默认5
				parallel: 5,
				//网络原因失败时，重新上传次数，默认为3
				retryCount: 3,
				//网络原因失败时，重新上传间隔时间，默认为2秒
				retryDuration: 2,
				// 文件上传失败
				onUploadFailed: (uploadInfo, code, message) => {
					site.log.debug("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
					//更新文件状态
					this.getFile(uploadInfo.file).status = "fail";
				},
				// 文件上传完成
				onUploadSucceed: uploadInfo => {
					site.log.debug("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
					//更新文件状态
					this.getFile(uploadInfo.file).status = "success";
					this.$emit(
						"on-change",
						this.fileList.filter(file => file.status == "success")
					);
				},
				// 文件上传进度
				onUploadProgress: (uploadInfo, totalSize, uploadedSize) => {
					site.log.debug("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil((uploadedSize * 100) / totalSize) + "%");
					//更新文件状态
					this.getFile(uploadInfo.file).status = "uploading";
					//更新上传进度
					this.getFile(uploadInfo.file).percentage = Math.ceil((uploadedSize * 100) / totalSize);
				},
				// 开始上传
				onUploadstarted: uploadInfo => {
					site.log.debug("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket);
					const file = this.getFile(uploadInfo.file);
					this.uploaderInstance.setUploadAuthAndAddress(uploadInfo, file.uploadAuth, file.uploadAddress, file.videoId);
				}
			});
		},
		generateFileList() {
			if (!this.value || this.value.length == 0) {
				this.fileList = [];
				return;
			}
			const fileMap = new Map();
			this.fileList.forEach(file => {
				fileMap.set(file["videoId"], file);
			});
			let fileList = [];
			this.value.forEach(file => {
				if (fileMap.has(file[this.videoIdKey])) {
					fileMap.get(file[this.videoIdKey]).name = file[this.nameKey];
				} else {
					file = {
						//阿里云授权返回的视频唯一标识
						videoId: file[this.videoIdKey],
						//文件唯一标志
						uid: site.utils.generateGuid(),
						//文件状态 ready uploading  success  fail
						status: "success",
						//文件上传进度 0 － 100
						percentage: 100,
						//标题
						name: file[this.nameKey],
						//未加工的文件
						raw: null
					};
					fileMap.set(file[this.videoIdKey], file);
				}
				fileList.push(fileMap.get(file[this.videoIdKey]));
			});
			this.fileList = fileList;
		},
		handleClick() {
			if (!this.isUploading) {
				this.$refs.input.click();
			}
		},
		//选择文件
		handChange(e) {
			const files = e.target.files;
			if (!files) return;
			let fileList = [];
			for (let fileItem of files) {
				if (fileItem.size / (1024 * 1024) > this.videoMaxSize) {
					this.$message.error("上传的视频文件最大不能超过" + this.videoMaxSize + "MB");
					return;
				}
				//包裹一层加入队列
				fileList.push({
					videoId: null,
					//文件唯一标志
					uid: site.utils.generateGuid(),
					//文件状态 ready uploading  success  fail
					status: "ready",
					//文件上传进度 0 － 100
					percentage: 0,
					//文件名称
					name: fileItem.name,
					//未加工的文件
					raw: fileItem
				});
			}
			this.fileList.push(...fileList);
			if (this.isSingle && this.fileList.length > 1) {
				this.fileList = [this.fileList.pop()];
			}
		},
		//删除已选文件
		handleRemove(file) {
			if (file) {
				file = this.getFile(file);
			}
			this.fileList.splice(this.fileList.indexOf(file), 1);
			if (file.status == "success") {
				this.$emit("on-change", file, fileList);
			}
		},
		//根据uid获取到队列中的某个文件
		getFile(file) {
			this.fileList.find(item => {
				if (file === item.raw) {
					file = item;
					return true;
				}
				return false;
			});
			return file;
		},
		//上传
		submit() {
			if (this.isUploading) {
				this.$message.error("正在上传的视频文件，请稍后!");
				return;
			}
			let promiseArr = [];
			let userData = {
				Vod: {
					UserData: {
						IsShowWaterMark: "false",
						Priority: "7"
					}
				}
			};
			//批量获取未上传文件的授权
			this.fileList.forEach(file => {
				if (file.status === "ready") {
					promiseArr.push(
						site.api.common
							.getAuthForVideoUpload({
								fileName: file.raw.name,
								title: file.name
							})
							.then(data => {
								file["videoId"] = data.videoId;
								//授权信息存储到源文件对象上
								file["videoId"] = data.videoId;
								file["uploadAuth"] = data.uploadAuth;
								file["uploadAddress"] = data.uploadAddress;
								//将源文件加入阿里云SDK
								this.uploaderInstance.addFile(file.raw, null, null, null, JSON.stringify(userData));
							})
					);
				}
			});
			if (promiseArr.length <= 0) {
				this.$message.error("请选择需要上传的视频文件!");
				return;
			}
			Promise.all(promiseArr).then(() => {
				this.uploaderInstance.startUpload();
				site.log.debug("全部授权完毕,开始上传");
			});
		}
	}
};
</script>
<style lang="less" scoped></style>
