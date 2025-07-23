<template>
    <div class="play-cache">
        <h2>缓存路由测试</h2>
        <img alt="Vue logo" src="/logo.png" />
        <div class="contents-box">
            <el-alert show-icon title="说明" description="这里输入文案内容后，切换到其他页面去再打开此页面时，确认刚刚输入的内容文案没有变化" type="info" />
            <el-form-item label-width="120" label="输入内容：" style="margin-top: 24px">
                <el-input v-model="input" placeholder="Please input" style="width: 350px" />
            </el-form-item>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

defineOptions({
    name: "play-cache"
});

const input = ref("");
</script>
<style lang="scss" scoped>
.play-cache {
    text-align: center;

    .contents-box {
        margin: 0px auto;
        width: 600px;
        text-align: left;
    }
}
</style>
