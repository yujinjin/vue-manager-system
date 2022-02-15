<template>
	<div class="m-common-form">
		<el-form class="m-form-container1" ref="form" :model="form1" label-width="80px">
			<el-form-item label="活动名称">
				<el-input v-model="form1.name"></el-input>
			</el-form-item>
			<el-form-item label="活动区域">
				<el-select v-model="form1.region" placeholder="请选择活动区域">
					<el-option label="区域一" value="shanghai"></el-option>
					<el-option label="区域二" value="beijing"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="活动时间">
				<el-col :span="11">
					<el-date-picker type="date" placeholder="选择日期" v-model="form1.date1" style="width: 100%"></el-date-picker>
				</el-col>
				<el-col style="text-align: center" :span="2">-</el-col>
				<el-col :span="11">
					<el-time-picker placeholder="选择时间" v-model="form1.date2" style="width: 100%"></el-time-picker>
				</el-col>
			</el-form-item>
			<el-form-item label="即时配送">
				<el-switch v-model="form1.delivery"></el-switch>
			</el-form-item>
			<el-form-item label="活动性质">
				<el-checkbox-group v-model="form1.type">
					<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
					<el-checkbox label="地推活动" name="type"></el-checkbox>
					<el-checkbox label="线下主题活动" name="type"></el-checkbox>
					<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="特殊资源">
				<el-radio-group v-model="form1.resource">
					<el-radio label="线上品牌商赞助"></el-radio>
					<el-radio label="线下场地免费"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="活动形式">
				<el-input type="textarea" v-model="form1.desc"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">立即创建</el-button>
			</el-form-item>
		</el-form>

		<el-form class="m-form-container2" ref="form" :model="form2" label-width="80px">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="活动名称">
						<el-input v-model="form2.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="活动区域">
						<el-select v-model="form2.region" placeholder="请选择活动区域">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="活动区域">
						<el-select v-model="form2.region" placeholder="请选择活动区域">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item class="m-block-box" inline="true" label="活动时间">
						<el-row>
							<el-col :span="14">
								<el-date-picker type="date" placeholder="选择日期" v-model="form2.date1" style="width: 100%"></el-date-picker>
							</el-col>
							<el-col style="text-align: center" :span="2">-</el-col>
							<el-col :span="8">
								<el-time-picker placeholder="选择时间" v-model="form2.date2" style="width: 100%"></el-time-picker>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="即时配送">
						<el-switch v-model="form2.delivery"></el-switch>
					</el-form-item>
				</el-col>
			</el-row>

			<el-form-item label="活动性质">
				<el-checkbox-group v-model="form2.type">
					<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
					<el-checkbox label="地推活动" name="type"></el-checkbox>
					<el-checkbox label="线下主题活动" name="type"></el-checkbox>
					<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="特殊资源">
				<el-radio-group v-model="form2.resource">
					<el-radio label="线上品牌商赞助"></el-radio>
					<el-radio label="线下场地免费"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="活动形式">
				<el-input type="textarea" v-model="form2.desc"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">立即创建</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
export default {
	data() {
		return {
			form1: {
				name: "",
				region: "",
				date1: "",
				date2: "",
				delivery: false,
				type: [],
				resource: "",
				desc: ""
			},
			form2: {
				name: "",
				region: "",
				date1: "",
				date2: "",
				delivery: false,
				type: [],
				resource: "",
				desc: ""
			}
		};
	},
	methods: {
		onSubmit() {
			site.api.service.app.menu.get().then(res => {
				console.log(res);
			});
			console.log("submit!");
		}
	}
};
</script>

<style lang="scss" scoped>
.m-common-form {
	padding: 20px;
}
.m-form-container1 {
	width: 400px;
	margin: 0 auto;
}
.m-form-container2 {
	.m-block-box {
		width: 100%;
		/deep/ .el-form-item__content {
			width: auto;
		}
	}
}
</style>
