<template>
	<div class="settings">
		<el-card shadow="hover" class="card-form">
			<el-form :model="tokenForm" ref="tokenForm" label-width="200px">
				<el-form-item label="C端TOKEN过期时间：" prop="expiredTime" :rules="{ required: true, message: '请输入C端TOKEN过期时间' }"> <el-input-number v-model="tokenForm.expiredTime" :min="5" :max="100" label="TOKEN过期时间"></el-input-number> （天） </el-form-item>
			</el-form>
			<div class="button-panel">
				<el-button type="primary">保存</el-button>
			</div>
		</el-card>
		<el-card shadow="hover" class="card-form">
			<el-form :model="wechartTemplateForm" ref="wechartTemplateForm" label-width="200px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="订单成功（微信模板ID）：" prop="orderSuccess" :rules="{ required: true, message: '请输入订单成功微信模板ID' }">
							<el-input v-model="wechartTemplateForm.orderSuccess" placeholder="请输入订单支付成功微信模板ID"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="订单过期（微信模板ID）：" prop="orderSuccess" :rules="{ required: true, message: '请输入订单过期微信模板ID' }">
							<el-input v-model="wechartTemplateForm.orderexpiredTime" placeholder="请输入订单支付成功微信请输入订单过期微信模板ID模板ID"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="收益通知（微信模板ID）：" prop="noticeOfProceeds" :rules="{ required: true, message: '请输入收益通知微信模板ID' }">
							<el-input v-model="wechartTemplateForm.noticeOfProceeds" placeholder="请输入收益通知微信模板ID"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div class="button-panel">
				<el-button type="primary">保存</el-button>
			</div>
		</el-card>
	</div>
</template>
<script>
export default {
	data() {
		return {
			tokenForm: {
				expiredTime: 30
			},
			wechartTemplateForm: {
				orderSuccess: "bfalsafdsha-11lll21nfd-1sdashl",
				orderexpiredTime: "bfals2345dsha-11lll21nfd-1sdashl",
				noticeOfProceeds: "128a1dd7-bb87-4551-a03f-6832fa44dbe4"
			}
		};
	},
	methods: {
		init() {}
	}
};
</script>
<style lang="less" scoped>
.settings {
	padding-top: 10px;
	overflow-y: auto !important;

	.card-form {
		margin-bottom: 10px;
		flex-shrink: 0;
	}

	.button-panel {
		text-align: center;
	}
}
</style>
