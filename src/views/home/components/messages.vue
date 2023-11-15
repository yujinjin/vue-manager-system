<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-11-15 18:22:22
 * @项目的路径: \vue-manager-system\src\views\home\components\messages.vue
 * @描述: 消息列表
-->
<template>
    <el-dropdown @command="messageCommandHandle">
        <span class="el-dropdown-link">
            <el-badge :value="unreadMessages.length" :max="99" :hidden="unreadMessages.length <= 0">
                <el-icon><ChatLineRound /></el-icon>
            </el-badge>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <template v-if="unreadMessages.length > 0">
                    <el-dropdown-item v-for="(messageItem, index) in unreadMessages.slice(0, 4)" :key="messageItem.id" :command="index">
                        <div class="message-item">
                            <div class="avatar-img">
                                <img v-if="messageItem.senderAvatar" :src="messageItem.senderAvatar" />
                                <img v-else src="@imgs/test/head.png" />
                            </div>
                            <div class="inner-info">
                                <div class="title-text text-ellipsis-block">{{ messageItem.title }}</div>
                                <div class="subtitle-text text-ellipsis-block">{{ messageItem.content }}</div>
                                <div class="time-text">{{ timeDifferenceFormat(messageItem.sendTime) }}</div>
                            </div>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <div class="message-footer">
                            <div class="text-box">查看更多</div>
                            <div class="text-box">清空消息</div>
                        </div>
                    </el-dropdown-item>
                </template>
                <template v-else>
                    <el-dropdown-item :command="-1">
                        <div class="message-item no-data">
                            <i class="icomoon-info"></i>
                            没有未读消息
                        </div>
                    </el-dropdown-item>
                </template>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { ChatLineRound } from "@element-plus/icons-vue";
import systemAPI from "@api/system";
import { timeDifferenceFormat } from "@yujinjin/utils";

const unreadMessages: Ref<Record<string, any>[]> = ref([]);

// 查询未读消息列表
const queryUnreadMessages = async function () {
    unreadMessages.value = (await systemAPI.queryUnreadMessages()) as Record<string, any>[];
};

// 消息查看
const messageCommandHandle = function (index) {
    logs.info("messageCommandHandle........." + unreadMessages.value[index]);
};

queryUnreadMessages();
</script>
<style lang="scss" scoped>
.el-icon {
    color: #606266;
    font-size: 18px;
}

:deep(.el-dropdown-menu__item) {
    padding: 0px;
}

.message-item {
    padding: 8px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f7f7f7;

    // &:hover {
    //     background-color: #f7f7f7;
    // }

    .avatar-img {
        height: 40px;
        width: 40px;
        flex-shrink: 0;

        img {
            height: 40px;
            width: 40px;
        }
    }

    .inner-info {
        flex: 1;
        width: 180px;
        padding-left: 5px;
        line-height: 18px;
        display: flex;
        flex-direction: column;

        .title-text {
            font-size: 12px;
        }

        .subtitle-text {
            font-size: 12px;
            color: #999999;
        }

        .time-text {
            text-align: right;
            font-size: 11px;
            color: var(--el-color-primary);
            line-height: 12px;
        }
    }
}

.message-footer {
    display: flex;
    text-align: center;
    width: 100%;
    font-size: 12px;
    line-height: 32px;
    color: #666;

    &:hover {
        background-color: #fff;
    }

    .text-box {
        flex: 1;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}
</style>
