<template>
    <div class="play-input">
        <h1>缓存路由测试</h1>
        <el-input v-model="input" placeholder="Please input" style="width: 350px" />
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

defineOptions({
    name: "play-input"
});

const input = ref("");
</script>
<style lang="scss" scoped>
.play-input {
}
</style>
