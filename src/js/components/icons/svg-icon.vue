<template>
	<i class="icon">
		<svg class="svg-icon" aria-hidden="true">
			<use :xlink:href="'#icon-' + value"></use>
		</svg>
	</i>
</template>

<script>
export default {
	name: "svg-icon",
	props: {
		value: {
			type: String,
			required: true,
			default: "warning-sign"
		}
	}
};
</script>

<style lang="less" scoped>
i.icon {
	display: inline-block;

	.svg-icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
}
</style>
