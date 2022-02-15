<template>
	<div class="table-column-tags">
		<template v-if="tags.length > 0">
			<el-tag class="tag" v-for="(tag, index) in tags" :key="index">{{ tag }}</el-tag>
		</template>
		<template v-else>
			<el-tag effect="plain" type="info">无标签</el-tag>
		</template>
	</div>
</template>
<script>
export default {
	data() {
		return {
			tags: []
		};
	},
	props: {
		value: [String, Array]
	},
	watch: {
		value(val) {
			this.init();
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			if (!this.value) {
				this.tags = [];
				return;
			}
			if (typeof this.value == "string") {
				this.tags = this.value.split("|");
			} else {
				this.tags = this.value;
			}
		}
	}
};
</script>
<style lang="less" scoped>
.table-column-tags {
	.tag {
		margin-bottom: 5px;
		display: inline-block;

		&:not(:first-child) {
			margin-left: 5px;
		}
	}
}
</style>
