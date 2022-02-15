<template>
	<div class="table-column-link">
		<a @click.stop :href="link" :target="target || '_self'">{{ label }}</a>
	</div>
</template>
<script>
export default {
	data() {
		return {
			link: ""
		};
	},
	props: {
		url: {
			type: [String, Function],
			require: true
		},
		label: String,
		target: {
			type: String,
			default: "_self"
		},
		row: Object
	},
	watch: {
		url() {
			this.genteratorLink();
		},
		row() {
			this.genteratorLink();
		}
	},
	mounted() {
		this.genteratorLink();
	},
	methods: {
		genteratorLink() {
			if (!this.url) {
				this.link = "";
				return;
			}
			if (typeof this.url == "string") {
				this.link = site.utils.stringFormat(this.url, this.row);
			} else if (typeof this.url == "function") {
				this.link = this.url(this.row);
				if (typeof this.link == "object") {
					this.link = this.$router.resolve(this.link).href;
				}
			}
		}
	}
};
</script>
<style lang="less" scoped></style>
