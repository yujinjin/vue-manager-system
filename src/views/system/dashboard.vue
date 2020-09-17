<template>
	<div class="dashboard" ref="dashboard">
		<el-row>
			<el-col :span="24">
				<!-- 报表1 -->
				<div style="border: 1px solid #e4e4e4; margin: 10px 5px; padding: 10px" class="echarts1" ref="echarts1" :style="{ height: height / 2 + 'px' }"></div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12">
				<!-- 报表2 -->
				<div style="border: 1px solid #e4e4e4; margin: 0px 5px; padding: 10px" class="echarts2" ref="echarts2" :style="{ height: height / 2 + 'px' }"></div>
			</el-col>
			<el-col :span="12">
				<!-- 报表3 -->
				<div style="border: 1px solid #e4e4e4; margin: 0px 5px; padding: 10px" class="echarts3" ref="echarts3" :style="{ height: height / 2 + 'px' }"></div>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import echarts1Option from "@js/data/echarts1.js";
import echarts2Option from "@js/data/echarts2.js";
import echarts3Option from "@js/data/echarts3.js";
export default {
	data() {
		return {
			// 报表实例1
			echarts1: null,
			// 报表实例1
			echarts2: null,
			// 报表实例3
			echarts3: null,
			height: 0
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.height = $(this.$refs["dashboard"]).height() - 50;
			require(["echarts"], echarts => {
				// 订单报表实例
				this.echarts1 = echarts.init(this.$refs["echarts1"]);
				this.echarts1.setOption(echarts1Option);
				this.echarts2 = echarts.init(this.$refs["echarts2"]);
				this.echarts2.setOption(echarts2Option);
				this.echarts3 = echarts.init(this.$refs["echarts3"]);
				this.echarts3.setOption(echarts3Option);
				console.info(this.echarts1);
			});
		}
	},
	destroyed() {
		if (this.echarts1) {
			this.echarts1.dispose();
		}
		if (this.echarts2) {
			this.echarts2.dispose();
		}
		if (this.echarts3) {
			this.echarts3.dispose();
		}
	}
};
</script>

<style lang="less" scoped>
.dashboard {
}
</style>
