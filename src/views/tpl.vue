<template>
    <div class="tpl">{{ isShow }}</div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";

const isShow: Ref<boolean> = ref(false);
</script>
<style lang="less" scoped>
.tpl {
}
</style>
