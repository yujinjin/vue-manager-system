<template>
	<div class="img-upload">
		<el-upload v-bind="uploadAttributes">
			<slot>
				<el-button size="small" type="primary">点击上传</el-button>
				<div slot="tip" class="el-upload__tip">{{ tipsText }}</div>
			</slot>
		</el-upload>
		<el-dialog title="图片裁剪" :visible.sync="dialogVisible" :append-to-body="true" width="1000px">
			<div class="cropper-panel">
				<div class="cropper-box">
					<img :src="currentCropperImg" ref="cropperImg" />
				</div>
				<div class="preview-box">
					<div class="tips-text">图片预览：</div>
					<div class="preview-img-box" ref="previewImg"></div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="resetCropper">复位</el-button>
				<el-button size="small" @click="rotateCropper">旋转</el-button>
				<el-button size="small" @click="changeDirectionCropper">换向</el-button>
				<el-button size="small" type="primary" @click="saveCropper">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default {
	data() {
		return {
			uploadAttributes: {
				action: config.uploadImgServer, // 图片上传地址
				fileList: [], // 文件列表
				httpRequest: this.imgUpload,
				onChange: this.onImgChange,
				beforeUpload: this.beforeImgUpload,
				listType: "picture",
				onRemove: this.removeImg,
				accept: "image/*",
				multiple: false,
				ref: "upload"
			}, // element upload组件默认属性
			dialogVisible: false,
			cropperInstance: null, // 图片裁剪实例化对象
			currentCropperImg: null, // 当前裁剪图片的地址
			directionCropper: true, // 剪切图片的方向
			isSingle: false, // 是否单独一个图片上传
			transitionValue: null // 中间过渡的值，用于判断value的变化
		};
	},
	props: {
		// element上传组件的属性
		upload: Object,
		value: [String, Array],
		imgMaxSize: {
			type: Number,
			default: 2048
		}, // 上传图片的最大尺寸
		cropp: {
			type: [Boolean, Object],
			default: false
		} // 图片裁剪的配置选项，具体见（cropperjs文档）, 如果需要裁剪一次只能上传一张图片
	},
	watch: {
		upload(val) {
			this.generateUploadAttributes();
		},
		value(val) {
			if (val != this.transitionValue) {
				this.generateImgList();
				this.transitionValue = val;
			}
		}
	},
	computed: {
		tipsText() {
			let size = this.imgMaxSize / 1024;
			if (size < 1) {
				return "只能上传图片文件，且不超过" + this.imgMaxSize + "kb";
			} else {
				return "只能上传图片文件，且不超过" + site.utils.numberFormat(size, 1) + "M";
			}
		}
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			this.generateUploadAttributes();
			this.generateImgList();
		},
		generateUploadAttributes() {
			site.utils.extend(true, this.uploadAttributes, this.upload);
			if (this.cropp) {
				// 如果当前图片需要剪切，那就一次只能上传一张图
				this.uploadAttributes.multiple = false;
				// 选取文件后不能立即进行上传，要先剪切
				this.uploadAttributes.autoUpload = false;
			}
			if (this.uploadAttributes.limit === 1) {
				// 由于element的upload上传组件如果超过限制什么提示都没有，这里做一下稍稍的优化，新上传的文件去替换老的
				this.uploadAttributes.limit = 2;
				this.uploadAttributes.multiple = false;
				this.isSingle = true;
			}
		},
		// 图片转换成文件列表
		generateImgList() {
			if (!this.value) {
				this.uploadAttributes.fileList = [];
				return;
			}
			if (typeof this.value == "string") {
				let imgList = [];
				// 当前图片是用“|”分割
				this.value.split("|").forEach(img => {
					imgList.push({
						name: site.utils.parseUrl(img).file,
						url: site.utils.perfectImageUrl(img),
						relativeUrl: img
					});
				});
				this.uploadAttributes.fileList = imgList;
			}
		},
		onImgChange(file, fileList) {
			if (!this.cropp) {
				// 当前图片无需剪切
				return;
			}
			let imgFileReader = new FileReader();
			imgFileReader.onload = e => {
				this.currentCropperImg = e.target.result;
				this.showCroppDialog();
			};
			imgFileReader.readAsDataURL(file.raw);
		},
		beforeImgUpload(file) {
			// 判断图片的大小是否超过要求
			if (this.cropperInstance) {
				return new Promise((resolve, reject) => {
					this.cropperInstance.getCroppedCanvas().toBlob(blob => {
						if (blob.size / 1024 > this.imgMaxSize) {
							this.$message.error("文件大小超出限制！");
							reject();
						}
						resolve(true);
					}, "image/jpeg");
				});
			}
			if (file.size / 1024 > this.imgMaxSize) {
				this.$message.error("文件大小超出限制！");
				return false;
			}
			// TODO: 判断剪切后的文件
		},
		imgUpload(file) {
			if (this.cropperInstance) {
				return this.cropperInstance.getCroppedCanvas().toBlob(blob => {
					blob.name = file.file.name;
					this.imageUploadApi({ file: blob }).then(() => {
						this.uploadImgChange();
						this.closeCroppDialog();
					});
				}, "image/jpeg");
			} else {
				return this.imageUploadApi(file).then(() => {
					this.uploadImgChange();
				});
			}
		},
		imageUploadApi({ file }) {
			return site.api.common.imageUpload({ file }, { isShowLoading: true }).then(response => {
				let img = response.data.imgUrl;
				if (this.isSingle) {
					this.uploadAttributes.fileList = [
						{
							name: site.utils.parseUrl(img).file,
							url: site.utils.perfectImageUrl(img),
							relativeUrl: img,
							uid: file.uid
						}
					];
				} else {
					this.uploadAttributes.fileList.push({
						name: file.name,
						url: site.utils.perfectImageUrl(img),
						relativeUrl: img,
						uid: file.uid
					});
				}
			});
		},
		removeImg(file, fileList) {
			this.uploadAttributes.fileList = fileList;
			this.uploadImgChange();
		},
		uploadImgChange() {
			// 双向绑定
			if (typeof this.value == "string" || this.value === undefined || this.value === null) {
				this.transitionValue = this.uploadAttributes.fileList
					.map(function(item, index) {
						return item.relativeUrl;
					})
					.join("|");
			} else {
				this.transitionValue = this.uploadAttributes.fileList;
			}
			this.$emit("input", this.transitionValue);
		},
		// 开始显示裁剪图片的弹窗
		showCroppDialog() {
			this.dialogVisible = true;
			this.$nextTick(() => {
				if (this.cropperInstance) {
					this.cropperInstance.replace(this.currentCropperImg);
				} else {
					this.cropperInstance = new Cropper(
						this.$refs["cropperImg"],
						Object.assign(
							{
								viewMode: 1, // 0:无限制;1:将裁剪框限制为不超过画布的大小;2:限制最小画布尺寸以适应容器。如果画布和容器的比例不同，则最小画布将在其中一个维度中被额外的空格包围。3:限制最小画布尺寸以填充容器。如果画布和容器的比例不同，则容器将无法将整个画布适合其中一个尺寸。
								aspectRatio: 1 / 1, // 默认比例
								preview: this.$refs["previewImg"], // 预览视图
								guides: false, // 裁剪框的虚线(九宫格)
								autoCropArea: 0.8, // 0-1之间的数值，定义自动剪裁区域的大小，默认0.8
								movable: false, // 是否允许移动图片
								dragCrop: true, // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
								movable: true, // 是否允许移动剪裁框
								resizable: true, // 是否允许改变裁剪框的大小
								zoomable: false, // 是否允许缩放图片大小
								mouseWheelZoom: true, // 是否允许通过鼠标滚轮来缩放图片
								touchDragZoom: true, // 是否允许通过触摸移动来缩放图片
								rotatable: true // 是否允许旋转图片
							},
							this.cropp
						)
					);
				}
			});
		},
		closeCroppDialog() {
			if (this.cropperInstance) {
				// reset()
				this.cropperInstance.destroy();
			}
			this.dialogVisible = false;
		},
		// 复位
		resetCropper() {
			if (!this.cropperInstance) {
				return;
			}
			this.cropperInstance.reset();
		},
		// 旋转
		rotateCropper() {
			if (!this.cropperInstance) {
				return;
			}
			this.cropperInstance.rotate(45);
		},
		// 换向
		changeDirectionCropper() {
			if (!this.cropperInstance) {
				return;
			}
			this.cropperInstance.scaleX(this.directionCropper ? -1 : 1);
			this.directionCropper = !this.directionCropper;
		},
		// 保存剪切的图
		saveCropper() {
			// 提交
			this.$refs.upload.submit();
		}
	}
};
</script>
<style lang="less" scoped>
.img-upload {
}

// 因为是dialog是放在body上的，所以不能在img-upload下写样式
// 由于该插件不能动态计算宽高，所以只能在样式里指定宽高才会展示
.cropper-panel {
	display: flex;
	width: 100%;
	height: 500px;

	.cropper-box {
		width: 780px;
		height: 500px;
		border: solid 1px #ddd;
	}

	.preview-box {
		display: inline-block;
		width: 180px;
		padding-left: 20px;

		.tips-text {
			line-height: 40px;
			color: #000;
		}

		.preview-img-box {
			width: 160px;
			height: 160px;
			overflow: hidden;
		}
	}
}
</style>
