<template>
	<div class="m-common-table">
		<el-tabs class="m-head-nav" v-model="activeNavName" @tab-click="tabHandleClick">
			<el-tab-pane name="goods">
				<div slot="label" class="f-tab-pane">线上商品</div>
				<div class="m-content-container">
					<el-form :inline="true" label-width="70px" label-position="left" :model="search" class="demo-form-inline" @submit.native.stop="submitForm">
						<el-row class="m-search-box" :gutter="20">
							<el-col :span="6">
								<el-form-item label="商品ID">
									<el-input v-model="search.goodsId" placeholder="多个查询请换行或空格依次输入"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="商品编码">
									<el-input v-model="search.goodsCode" placeholder="多个查询请换行或空格依次输入"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="商品标题">
									<el-input v-model="search.goodsTitle" placeholder="请输入商品标题"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="商品类目">
									<el-select v-model="search.goodsType" placeholder="全部">
										<el-option v-for="item in classOption" :key="item.value" :label="item.name" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="商品类型">
									<el-select v-model="search.goodsClass" placeholder="全部">
										<el-option v-for="item in classOption" :key="item.value" :label="item.name" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :span="6">
								<el-form-item label="商品销售">
									<div class="m-sales-box">
										<el-input placeholder="0000" type="number" v-model="search.salesMin"> </el-input>
										<span>~</span>
										<el-input placeholder="9999" type="number" v-model="search.salesMax"> </el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="销售价格">
									<div class="m-sales-box">
										<el-input placeholder="0000" type="number" v-model="search.priceMin"> </el-input>
										<span>~</span>
										<el-input placeholder="9999" type="number" v-model="search.priceMax"> </el-input>
									</div>
								</el-form-item>
							</el-col>

							<el-col :span="6">
								<el-form-item label=" ">
									<el-button style="width: 100%" type="primary" native-type="submit">查询</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>

					<el-divider></el-divider>

					<div class="m-button-container" @change="goodsStatusChange">
						<el-radio-group v-model="goodsStatus">
							<el-radio-button v-for="item in goodsStatusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
						</el-radio-group>
						<el-button style="margin-left: 20px;" type="primary" icon="el-icon-plus">新增商品</el-button>
					</div>
					<el-divider></el-divider>
					<el-table ref="multipleTable" :data="tableData" :header-cell-style="{ backgroundColor: '#FAFAFA' }">
						<el-table-column type="selection" min-width="66" align="center" />
						<el-table-column label="商品" align="center">
							<template slot-scope="scoped">
								<div class="m-goods-info">
									<el-image class="u-img" :src="scoped.row.url" fit="cover">
										<div slot="error" class="image-slot">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
									<div>
										<p class="u-name">{{ scoped.row.goodsName }}</p>
										<p class="u-id">商品ID：{{ scoped.row.goodsId }}</p>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="price" width="100" label="价格" align="center" />
						<el-table-column prop="stock" width="100" label="库存" align="center" />
						<el-table-column prop="sales" width="100" label="销量" align="center" />
						<el-table-column prop="createTime" width="160" label="创建时间" align="center" />
						<el-table-column prop="putawayTime" width="160" label="上架时间" align="center" />
						<el-table-column label="操作" width="160" align="center">
							<template slot-scope="scoped">
								<el-row class="m-search-box" :gutter="10">
									<el-col :span="8">
										<el-button type="text" @click="handleClick(scoped.row)">编辑</el-button>
									</el-col>
									<el-col :span="8">
										<el-button type="text" @click="handleClick(scoped.row)">上架</el-button>
									</el-col>
									<el-col :span="8">
										<el-button type="text" @click="handleClick(scoped.row)">预览</el-button>
									</el-col>
								</el-row>
							</template>
						</el-table-column>
					</el-table>
					<div class="m-table-footer">
						<div class="m-buttons">
							<el-checkbox class="u-checkbox" v-model="checked" @change="selectionAll">全选</el-checkbox>
							<el-button type="primary" plain>批量下架</el-button>
							<el-button type="primary" plain>批量删除</el-button>
							<el-button type="primary" plain>批量设置</el-button>
						</div>

						<div class="m-pagination">
							<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="100" layout="prev, pager, next, jumper" :total="1000"> </el-pagination>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane name="upload-Record">
				<div slot="label" class="f-tab-pane">上传记录</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			activeNavName: "goods",
			search: {
				// 商品id
				goodsId: "",
				// 商品编码
				goodsCode: "",
				// 商品标题
				goodsTitle: "",
				// 商品类目
				goodsType: "",
				// 商品类型
				goodsClass: "",
				// 最低销售额
				salesMin: "",
				// 最高销售额
				salesMax: "",
				// 最低销售价格
				priceMin: "",
				// 最高销售价格
				priceMax: ""
			},
			classOption: [
				{
					label: "全部",
					value: ""
				},
				{
					label: "类别一",
					value: "class1"
				},
				{
					label: "类别二",
					value: "class2"
				}
			],
			// 商品状态
			goodsStatus: "",
			goodsStatusOptions: [
				{
					label: "在售中",
					value: 1
				},
				{
					label: "已售罄",
					value: 2
				},
				{
					label: "仓库中",
					value: 3
				}
			],
			// 表单数据
			tableData: new Array(20).fill({
				goodsPicUrl: "http://g.hiphotos.baidu.com/zhidao/pic/item/ac4bd11373f08202b4a9a53a4bfbfbedab641bff.jpg",
				goodsName: "超透气男款长袖 红色短袖 爆款居家必备套装",
				goodsId: "3257982095689",
				price: "299.30",
				stock: 242,
				sales: 1231,
				createTime: "2019-09-11 10:31",
				putawayTime: "2019-09-11 10:31"
			}),
			checked: false,
			currentPage: 1
		};
	},
	methods: {
		tabHandleClick() {
			console.log("菜单切换了,可以请求数据啦");
		},
		handleClick(data) {
			console.log("点击了");
			console.log(data);
		},
		// 提交搜索内容
		submitForm() {
			console.log("搜索内容：");
			console.log(this.search);
		},
		// 商品状态发生变化
		goodsStatusChange() {
			console.log(this.goodsStatus);
		},
		// 选择全部
		selectionAll() {
			if (this.checked) {
				this.$refs.multipleTable.toggleAllSelection();
			} else {
				this.$refs.multipleTable.clearSelection();
			}
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
		}
	}
};
</script>

<style lang="less" scoped>
.m-common-table {
	width: 100%;
	overflow: hidden;
}
.m-search-box {
	width: 100%;
	padding: 5px 10px;
	box-sizing: border-box;
}

.m-search-container {
	padding-left: 70px;
	width: 100%;
}
.m-sales-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	span {
		margin: 0 5px;
	}
}
.m-button-container {
	height: 60px;
	padding: 0 10px;
	display: flex;
	align-items: center;
}

.m-goods-info {
	display: flex;
	align-items: center;
	text-align: left;
	.u-img {
		width: 50px;
		height: 50px;
		border-radius: 2px;
		border: 1px solid #ddd;
		flex-shrink: 0;
		margin-right: 10px;
		/deep/ .image-slot {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			background: #f5f7fa;
			color: #909399;
		}
	}
	.u-name {
		font-size: 12px;
		color: #333;
		line-height: 17px;
	}
	.u-id {
		font-size: 12px;
		color: #999;
		line-height: 17px;
	}
}
.m-table-footer {
	background: #fafafa;
	padding: 10px 0;
	box-sizing: border-box;
	.m-buttons {
		height: 50px;
		display: flex;
		align-items: center;
		padding-left: 17px;
		.u-checkbox {
			margin-right: 30px;
		}
	}
}
.m-pagination {
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-right: 20px;
	box-sizing: border-box;
	> div {
		display: inline-block;
	}
}
.m-content-container {
	width: 100%;
}
</style>
