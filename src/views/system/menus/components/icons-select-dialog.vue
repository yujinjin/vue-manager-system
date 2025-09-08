<!--
 * @创建者: yujinjin9@126.com
 * @描述: 菜单图标选择弹窗
-->
<template>
    <el-dialog :model-value="isShow" title="菜单图标" append-to-body class="common-dialog" width="800px" @update:model-value="close">
        <el-tabs v-model="tabIndex" type="border-card">
            <el-tab-pane label="选择系统定义的图标" :name="0">
                <div class="icon-list">
                    <div v-for="(icon, index) in icons" :key="icon" class="icon-item" :class="{ actived: index === selectedIconIndex }" @click="selectedIconIndex = index">
                        <i :class="icon"></i>
                        <span class="icon-name">{{ icon }}</span>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="自定义上传图片" :name="1">
                <img-upload v-model="uploadImage" :upload-props="{ limit: 1 }" />
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" :disabled="isDisabled" @click="saveHandle">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { type PropType, computed, ref } from "vue";

defineProps({
    isShow: {
        type: Boolean as PropType<boolean>,
        default: false
    }
});

const emits = defineEmits(["update:isShow", "save"]);

const tabIndex = ref(0);

// 当前系统icon列表
const icons = ref([
    "icomoon-more",
    "icomoon-home",
    "icomoon-home2",
    "icomoon-home3",
    "icomoon-office",
    "icomoon-newspaper",
    "icomoon-pencil",
    "icomoon-pencil2",
    "icomoon-quill",
    "icomoon-pen",
    "icomoon-blog",
    "icomoon-eyedropper",
    "icomoon-droplet",
    "icomoon-paint-format",
    "icomoon-images",
    "icomoon-image",
    "icomoon-camera",
    "icomoon-headphones",
    "icomoon-music",
    "icomoon-play",
    "icomoon-film",
    "icomoon-video-camera",
    "icomoon-dice",
    "icomoon-pacman",
    "icomoon-spades",
    "icomoon-clubs",
    "icomoon-diamonds",
    "icomoon-bullhorn",
    "icomoon-connection",
    "icomoon-podcast",
    "icomoon-feed",
    "icomoon-mic",
    "icomoon-book",
    "icomoon-books",
    "icomoon-library",
    "icomoon-file-text",
    "icomoon-profile",
    "icomoon-file-empty",
    "icomoon-files-empty",
    "icomoon-file-text2",
    "icomoon-file-picture",
    "icomoon-file-music",
    "icomoon-file-play",
    "icomoon-file-video",
    "icomoon-file-zip",
    "icomoon-copy",
    "icomoon-paste",
    "icomoon-stack",
    "icomoon-folder",
    "icomoon-folder-open",
    "icomoon-folder-plus",
    "icomoon-folder-minus",
    "icomoon-folder-download",
    "icomoon-folder-upload",
    "icomoon-price-tag",
    "icomoon-price-tags",
    "icomoon-barcode",
    "icomoon-qrcode",
    "icomoon-ticket",
    "icomoon-cart",
    "icomoon-coin-dollar",
    "icomoon-coin-euro",
    "icomoon-coin-pound",
    "icomoon-coin-yen",
    "icomoon-credit-card",
    "icomoon-calculator",
    "icomoon-lifebuoy",
    "icomoon-phone",
    "icomoon-phone-hang-up",
    "icomoon-address-book",
    "icomoon-envelop",
    "icomoon-pushpin",
    "icomoon-location",
    "icomoon-location2",
    "icomoon-compass",
    "icomoon-compass2",
    "icomoon-map",
    "icomoon-map2",
    "icomoon-history",
    "icomoon-clock",
    "icomoon-clock2",
    "icomoon-alarm",
    "icomoon-bell",
    "icomoon-stopwatch",
    "icomoon-calendar",
    "icomoon-printer",
    "icomoon-keyboard",
    "icomoon-display",
    "icomoon-laptop",
    "icomoon-mobile",
    "icomoon-mobile2",
    "icomoon-tablet",
    "icomoon-tv",
    "icomoon-drawer",
    "icomoon-drawer2",
    "icomoon-box-add",
    "icomoon-box-remove",
    "icomoon-download",
    "icomoon-upload",
    "icomoon-floppy-disk",
    "icomoon-drive",
    "icomoon-database",
    "icomoon-undo",
    "icomoon-redo",
    "icomoon-undo2",
    "icomoon-redo2",
    "icomoon-forward",
    "icomoon-reply",
    "icomoon-bubble",
    "icomoon-bubbles",
    "icomoon-bubbles2",
    "icomoon-bubble2",
    "icomoon-bubbles3",
    "icomoon-bubbles4",
    "icomoon-user",
    "icomoon-users",
    "icomoon-user-plus",
    "icomoon-user-minus",
    "icomoon-user-check",
    "icomoon-user-tie",
    "icomoon-quotes-left",
    "icomoon-quotes-right",
    "icomoon-hour-glass",
    "icomoon-spinner",
    "icomoon-spinner2",
    "icomoon-spinner3",
    "icomoon-spinner4",
    "icomoon-spinner5",
    "icomoon-spinner6",
    "icomoon-spinner7",
    "icomoon-spinner8",
    "icomoon-spinner9",
    "icomoon-spinner10",
    "icomoon-spinner11",
    "icomoon-binoculars",
    "icomoon-search",
    "icomoon-zoom-in",
    "icomoon-zoom-out",
    "icomoon-enlarge",
    "icomoon-shrink",
    "icomoon-enlarge2",
    "icomoon-shrink2",
    "icomoon-key",
    "icomoon-key2",
    "icomoon-lock",
    "icomoon-unlocked",
    "icomoon-wrench",
    "icomoon-equalizer",
    "icomoon-equalizer2",
    "icomoon-cog",
    "icomoon-cogs",
    "icomoon-hammer",
    "icomoon-magic-wand",
    "icomoon-aid-kit",
    "icomoon-bug",
    "icomoon-pie-chart",
    "icomoon-stats-dots",
    "icomoon-stats-bars",
    "icomoon-stats-bars2",
    "icomoon-trophy",
    "icomoon-gift",
    "icomoon-glass",
    "icomoon-glass2",
    "icomoon-mug",
    "icomoon-spoon-knife",
    "icomoon-leaf",
    "icomoon-rocket",
    "icomoon-meter",
    "icomoon-meter2",
    "icomoon-hammer2",
    "icomoon-fire",
    "icomoon-lab",
    "icomoon-magnet",
    "icomoon-bin",
    "icomoon-bin2",
    "icomoon-briefcase",
    "icomoon-airplane",
    "icomoon-truck",
    "icomoon-road",
    "icomoon-accessibility",
    "icomoon-target",
    "icomoon-shield",
    "icomoon-power",
    "icomoon-switch",
    "icomoon-power-cord",
    "icomoon-clipboard",
    "icomoon-list-numbered",
    "icomoon-list2",
    "icomoon-list",
    "icomoon-tree",
    "icomoon-menu",
    "icomoon-menu2",
    "icomoon-menu3",
    "icomoon-menu4",
    "icomoon-cloud",
    "icomoon-cloud-download",
    "icomoon-cloud-upload",
    "icomoon-cloud-check",
    "icomoon-download2",
    "icomoon-upload2",
    "icomoon-download3",
    "icomoon-upload3",
    "icomoon-sphere",
    "icomoon-earth",
    "icomoon-link",
    "icomoon-flag",
    "icomoon-attachment",
    "icomoon-eye",
    "icomoon-eye-plus",
    "icomoon-eye-minus",
    "icomoon-eye-blocked",
    "icomoon-bookmark",
    "icomoon-bookmarks",
    "icomoon-sun",
    "icomoon-contrast",
    "icomoon-brightness-contrast",
    "icomoon-star-empty",
    "icomoon-star-half",
    "icomoon-star-full",
    "icomoon-heart",
    "icomoon-heart-broken",
    "icomoon-man",
    "icomoon-woman",
    "icomoon-man-woman",
    "icomoon-happy",
    "icomoon-happy2",
    "icomoon-smile",
    "icomoon-smile2",
    "icomoon-tongue",
    "icomoon-tongue2",
    "icomoon-sad",
    "icomoon-sad2",
    "icomoon-wink",
    "icomoon-wink2",
    "icomoon-grin",
    "icomoon-grin2",
    "icomoon-cool",
    "icomoon-cool2",
    "icomoon-angry",
    "icomoon-angry2",
    "icomoon-evil",
    "icomoon-evil2",
    "icomoon-shocked",
    "icomoon-shocked2",
    "icomoon-baffled",
    "icomoon-baffled2",
    "icomoon-confused",
    "icomoon-confused2",
    "icomoon-neutral",
    "icomoon-neutral2",
    "icomoon-hipster",
    "icomoon-hipster2",
    "icomoon-wondering",
    "icomoon-wondering2",
    "icomoon-sleepy",
    "icomoon-sleepy2",
    "icomoon-frustrated",
    "icomoon-frustrated2",
    "icomoon-crying",
    "icomoon-crying2",
    "icomoon-point-up",
    "icomoon-point-right",
    "icomoon-point-down",
    "icomoon-point-left",
    "icomoon-warning",
    "icomoon-notification",
    "icomoon-question",
    "icomoon-plus",
    "icomoon-minus",
    "icomoon-info",
    "icomoon-cancel-circle",
    "icomoon-blocked",
    "icomoon-cross",
    "icomoon-checkmark",
    "icomoon-checkmark2",
    "icomoon-spell-check",
    "icomoon-enter",
    "icomoon-exit",
    "icomoon-play2",
    "icomoon-pause",
    "icomoon-stop",
    "icomoon-previous",
    "icomoon-next",
    "icomoon-backward",
    "icomoon-forward2",
    "icomoon-play3",
    "icomoon-pause2",
    "icomoon-stop2",
    "icomoon-backward2",
    "icomoon-forward3",
    "icomoon-first",
    "icomoon-last",
    "icomoon-previous2",
    "icomoon-next2",
    "icomoon-eject",
    "icomoon-volume-high",
    "icomoon-volume-medium",
    "icomoon-volume-low",
    "icomoon-volume-mute",
    "icomoon-volume-mute2",
    "icomoon-volume-increase",
    "icomoon-volume-decrease",
    "icomoon-loop",
    "icomoon-loop2",
    "icomoon-infinite",
    "icomoon-shuffle",
    "icomoon-arrow-up-left",
    "icomoon-arrow-up",
    "icomoon-arrow-up-right",
    "icomoon-arrow-right",
    "icomoon-arrow-down-right",
    "icomoon-arrow-down",
    "icomoon-arrow-down-left",
    "icomoon-arrow-left",
    "icomoon-arrow-up-left2",
    "icomoon-arrow-up2",
    "icomoon-arrow-up-right2",
    "icomoon-arrow-right2",
    "icomoon-arrow-down-right2",
    "icomoon-arrow-down2",
    "icomoon-arrow-down-left2",
    "icomoon-arrow-left2",
    "icomoon-circle-up",
    "icomoon-circle-right",
    "icomoon-circle-down",
    "icomoon-circle-left",
    "icomoon-tab",
    "icomoon-move-up",
    "icomoon-move-down",
    "icomoon-sort-alpha-asc",
    "icomoon-sort-alpha-desc",
    "icomoon-sort-numeric-asc",
    "icomoon-sort-numberic-desc",
    "icomoon-sort-amount-asc",
    "icomoon-sort-amount-desc",
    "icomoon-command",
    "icomoon-shift",
    "icomoon-ctrl",
    "icomoon-opt",
    "icomoon-checkbox-checked",
    "icomoon-checkbox-unchecked",
    "icomoon-radio-checked",
    "icomoon-radio-checked2",
    "icomoon-radio-unchecked",
    "icomoon-crop",
    "icomoon-make-group",
    "icomoon-ungroup",
    "icomoon-scissors",
    "icomoon-filter",
    "icomoon-font",
    "icomoon-ligature",
    "icomoon-ligature2",
    "icomoon-text-height",
    "icomoon-text-width",
    "icomoon-font-size",
    "icomoon-bold",
    "icomoon-underline",
    "icomoon-italic",
    "icomoon-strikethrough",
    "icomoon-omega",
    "icomoon-sigma",
    "icomoon-page-break",
    "icomoon-superscript",
    "icomoon-subscript",
    "icomoon-superscript2",
    "icomoon-subscript2",
    "icomoon-text-color",
    "icomoon-pagebreak",
    "icomoon-clear-formatting",
    "icomoon-table",
    "icomoon-table2",
    "icomoon-insert-template",
    "icomoon-pilcrow",
    "icomoon-ltr",
    "icomoon-rtl",
    "icomoon-section",
    "icomoon-paragraph-left",
    "icomoon-paragraph-center",
    "icomoon-paragraph-right",
    "icomoon-paragraph-justify",
    "icomoon-indent-increase",
    "icomoon-indent-decrease",
    "icomoon-share",
    "icomoon-new-tab",
    "icomoon-embed",
    "icomoon-embed2",
    "icomoon-terminal",
    "icomoon-share2",
    "icomoon-mail",
    "icomoon-mail2",
    "icomoon-mail3",
    "icomoon-mail4",
    "icomoon-amazon",
    "icomoon-google",
    "icomoon-google2",
    "icomoon-google3",
    "icomoon-google-plus",
    "icomoon-google-plus2",
    "icomoon-google-plus3",
    "icomoon-hangouts",
    "icomoon-google-drive",
    "icomoon-facebook",
    "icomoon-facebook2",
    "icomoon-instagram",
    "icomoon-whatsapp",
    "icomoon-spotify",
    "icomoon-telegram",
    "icomoon-twitter",
    "icomoon-vine",
    "icomoon-vk",
    "icomoon-renren",
    "icomoon-sina-weibo",
    "icomoon-rss",
    "icomoon-rss2",
    "icomoon-youtube",
    "icomoon-youtube2",
    "icomoon-twitch",
    "icomoon-vimeo",
    "icomoon-vimeo2",
    "icomoon-lanyrd",
    "icomoon-flickr",
    "icomoon-flickr2",
    "icomoon-flickr3",
    "icomoon-flickr4",
    "icomoon-dribbble",
    "icomoon-behance",
    "icomoon-behance2",
    "icomoon-deviantart",
    "icomoon-500px",
    "icomoon-steam",
    "icomoon-steam2",
    "icomoon-dropbox",
    "icomoon-onedrive",
    "icomoon-github",
    "icomoon-npm",
    "icomoon-basecamp",
    "icomoon-trello",
    "icomoon-wordpress",
    "icomoon-joomla",
    "icomoon-ello",
    "icomoon-blogger",
    "icomoon-blogger2",
    "icomoon-tumblr",
    "icomoon-tumblr2",
    "icomoon-yahoo",
    "icomoon-yahoo2",
    "icomoon-tux",
    "icomoon-appleinc",
    "icomoon-finder",
    "icomoon-android",
    "icomoon-windows",
    "icomoon-windows8",
    "icomoon-soundcloud",
    "icomoon-soundcloud2",
    "icomoon-skype",
    "icomoon-reddit",
    "icomoon-hackernews",
    "icomoon-wikipedia",
    "icomoon-linkedin",
    "icomoon-linkedin2",
    "icomoon-lastfm",
    "icomoon-lastfm2",
    "icomoon-delicious",
    "icomoon-stumbleupon",
    "icomoon-stumbleupon2",
    "icomoon-stackoverflow",
    "icomoon-pinterest",
    "icomoon-pinterest2",
    "icomoon-xing",
    "icomoon-xing2",
    "icomoon-flattr",
    "icomoon-foursquare",
    "icomoon-yelp",
    "icomoon-paypal",
    "icomoon-chrome",
    "icomoon-firefox",
    "icomoon-IE",
    "icomoon-edge",
    "icomoon-safari",
    "icomoon-opera",
    "icomoon-file-pdf",
    "icomoon-file-openoffice",
    "icomoon-file-word",
    "icomoon-file-excel",
    "icomoon-libreoffice",
    "icomoon-html-five",
    "icomoon-html-five2",
    "icomoon-css3",
    "icomoon-git",
    "icomoon-codepen",
    "icomoon-svg",
    "icomoon-icomoon"
]);

const uploadImage = ref<string>();

// 当前选中图标的索引
const selectedIconIndex = ref<number>(-1);

// 当前保存按钮禁用状态
const isDisabled = computed<boolean>(() => {
    if (tabIndex.value === 0 && selectedIconIndex.value === -1) {
        return true;
    } else if (tabIndex.value === 1 && !uploadImage.value) {
        return true;
    }
    return false;
});

// 关闭
const close = function () {
    emits("update:isShow");
};

// 保存
const saveHandle = function () {
    if (tabIndex.value === 0) {
        emits("save", icons.value[selectedIconIndex.value]);
    } else if (tabIndex.value === 1) {
        emits("save", uploadImage.value);
    }
    close();
};
</script>
<style lang="scss" scoped>
.el-tabs {
    height: 400px;
    margin-bottom: 12px;
}

.icon-list {
    border-top: 1px solid #dcdfe6;
    border-left: 1px solid #dcdfe6;
    border-radius: 4px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    margin: 20px auto;
    width: 100%;
    height: 290px;
    overflow-y: auto;

    .icon-item {
        color: #606266;
        height: 90px;
        font-size: 13px;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        transition: background-color 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;

        &:hover {
            background-color: #f2f6fc;
        }

        i {
            font-size: 20px;
        }

        .icon-name {
            margin-top: 8px;
            text-align: center;
        }

        &.actived {
            background-color: #f2f6fc;
            color: var(--el-color-primary);
        }
    }
}

.img-upload {
    padding: 44px;
}
</style>
