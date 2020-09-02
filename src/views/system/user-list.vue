<template>
	<!--
        作者：yujinjin9@126.com
        时间：2019-01-21
        描述：列表查询页
    -->
	<div class="user-list">
		<!--
            作者：yujinjin9@126.com
            时间：2019-01-21
            描述：列表过滤栏
        -->
		<search-form :fields="fields" @search="queryList" @change="filterChange"></search-form>
		<!--
            作者：yujinjin9@126.com
            时间：2019-01-21
            描述：列表操作栏
        -->
		<action-bar :buttons="handleButtons" @click="handleButton"></action-bar>

		<!--
            作者：yujinjin9@126.com
            时间：2019-01-21
            描述：数据列表栏
        -->
		<div class="data-table-box">
			<video-upload :fileList="fileList" :limit="3" @on-change="change"></video-upload>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			fileList: [],
			fields: [
				{
					name: "filter",
					label: "系统用户"
				},
				{
					slot: "other"
				}
			],
			handleButtons: [
				{
					action: "add",
					label: "新增",
					click: this.add
				}
			]
		};
	},
	methods: {
		init() {
			for (let i = 0; i < 16; i++) {
				this.handleButtons.push({
					action: "add" + i,
					label: "新增测试" + i,
					click: this.add
				});
			}
		},
		add() {
			console.info(this.searchForm);
		},
		handleButton(action) {
			console.info(action);
		},
		change(fileList) {
			console.info(fileList);
		}
	}
};
</script>
<style lang="less" scoped></style>
