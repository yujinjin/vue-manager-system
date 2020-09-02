<template>
	<!-- web富文本框编辑器 -->
	<div class="web-editor">
		<div ref="summernote-editor"></div>
		<el-dialog title="视频插入" :visible.sync="videoDialog.isShow" custom-class="video-dialog">
			<el-tabs v-model="videoDialog.type">
				<el-tab-pane label="视频地址" name="0">
					<el-form :model="videoDialog" label-width="100px" ref="videoForm" style="padding-top: 20px;">
						<el-form-item label="视频地址" prop="url" :rules="[{ required: true, message: '请输入视频地址', trigger: 'blur' }]">
							<el-input style="max-width: 300px;" v-model="videoDialog.url" auto-complete="off" placeholder="视频文件的网络地址"></el-input>
						</el-form-item>
						<el-form-item label="视频预览图" prop="cover">
							<div class="input-box">
								<el-input style="max-width: 300px; margin-right: 10px;" v-model="videoDialog.cover" auto-complete="off" placeholder="视频预览图网络地址"></el-input>
								<img-upload :upload="{ showFileList: false, limit: 1 }" v-model="videoDialog.cover">
									<el-button size="small" type="primary">点击上传</el-button>
								</img-upload>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="视频上传" name="1">
					<video-upload @on-change="videoDialog.videoList = arguments[0]" class="video-upload"></video-upload>
				</el-tab-pane>
			</el-tabs>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="videoDialog.isShow = false">取 消</el-button>
				<el-button size="small" type="primary" @click="insertVideo">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import Vue from "vue";
import "@js/lib/summernote/summernote.css";
import videoPreview from "@views/components/video-preview-for-editor";

export default {
	data() {
		return {
			content: null, // 当前编辑器内容
			editorInstance: null, // 当前编辑器实例
			contentHtml: "", // 当前编辑器的动态内容（双向绑定值的中间件）
			videoDialog: {
				isShow: false,
				url: "", // 视频地址
				cover: "", // 视频封面图
				type: "0",
				videoList: []
			} // 视频上传弹窗
		};
	},
	props: {
		//　编辑器配置选项
		editor: {
			type: Object
		},
		value: {
			type: String,
			default: ""
		}
	},
	watch: {
		value(newVal, oldVal) {
			if (newVal != this.contentHtml) {
				this.content = newVal;
				this.contentHtml = newVal;
				if (this.editorInstance) {
					this.editorInstance.summernote("code", newVal);
					this.renderEditorContent();
				} else {
					this.initEditor();
				}
			}
		}
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			if (this.value != this.content) {
				this.content = this.value;
			}
			if ($.summernote) {
				this.initEditor();
			} else {
				require(["@js/lib/summernote/summernote", "@js/lib/summernote/summernote-zh-CN"], () => {
					this.initEditor();
				});
			}
		},
		initEditor() {
			const options = {
				lang: "zh-CN",
				height: "300px",
				placeholder: "write here...",
				toolbar: [
					["style", ["style"]],
					["font", ["bold", "underline", "clear"]],
					["fontname", ["fontname"]],
					["fontsize", ["fontsize"]],
					["color", ["color"]],
					["para", ["ul", "ol", "paragraph"]],
					["table", ["table"]],
					["insert", ["link", "picture", "video", "player"]],
					["view", ["fullscreen", "codeview"]]
				],
				buttons: {
					player: this.createPlayerButton
				},
				callbacks: {
					onImageUpload: (files, linkInfo) => {
						return this.imgFileUpload(files, linkInfo);
					},
					onChange: contents => {
						this.onEditorChange(contents);
					}
				}
			};
			this.$nextTick(() => {
				this.editorInstance = $(this.$refs["summernote-editor"]).summernote($.extend({}, options, this.editor));
				this.editorInstance.summernote("code", this.content || "");
				this.renderEditorContent();
			});
		},
		// 渲染编辑器的内容
		renderEditorContent() {
			let editorElement = this.editorInstance.data("summernote").layoutInfo.editable;
			// 视频转换成富文本框编辑器显示的状态
			let videoElements = editorElement.find(".video-container[data-id]");
			if (videoElements.length == 0) {
				return;
			}
			videoElements = Array.from(videoElements);
			videoElements.forEach(videoElement => {
				let videoInstance = new (Vue.extend(videoPreview))({
					el: videoElement,
					propsData: {
						dataId: videoElement.getAttribute("data-id"),
						videoUrl: videoElement.getAttribute("data-video-url"),
						coverImgUrl: videoElement.getAttribute("data-cover-url")
					},
					methods: {
						deleteNode: () => {
							videoInstance.$el.parentNode.removeChild(videoInstance.$el);
							this.editorInstance.data("summernote").triggerEvent("change");
						}
					}
				});
			});
			this.editorInstance.data("summernote").triggerEvent("change");
		},
		createPlayerButton(context) {
			return $.summernote.ui
				.button({
					contents: '<i class="i-video"/>',
					tooltip: "网络视频",
					click: () => {
						// 保存当前焦点
						this.editorInstance.summernote("saveRange");
						this.videoDialog.isShow = true;
					}
				})
				.render();
		},
		imgFileUpload(files, linkInfo) {
			if (!files || files.length == 0) {
				return;
			}
			let promiseArr = [];
			for (let i = 0; i < files.length; i++) {
				promiseArr.push(
					site.api.common
						.imageUpload({
							file: files[0]
						})
						.then(response => {
							return response.data;
						})
				);
			}
			Promise.all(promiseArr).then(results => {
				this.insertImages(results, linkInfo);
			});
		},
		onEditorChange(content) {
			if (this.content == content) {
				return;
			}
			this.content = content;
			let virtualDOM = document.createElement("div");
			// 把需要渲染在编辑的信息还原成需要存储的内容HTML
			virtualDOM.innerHTML = this.editorInstance.summernote("code");
			let videoElements = $(virtualDOM).find(".video-container[data-id]");
			if (videoElements.length > 0) {
				videoElements = Array.from(videoElements);
				videoElements.forEach(videoElement => {
					$(videoElement).hide();
					$(videoElement).html("");
				});
			}
			this.contentHtml = virtualDOM.innerHTML;
			if (this.contentHtml != this.value) {
				this.$emit("input", virtualDOM.innerHTML);
				this.$emit("change", virtualDOM.innerHTML, this.editorInstance);
			}
		},
		insertImages(imgResults, linkInfo) {
			let asyncControl = i => {
				if (i >= imgResults.length) {
					return;
				}
				this.editorInstance.summernote("insertImage", site.utils.perfectImageUrl(imgResults[i].result.imgUrl), null, linkInfo).then(() => {
					++i;
					asyncControl(i);
				});
			};
			asyncControl(0);
		},
		async insertVideo() {
			let url = ""; // 视频的地址
			let cover = ""; // 视频的封面图
			if (this.videoDialog.type == "0") {
				let valid = await this.$refs["videoForm"].validate();
				if (!valid) return;
				url = this.videoDialog.url;
				if (this.videoDialog.cover) {
					cover = site.utils.perfectImageUrl(this.videoDialog.cover);
				}
			} else {
				// 把上传的视频转换成网络视频地址
				url = "";
			}
			this.editorInstance.summernote("restoreRange");
			let videoInstance = new (Vue.extend(videoPreview))({
				el: document.createElement("div"),
				propsData: {
					videoUrl: url,
					coverImgUrl: cover
				},
				methods: {
					deleteNode: () => {
						videoInstance.$el.parentNode.removeChild(videoInstance.$el);
						this.editorInstance.data("summernote").triggerEvent("change");
					}
				}
			});
			this.editorInstance.summernote("editor.insertNode", videoInstance.$el);
			this.videoDialog.cover = "";
			this.videoDialog.url = "";
			this.videoDialog.videoList = [];
			this.videoDialog.isShow = false;
		}
	},
	destroyed() {
		this.editorInstance.summernote("destroy");
	}
};
</script>
<style lang="less" scoped>
.web-editor {
	.input-box {
		display: flex;
	}

	.video-upload {
		height: 120px;
		padding-left: 30px;
		padding-top: 20px;
	}
}
</style>

<style lang="less">
.video-dialog .el-dialog__body {
	padding-top: 0px;
}
</style>
