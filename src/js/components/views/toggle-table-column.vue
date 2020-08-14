<template>
	<div class="toggle-table-column" :class="className">
		<el-tooltip content="显示隐藏列" placement="top">
			<el-button class="pull-right" @click="isShowToggleTableColumn = !isShowToggleTableColumn"><i class="icon-th-list"></i></el-button>
		</el-tooltip>
		<transition name="el-fade-in">
			<div class="button-collection" v-show="isShowToggleTableColumn">
				<div class="cover" @click="hideTableColumn"></div>
				<div class="toggle-list">
					<ul>
						<li @click.stop="updateList(item)" :class="{ active: item.isShow }" v-for="(item, key) in columnList" :key="key">
							<span>{{ item.displayName }}</span>
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
export default {
	data() {
		return {
			defaultColumnList: "", //默认列表数据
			isShowToggleTableColumn: false,
			stateName: null //状态名称
		};
	},
	props: {
		columnList: {
			type: Object
		}, // 列表数据
		stateSave: {
			type: Boolean,
			default: true
		}, //是否保存当前操作状态
		className: {
			default: "pull-right"
		} //样式
	},
	mounted() {
		if (this.columnList) {
			this.defaultColumnList = JSON.stringify(this.columnList);
		}
		this.initColumnList();
	},
	methods: {
		initColumnList() {
			if (this.stateSave) {
				// 当前的状态名+路由名称+"table_column"
				this.stateName = site.globalService.getLoginUserInfo().usernameOrEmailAddress + "-" + this.$route.name + "-" + "table-column-state";
				let _site_local_storage = site.getSiteLocalStorage();
				let _local_storage_column_list = _site_local_storage[this.stateName];
				if (_local_storage_column_list) {
					for (let key in this.columnList) {
						if (_local_storage_column_list[key] == undefined) {
							continue;
						}
						if (_local_storage_column_list[key].isShow === false) {
							this.columnList[key].isShow = false;
						} else if (_local_storage_column_list[key].isShow === true) {
							this.columnList[key].isShow = true;
						}
					}
				}
			}
		},
		hideTableColumn() {
			this.isShowToggleTableColumn = false;
		},
		updateList(item) {
			item.isShow = !item.isShow;
		},
		restore() {
			if (this.defaultColumnList) {
				let _defaultColumnList = JSON.parse(this.defaultColumnList);
				for (let key in _defaultColumnList) {
					if (this.columnList[key] == undefined) {
						continue;
					}
					if (_defaultColumnList[key].isShow === false) {
						this.columnList[key].isShow = false;
					} else if (_defaultColumnList[key].isShow === true) {
						this.columnList[key].isShow = true;
					}
				}
			}
			this.$toastr.success("恢复默认成功...");
		}
	},
	destroyed() {
		if (this.stateSave) {
			site.setSiteLocalStorage(this.stateName, this.columnList);
		}
	}
};
</script>
<style lang="less" rel="stylesheet/less" type="text/css" scoped>
.toggle-table-column {
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
