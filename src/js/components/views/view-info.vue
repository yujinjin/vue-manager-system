<template>
	<!-- 
        作者：yujinjin9@126.com
        时间：2020-09-26
        描述：浏览表单信息组件 
    -->
	<div class="view-info-components" v-if="groupFields && groupFields.length > 0">
		<template v-if="groupingShow">
			<div class="card" v-for="(cardItem, cardIndex) in groupFields" :key="cardIndex">
				<div class="header">
					<slot :name="cardItem.slot ? cardItem.slot : 'card' + cardIndex" v-bind:info="value">
						{{ cardItem.title }}
						<div class="tips-text" v-if="cardItem.subTitle">{{ cardItem.subTitle }}</div>
					</slot>
				</div>
				<div class="body">
					<el-row :gutter="10" class="input-row" v-for="(groupItem, index) in cardItem.fields" :key="index">
						<el-col class="field-box" :span="fieldItem.span" v-for="(fieldItem, i) in groupItem" :key="i">
							<div class="label-text" v-if="fieldItem.label">{{ fieldItem.label }}</div>
							<div class="field-value">
								<!-- 自定义组件 -->
								<template v-if="fieldItem.slot">
									<slot :name="fieldItem.slot" v-bind:info="value"></slot>
								</template>
								<template v-else-if="fieldItem.type == 'date'">
									<strong>{{ getValue(fieldItem.name) | dateFormat }}</strong>
								</template>
								<template v-else-if="fieldItem.type == 'datetime'">
									<strong>{{ getValue(fieldItem.name) | dateFormat("yyyy-MM-dd hh:mm:ss") }}</strong>
								</template>
								<template v-else-if="fieldItem.type == 'time'">
									<strong>{{ getValue(fieldItem.name) | dateFormat("hh:mm:ss") }}</strong>
								</template>
								<template v-else-if="fieldItem.type == 'money'">
									<strong>{{ getValue(fieldItem.name) | currencyFormat }}</strong>
								</template>
								<template v-else-if="fieldItem.type == 'image'">
									<div class="field-img">
										<field-img :value="getValue(fieldItem.name)"></field-img>
									</div>
								</template>
								<template v-else-if="fieldItem.type == 'tags'">
									<field-tag :value="getValue(fieldItem.name)"></field-tag>
								</template>
								<template v-else-if="fieldItem.type == 'enum'">
									<field-enum :value="getValue(fieldItem.name)" :list="fieldItem.data"></field-enum>
								</template>
								<template v-else-if="fieldItem.type == 'html'">
									<div class="html-field" v-html="getValue(fieldItem.name)"></div>
								</template>
								<template v-else>
									<strong>{{ getValue(fieldItem.name) }}</strong>
								</template>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</template>
		<template v-else>
			<el-row :gutter="10" class="input-row" v-for="(groupItem, index) in groupFields" :key="index">
				<el-col class="field-box" :span="fieldItem.span" v-for="(fieldItem, i) in groupItem" :key="i">
					<div class="label-text" v-if="fieldItem.label">{{ fieldItem.label }}</div>
					<div class="field-value">
						<!-- 自定义组件 -->
						<template v-if="fieldItem.slot">
							<slot :name="fieldItem.slot" v-bind:info="value"></slot>
						</template>
						<template v-else-if="fieldItem.type == 'date'">
							<strong>{{ getValue(fieldItem.name) | dateFormat }}</strong>
						</template>
						<template v-else-if="fieldItem.type == 'datetime'">
							<strong>{{ getValue(fieldItem.name) | dateFormat("yyyy-MM-dd hh:mm:ss") }}</strong>
						</template>
						<template v-else-if="fieldItem.type == 'time'">
							<strong>{{ getValue(fieldItem.name) | dateFormat("hh:mm:ss") }}</strong>
						</template>
						<template v-else-if="fieldItem.type == 'money'">
							<strong>{{ getValue(fieldItem.name) | currencyFormat }}</strong>
						</template>
						<template v-else-if="fieldItem.type == 'image'">
							<field-img :value="getValue(fieldItem.name)"></field-img>
						</template>
						<template v-else-if="fieldItem.type == 'tags'">
							<field-tag :value="getValue(fieldItem.name)"></field-tag>
						</template>
						<template v-else-if="fieldItem.type == 'enum'">
							<field-enum :value="getValue(fieldItem.name)" :list="fieldItem.list"></field-enum>
						</template>
						<template v-else-if="fieldItem.type == 'html'">
							<div class="html-field" v-html="getValue(fieldItem.name)"></div>
						</template>
						<template v-else>
							<strong>{{ getValue(fieldItem.name) }}</strong>
						</template>
					</div>
				</el-col>
			</el-row>
		</template>
	</div>
</template>
<script>
export default {
	data() {
		return {
			viewFields: [] // 表单字段列表
		};
	},
	props: {
		// 字段列表[]
		// {division: { title: "分组后的卡片标题", subTitle: "分组后的卡片标题"}--组分割栏,
		// {name: 表单项名称, label: 选项的标签名称, value: 选项的值, type: 组件的类型,
		// data: 数据（比如：select的选项值列表）,  span: 占用的栅格数（布局）
		// slot: 自定义插槽名称（可无，如有值其他选项无效）}
		fields: {
			type: Array,
			default() {
				return [];
			}
		},
		// 表单每栏显示数目，不要初始化后又有变化，这里不做监控
		column: {
			type: Number,
			default: 2
		},
		// 当前表单的数值
		value: Object
	},
	watch: {
		fields: {
			handler(val) {
				this.generateViewFields();
			},
			deep: true
		}
	},
	computed: {
		// 把viewFields分成二维数组，便于嵌套循环
		groupFields() {
			if (!this.viewFields || this.viewFields.length == 0) {
				return [];
			}
			// 当前表单字段生成卡片数组
			let cards = [];
			// 当前分组的二维数据
			let groupFields = [];
			// 当前分组的二维数下标
			let i = 0;
			// 当前行所占的栅格数
			let currentColumnNumber = 0;
			this.viewFields.forEach(fields => {
				if (fields.division) {
					// 当前字段信息是分隔栏
					groupFields = [];
					i = 0;
					currentColumnNumber = 0;
					if (typeof fields.division == "string") {
						cards.push({
							title: fields.division,
							fields: groupFields
						});
					} else {
						cards.push(Object.assign(fields.division, { fields: groupFields }));
					}
					return;
				}
				currentColumnNumber += fields.span;
				if (currentColumnNumber > 24) {
					++i;
					currentColumnNumber = fields.span;
				}
				if (!groupFields[i]) {
					groupFields[i] = [];
				}
				groupFields[i].push(fields);
			});
			return cards.length == 0 ? groupFields : cards;
		},
		// 当前展示的信息是否分组方式展示,如果有division就代表着分栏展示
		groupingShow() {
			if (!this.fields || this.fields.length == 0) {
				return false;
			}
			return this.fields.findIndex(item => !!item.division) != -1;
		}
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			this.generateViewFields();
		},
		// 生成form表单字段
		generateViewFields() {
			if (!this.fields || this.fields.length == 0) {
				return;
			}
			let viewFields = [];
			this.fields.forEach(field => {
				field = site.utils.extend(true, {}, field);
				if (field.division) {
					// 当前字段分隔栏
					viewFields.push(field);
					return;
				}
				if (field.label) {
					field.label = field.label + "：";
				}
				if (!field.span) {
					// 计算当前字段所占的栅格数
					if (field.type == "html") {
						field.span = 24;
					} else {
						field.span = parseInt(24 / this.column, 10);
					}
				}
				viewFields.push(field);
			});
			this.viewFields = viewFields;
		},
		// 获取当前字段的值
		getValue(name) {
			return site.utils.getObjectProperty(this.value, name, null);
		}
	},
	components: {
		fieldImg: {
			name: "fieldImg",
			render(createElement) {
				if (this.imgList && this.imgList.length > 0) {
					return (
						<div class="field-img">
							{this.imgList.map((img, index) => {
								return <el-image class="img-column" src={img} preview-src-list={this.imgList} fit="cover" key={index} />;
							})}
						</div>
					);
				} else {
					return (
						<div class="field-img">
							<div class="no-date">没有图片</div>
						</div>
					);
				}
			},
			props: {
				value: [Array, String]
			},
			computed: {
				imgList() {
					if (!this.value) {
						return [];
					} else if (typeof this.value == "string") {
						let imgList = this.value.split("|");
						return imgList.map(img => site.utils.perfectImageUrl(img));
					} else {
						return this.value.map(img => site.utils.perfectImageUrl(img));
					}
				}
			}
		},
		fieldTag: {
			name: "fieldTag",
			render(createElement) {
				if (this.tagList && this.tagList.length > 0) {
					return (
						<div class="tag-list">
							{this.tagList.map((tag, index) => {
								return <el-tag class="tag">{tag}</el-tag>;
							})}
						</div>
					);
				} else {
					return (
						<el-tag effect="plain" type="info">
							无标签
						</el-tag>
					);
				}
			},
			props: {
				value: [Array, String]
			},
			computed: {
				tagList() {
					if (!this.value) {
						return [];
					} else if (typeof this.value == "string") {
						return this.value.split("|");
					} else {
						return this.value;
					}
				}
			}
		},
		fieldEnum: {
			name: "fieldEnum",
			render(createElement) {
				return (
					<el-tag effect={this.tagEffect} type={this.tagType}>
						{this.labelText}
					</el-tag>
				);
			},
			props: {
				value: [Boolean, String, Number],
				list: {
					type: [String, Array],
					require: true
				} // enum枚举值（如果是String类型，从constants中的enum对象里取值, 否则就是Array类型)
			},
			computed: {
				enumList() {
					if (typeof this.list == "string") {
						return site.utils.extend(true, site.constants.ENUM[this.list]);
					} else {
						return site.utils.extend(true, this.list);
					}
				},
				tagType() {
					if (this.enumList.length == 0 || this.enumList.length != 2) {
						return "info";
					}
					let i = this.enumList.findIndex(item => item.key == this.value);
					if (i == -1) {
						return "info";
					} else {
						return i == 0 ? "success" : "";
					}
				},
				tagEffect() {
					return this.enumList.length != 2 ? "light" : "dark";
				},
				labelText() {
					if (!this.enumList || this.enumList.length == 0) {
						return "未知";
					}
					let i = this.enumList.findIndex(item => item.key == this.value);
					if (i == -1) {
						return "未知";
					} else {
						return this.enumList[i].name;
					}
				}
			}
		}
	}
};
</script>
<style lang="less">
.view-info-components {
	.card {
		border: 1px solid #dfe6ec;
		border-radius: 5px;
		margin: 10px;
		overflow: hidden;

		&:hover {
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
		}

		.header {
			background: #eef1f6;
			line-height: 40px;
			padding-left: 10px;
			font-size: 16px;
			font-weight: bold;

			.tips-text {
				font-weight: normal;
				font-size: 12px;
				display: inline-block;
				padding-left: 5px;
				color: #f56c6c;
			}
		}

		.body {
			padding-top: 15px;
			padding-right: 15px;
		}
	}

	.input-row {
		padding: 5px 0px;
		.field-box {
			display: flex;
			line-height: 25px;

			.label-text {
				width: 100px;
				text-align: right;
			}

			.field-value {
				flex: 1;

				strong {
					font-weight: bold;
				}

				.html-field {
					max-height: 200px;
					overflow-y: auto;
				}

				.tag-list {
					.el-tag {
						margin-bottom: 5px;
						&:not(:last-child) {
							margin-right: 5px;
						}
					}
				}

				.field-img {
					overflow-x: auto;
					display: flex;

					&::-webkit-scrollbar {
						display: none;
					}

					.img-column {
						flex-shrink: 0;
						width: 60px;
						height: 50px;
						margin-right: 5px;
					}

					.no-date {
						height: 80px;
						max-width: 80px;
						width: 100%;
						background-color: #f5f7fa;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 12px;
						color: #c0c4cc;
						vertical-align: middle;
					}
				}
			}
		}
	}
}
</style>
