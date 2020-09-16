<template>
	<div class="toggle-table-column">
		<div class="icon-column-box" ref="inertia" @click="isShowToggleTableColumn = !isShowToggleTableColumn">
			<el-tooltip content="显示隐藏列" placement="top">
				<i class="el-icon-notebook-2" />
			</el-tooltip>
		</div>
		<transition name="el-fade-in">
			<div class="button-collection" v-show="isShowToggleTableColumn">
				<div class="cover" @click="isShowToggleTableColumn = false"></div>
				<div class="toggle-list">
					<ul>
						<li @click.stop="toggleColumnShowState(i, item)" :class="{ active: item.isShow }" v-for="(item, i) in cloumns" :key="item.name">
							<span>{{ item.label }}</span>
						</li>
					</ul>
					<div class="operation">
						<el-button type="primary" @click.stop="restore">恢复默认</el-button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import Inertia from "@js/lib/Inertia.js";
export default {
	data() {
		return {
			defaultColumnList: [], //默认列表数据
			isShowToggleTableColumn: false
		};
	},
	props: {
		cloumns: {
			type: Array
		}, // 列表数据
		name: String, // 当前存储状态的名称
		stateSave: {
			type: Boolean,
			default: true
		} //是否保存当前操作状态
	},
	watch: {
		cloumns: {
			handler(val) {
				if (!val || val.length == 0) {
					return;
				}
				if (this.defaultColumnList.length == 0 || this.defaultColumnList.length != val.length) {
					this.initColumnList();
				}
			},
			deep: true
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			new Inertia(this.$refs["inertia"], { edge: false });
			this.initColumnList();
		},
		initColumnList() {
			if (!this.cloumns || this.cloumns.length == 0) {
				return;
			}
			this.defaultColumnList = JSON.parse(JSON.stringify(this.cloumns));
			if (!this.stateSave) {
				return;
			}
			let tableColumnState = site.globalService.getTableColumnState({ tableName: this.name });
			if (!tableColumnState) {
				return;
			}
			// 还原上次已经保存的数据列状态
			this.cloumns.forEach((column, i) => {
				if (Object.prototype.hasOwnProperty.call(tableColumnState, this.cloumns[i].name)) {
					this.$emit("change", i, tableColumnState[column.name].isShow);
				}
			});
		},
		toggleColumnShowState(i, item) {
			this.$emit("change", i, !item.isShow);
		},
		restore() {
			// 还原初始化是的列状态
			this.cloumns.forEach((column, i) => {
				if (this.defaultColumnList[i].isShow != column.isShow) {
					this.$emit("change", i, this.defaultColumnList[i].isShow);
				}
			});
		}
	},
	beforeDestroy() {
		if (this.stateSave && this.cloumns && this.cloumns.length > 0) {
			let tableColumnState = {};
			for (let i = 0; i < this.cloumns.length; i++) {
				tableColumnState[this.cloumns[i].name] = site.utils.extend(true, this.cloumns[i]);
				delete tableColumnState[this.cloumns[i].name].name;
			}
			site.globalService.setTableColumnState(tableColumnState, { tableName: this.name });
		}
	}
};
</script>
<style lang="less" rel="stylesheet/less" type="text/css" scoped>
.toggle-table-column {
	.icon-column-box {
		position: fixed;
		z-index: 99;
		top: 50%;
		right: 20px;
		width: 45px;
		height: 45px;
		text-align: center;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 25px;
		background-clip: padding-box;
		box-shadow: 0px 2px 9px #e2e2e2;
		color: #666;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
	}

	.button-collection {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2001;
		.cover {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.7);
			background: -ms-radial-gradient(center, ellipse farthest-corner, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
			background: -moz-radial-gradient(center, ellipse farthest-corner, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
			background: -o-radial-gradient(center, ellipse farthest-corner, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
			background: -webkit-gradient(radial, center center, 0, center center, 497, color-stop(0, rgba(0, 0, 0, 0.3)), color-stop(1, rgba(0, 0, 0, 0.7)));
			background: -webkit-radial-gradient(center, ellipse farthest-corner, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
			background: radial-gradient(ellipse farthest-corner at center, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
		}
		.toggle-list {
			position: absolute;
			top: 50%;
			right: 20px;
			-webkit-transform: translateY(-50%);
			-moz-transform: translateY(-50%);
			-ms-transform: translateY(-50%);
			-o-transform: translateY(-50%);
			transform: translateY(-50%);
			width: 150px;
			margin-top: 3px;
			padding: 8px 8px 4px 8px;
			border: 1px solid #ccc;
			border: 1px solid rgba(0, 0, 0, 0.4);
			background-color: white;
			max-height: 80%;
			overflow: scroll;
			z-index: 2002;
			border-radius: 5px;
			box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
			z-index: 2002;
			-webkit-column-gap: 8px;
			-moz-column-gap: 8px;
			-ms-column-gap: 8px;
			-o-column-gap: 8px;
			column-gap: 8px;
			li {
				position: relative;
				left: 0;
				right: 0;
				display: block;
				float: none;
				margin-bottom: 4px;
				margin-right: 0;
				-webkit-column-break-inside: avoid;
				break-inside: avoid;
				box-sizing: border-box;
				padding: 0.5em 1em;
				border: 1px solid #999;
				border-radius: 2px;
				cursor: pointer;
				font-size: 0.88em;
				color: black;
				white-space: nowrap;
				overflow: hidden;
				background-color: #e9e9e9;
				background-image: -webkit-linear-gradient(top, white 0%, #e9e9e9 100%);
				background-image: -moz-linear-gradient(top, white 0%, #e9e9e9 100%);
				background-image: -ms-linear-gradient(top, white 0%, #e9e9e9 100%);
				background-image: -o-linear-gradient(top, white 0%, #e9e9e9 100%);
				background-image: linear-gradient(to bottom, white 0%, #e9e9e9 100%);
				filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,StartColorStr='white', EndColorStr='#e9e9e9');
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
				text-decoration: none;
				outline: none;
				&:hover {
					border: 1px solid #666;
					background-color: #e0e0e0;
					background-image: -webkit-linear-gradient(top, #f9f9f9 0%, #e0e0e0 100%);
					background-image: -moz-linear-gradient(top, #f9f9f9 0%, #e0e0e0 100%);
					background-image: -ms-linear-gradient(top, #f9f9f9 0%, #e0e0e0 100%);
					background-image: -o-linear-gradient(top, #f9f9f9 0%, #e0e0e0 100%);
					background-image: linear-gradient(to bottom, #f9f9f9 0%, #e0e0e0 100%);
					filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,StartColorStr='#f9f9f9', EndColorStr='#e0e0e0');
				}
				&.active {
					background-color: #dadada;
					background-image: -webkit-linear-gradient(top, #f0f0f0 0%, #dadada 100%);
					background-image: -moz-linear-gradient(top, #f0f0f0 0%, #dadada 100%);
					background-image: -ms-linear-gradient(top, #f0f0f0 0%, #dadada 100%);
					background-image: -o-linear-gradient(top, #f0f0f0 0%, #dadada 100%);
					background-image: linear-gradient(to bottom, #f0f0f0 0%, #dadada 100%);
					filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,StartColorStr='#f0f0f0', EndColorStr='#dadada');
					box-shadow: inset 1px 1px 3px #666;
					&:hover {
						box-shadow: inset 1px 1px 3px #999999;
						background-color: #cccccc;
						background-image: -webkit-linear-gradient(top, #eaeaea 0%, #cccccc 100%);
						background-image: -moz-linear-gradient(top, #eaeaea 0%, #cccccc 100%);
						background-image: -ms-linear-gradient(top, #eaeaea 0%, #cccccc 100%);
						background-image: -o-linear-gradient(top, #eaeaea 0%, #cccccc 100%);
						background-image: linear-gradient(to bottom, #eaeaea 0%, #cccccc 100%);
						filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,StartColorStr='#eaeaea', EndColorStr='#cccccc');
					}
				}
			}
		}

		.operation {
			padding-top: 3px;
			width: 100%;

			button {
				width: 100%;
			}
		}
	}
}
</style>
