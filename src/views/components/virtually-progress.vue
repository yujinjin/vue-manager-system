<!--
 * @创建者: yujinjin9@126.com
 * @描述: 虚构的进度条
-->
<template>
    <div class="virtually-progress">
        <el-progress v-bind="progressAttributes" :percentage="percentage" />
        <div class="tips-text"><slot></slot></div>
    </div>
</template>
<script setup lang="ts">
import { type ProgressProps } from "element-plus";
import { type PropType, onUnmounted, ref, watch, onMounted, computed } from "vue";

const props = defineProps({
    // 实际进度是否完成
    finished: {
        type: Boolean,
        default: false
    },
    // 进度条成长的比例,数值在(0, 1)之间
    ratio: {
        type: Number,
        default: 0.1,
        validator: function (value: number) {
            return value < 1 && value > 0;
        }
    },
    // 进度条成长变化的间隔时间(单位：毫秒)
    time: {
        type: Number,
        default: 500
    },
    progress: {
        type: Object as PropType<ProgressProps>,
        default: function () {
            return {};
        }
    }
});

// 进度条完成之后事件
const emits = defineEmits(["afterFinished"]);

// 进度条值
const percentage = ref(0);

// 定时器ID
let timeIntervalId = 0;

// 进度条自定义属性
const progressAttributes = computed<ProgressProps>(() => {
    return Object.assign({ textInside: true, strokeWidth: 26 }, props.progress);
});

// 开始运行
const start = function () {
    percentage.value = 0;
    if (timeIntervalId) {
        window.clearInterval(timeIntervalId);
    }
    let ratio = props.ratio;
    let times = 0;
    timeIntervalId = window.setInterval(() => {
        ++times;
        if (percentage.value === 100) {
            window.clearInterval(timeIntervalId);
            timeIntervalId = 0;
            // 进度条动画执行完成
            emits("afterFinished");
            return;
        } else if (percentage.value > 95 && props.finished) {
            percentage.value = 100;
            return;
        } else if (props.finished) {
            // 当前实际动作已经执行完成，这里加快精度条成长
            ratio = 1;
        } else if (percentage.value > 80) {
            ratio = 2 * props.ratio;
        } else {
            ratio = props.ratio * (times % 10);
        }
        percentage.value = parseInt((percentage.value + (99 - percentage.value) * ratio * Math.random()).toFixed(4), 10);
    }, props.time);
};

watch(
    () => props.finished,
    value => {
        if (!value) {
            start();
        }
    }
);

onMounted(() => {
    start();
});

onUnmounted(() => {
    if (timeIntervalId) {
        window.clearInterval(timeIntervalId);
    }
});
</script>
<style lang="scss" scoped>
.virtually-progress {
    width: 100%;

    .tips-text {
        padding-top: 12px;
        text-align: center;
        font-size: 12px;
    }
}
</style>
