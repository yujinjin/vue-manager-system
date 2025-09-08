<template>
    <div class="login">
        <div class="header">
            <div class="logo-img">
                <img src="/logo.png" />
            </div>
            <div class="title-text">平台管理系统</div>
        </div>
        <div class="form-panel">
            <div class="form-box">
                <div class="tabs">
                    <template v-if="loginType == 0 || loginType == 1">
                        <div class="tab-text" :class="{ active: loginType == 0 }" @click="loginType = 0">密码登录</div>
                        <div class="divider-bar"></div>
                        <div class="tab-text" :class="{ active: loginType == 1 }" @click="loginType = 1">验证码登录</div>
                        <div class="tab-qrcode">
                            <img class="qrcode-tips" src="@imgs/login/qrcode-tips.png" />
                            <img class="qrcode-icon" src="@imgs/login/qrcode-icon.png" @click="loginType = 2" />
                        </div>
                    </template>
                    <template v-else>
                        <div class="tab-text active">扫码登录</div>
                        <div class="tab-qrcode">
                            <img class="password-tips" src="@imgs/login/password-tips.png" />
                            <img class="computer-icon" src="@imgs/login/computer-icon.png" @click="loginType = 0" />
                        </div>
                    </template>
                </div>
                <div v-show="loginType == 0">
                    <div class="input-row" :class="{ active: activeInputType == 0 }">
                        <div class="input-box">
                            <input v-model="inputForm.userName" type="text" maxlength="20" placeholder="登录用户名" @focus="activeInputType = 0" @blur="activeInputType = -1" />
                        </div>
                    </div>
                    <div class="input-row" :class="{ active: activeInputType == 1 }">
                        <div class="input-box">
                            <input
                                v-model="inputForm.password"
                                maxlength="20"
                                :type="isShowPassword ? 'text' : 'password'"
                                placeholder="登录密码"
                                @keyup.enter="submitHandle"
                                @focus="activeInputType = 1"
                                @blur="activeInputType = -1"
                            />
                        </div>
                        <div class="icon-box" @click="isShowPassword = !isShowPassword">
                            <img v-if="isShowPassword" src="@imgs/login/eye-open-icon.png" />
                            <img v-else src="@imgs/login/eye-close-icon.png" />
                        </div>
                    </div>
                </div>
                <div v-show="loginType == 1">
                    <div class="input-row" :class="{ active: activeInputType == 2 }">
                        <div class="label-text">中国 +86</div>
                        <div class="input-box">
                            <input
                                v-model="inputForm.mobile"
                                type="text"
                                maxlength="15"
                                placeholder="登录手机号"
                                @keyup="checkNumber('mobile')"
                                @focus="activeInputType = 2"
                                @blur="activeInputType = -1"
                            />
                        </div>
                    </div>
                    <div class="input-row" :class="{ active: activeInputType == 3 }">
                        <div class="input-box">
                            <input
                                v-model="inputForm.code"
                                type="text"
                                maxlength="8"
                                placeholder="填写短信验证码"
                                @keyup.enter="submitHandle"
                                @keyup="checkNumber('code')"
                                @focus="activeInputType = 3"
                                @blur="activeInputType = -1"
                            />
                        </div>
                        <div class="code-text" @click="sendValidateCodeHandle">
                            {{ countDownSecond === -1 ? "获取短信验证码" : countDownSecond === 0 ? "重新发送验证码" : countDownSecond + "s后重新发送" }}
                        </div>
                    </div>
                </div>
                <div v-show="loginType == 2">
                    <div :key="0" class="qrcode-box">
                        <div v-loading="isLoadingForQRcode" class="qrcode-img">
                            <img :src="qrcodeImgUrl!" />
                        </div>
                        <div v-show="isTimeoutForQrcode" class="mask">
                            <div class="timeout-tips-text">二维码已失效</div>
                            <div class="btn-refresh" @click="refreshQrcode">点击刷新</div>
                        </div>
                    </div>
                    <div class="tips-text">请使用微信APP扫码登录</div>
                    <div class="wechat-icon-box">
                        <img src="@imgs/login/wechat-icon.png" />
                    </div>
                </div>
                <div v-show="loginType == 0 || loginType == 1" class="btn-panel">
                    <div class="btn" @click="submitHandle">登 录</div>
                </div>
            </div>
        </div>
        <div class="footer">软件科技有限公司所有 Copyright Right @2020</div>
    </div>
</template>
<script setup lang="ts">
import { type Ref, onUnmounted, ref, reactive, watch } from "vue";
import { type RouteLocationNormalizedLoaded, type Router, useRoute, useRouter } from "vue-router";
import QRCode from "qrcode";
import { ElMessage } from "element-plus";
import { chinaPhoneNumberValidate } from "@yujinjin/utils";
import { storageStore } from "@/stores/";
import systemAPI from "@api/system";

// 当前路由
const route: RouteLocationNormalizedLoaded = useRoute();

// 全局路由对象
const router: Router = useRouter();

// 本地存储状态管理
const store = storageStore();

// 登录方式 0: 密码登录, 1: 验证码登录 2: 扫码登录
const loginType: Ref<number> = ref(0);

// 是否显示输入的密码
const isShowPassword: Ref<boolean> = ref(false);

// 二维码图片
const qrcodeImgUrl: Ref<string | null> = ref(null);

// 是否正在加载二维码
const isLoadingForQRcode: Ref<boolean> = ref(false);

// 二维码是否超时
const isTimeoutForQrcode: Ref<boolean> = ref(false);

// 输入框激活类型
const activeInputType: Ref<number> = ref(-1);

const countDownSecond: Ref<number> = ref(-1);

// 登录表单
const inputForm = reactive<Record<string, string>>({
    userName: "", // 用户名|手机号
    password: "", // 密码
    mobile: "", // 手机号
    code: "" // 验证码
});

// 二维码超时定时器
let qrcodeTimerId: null | number = null;

// 定时器ID
let countDownTimerId: null | number = null;

// 初始化二维码
const initQrcode = async function () {
    if (isLoadingForQRcode.value) {
        return;
    }
    isLoadingForQRcode.value = true;
    try {
        await new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
        qrcodeImgUrl.value = await QRCode.toDataURL("https://github.com/yujinjin/vue-manager-system.git", {
            errorCorrectionLevel: "H",
            type: "image/jpeg",
            margin: 1,
            width: 120,
            color: {
                dark: "#000000",
                light: "#ffffff"
            }
        });
        qrcodeTimerId = window.setTimeout(() => {
            isTimeoutForQrcode.value = true;
        }, 6000);
    } catch (error) {
        ElMessage.error("二维码加载失败，请点击刷新重新生成");
    }
    isLoadingForQRcode.value = false;
};

// 刷新二维码
const refreshQrcode = function () {
    isTimeoutForQrcode.value = false;
    initQrcode();
};

// 验证数字
const checkNumber = function (name: string) {
    if (!inputForm[name]) return false;
    const reg = /[^\d]/g;
    if (reg.test(inputForm[name])) {
        inputForm[name] = inputForm[name].replace(reg, "");
    }
};

// 发送手机验证码
const sendValidateCodeHandle = async function () {
    if (!inputForm.mobile) {
        ElMessage.error("请输入手机号!");
        return;
    } else if (!chinaPhoneNumberValidate(inputForm.mobile)) {
        ElMessage.error("请输入正确格式的手机号!");
        return;
    } else if (countDownSecond.value > 0) {
        ElMessage.error("验证码已发送，请耐心等待!");
        return;
    }
    countDownSecond.value = 60;
    if (countDownTimerId) clearInterval(countDownTimerId);
    await systemAPI.sendValidateCode({ mobile: inputForm.mobile });
    ElMessage.success("验证码已发送，请耐心等待!");
    countDownTimerId = window.setInterval(() => {
        if (countDownSecond.value <= 0) {
            clearInterval(countDownTimerId!);
            return;
        }
        --countDownSecond.value;
    }, 1000);
};

// 跳转主页
const gotoPage = function () {
    if (route.query.toFullPath) {
        router.replace(decodeURIComponent(route.query.toFullPath as string));
    } else {
        router.replace({ name: "welcome" });
    }
};

// 提交操作
const submitHandle = async function () {
    if (loginType.value === 0) {
        if (!inputForm.userName) {
            ElMessage.error("请输入用户名!");
            return;
        } else if (!inputForm.password) {
            ElMessage.error("请输入密码!");
            return;
        }
    } else if (loginType.value === 1) {
        if (!inputForm.mobile) {
            ElMessage.error("请输入手机号!");
            return;
        } else if (!chinaPhoneNumberValidate(inputForm.mobile)) {
            ElMessage.error("请输入正确格式的手机号!");
            return;
        } else if (!inputForm.code) {
            ElMessage.error("请输入验证码!");
            return;
        }
    }
    const userInfo: any = await systemAPI.login(inputForm, { isShowLoading: true });
    store.login(userInfo);
    gotoPage();
    // .then(data => {
    //     site.globalService.setLoginUserInfo(data);
    //     go();
    // });
};

watch(loginType, value => {
    if (value === 2 && !qrcodeImgUrl.value) {
        initQrcode();
    }
});

onUnmounted(() => {
    if (qrcodeTimerId) {
        clearTimeout(qrcodeTimerId);
    }
    if (countDownTimerId) {
        clearTimeout(countDownTimerId);
    }
});
</script>
<style lang="scss" scoped>
.login {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .header {
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        height: 60px;
        padding: 15px 25%;
        line-height: 30px;
        background-color: #000000;
        opacity: 0.3;
        display: flex;

        .logo-img {
            height: 30px;
            width: 30px;
            display: inline-block;
        }

        .title-text {
            display: inline-block;
            font-size: 20px;
            color: #ffffff;
            padding-left: 10px;
        }
    }

    .form-panel {
        flex: 1;
        background-image: url("@imgs/login/login-bg.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position-x: center;
        // display: flex;
        padding-top: 140px;
        // justify-content: center;

        .form-box {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0px -1px 6px 0px rgba(0, 0, 0, 0.15);
            padding: 20px 30px;
            width: 320px;
            margin: 0px auto;
            text-align: center;

            .tabs {
                display: flex;
                padding-bottom: 10px;

                .tab-text {
                    font-size: 14px;
                    line-height: 20px;
                    color: #aaaaaa;
                    cursor: pointer;

                    &.active {
                        color: #333333;
                    }
                }

                .divider-bar {
                    margin: 3px 10px;
                    width: 1px;
                    height: 14px;
                    background-color: #aaaaaa;
                }

                .tab-qrcode {
                    flex: 1;
                    text-align: right;

                    .qrcode-tips,
                    .password-tips {
                        width: 64px;
                        height: 20px;
                        margin-right: 3px;
                    }

                    .qrcode-icon,
                    .computer-icon {
                        cursor: pointer;
                        height: 30px;
                        width: 30px;
                    }
                }
            }

            .input-row {
                padding: 20px 0px 10px;
                line-height: 20px;
                display: flex;
                border-bottom: 1px solid #dddddd;

                &.active {
                    border-bottom: 1px solid #209fff;
                }

                .label-text {
                    width: 60px;
                    font-size: 12px;
                }

                .input-box {
                    flex: 1;

                    input {
                        width: 100%;
                        border: 0px;
                        height: 20px;
                        line-height: 20px;
                        font-size: 16px;
                        letter-spacing: 1px;
                        padding: 0px 10px;

                        &::placeholder {
                            font-size: 12px;
                        }

                        &:focus {
                            outline: none;
                        }

                        &:-webkit-autofill {
                            -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
                            -webkit-text-fill-color: #333;
                        }
                    }
                }

                .icon-box {
                    width: 18px;
                    cursor: pointer;
                }

                .code-text {
                    color: #209fff;
                    font-size: 12px;
                    cursor: pointer;
                    min-width: 80px;
                }
            }

            .qrcode-box {
                padding: 5px;
                border: 1px solid #f2f2f2;
                position: relative;
                display: inline-block;

                .qrcode-img {
                    height: 120px;
                    width: 120px;
                }

                .mask {
                    position: absolute;
                    left: 0px;
                    right: 0px;
                    top: 0px;
                    bottom: 0px;
                    background-color: #ffffff;
                    opacity: 0.95;
                    padding: 20px 0px;

                    .timeout-tips-text {
                        color: #000000;
                        text-align: center;
                        padding: 20px 0px;
                    }

                    .btn-refresh {
                        border-radius: 2px;
                        height: 30px;
                        line-height: 30px;
                        width: 82px;
                        background-color: #209fff;
                        text-align: center;
                        color: #ffffff;
                        font-size: 12px;
                        margin: 0px auto;
                        cursor: pointer;
                    }
                }
            }

            .tips-text {
                text-align: center;
                color: #666666;
                font-size: 12px;
                padding: 10px 0px;
                line-height: 20px;
            }

            .wechat-icon-box {
                text-align: center;

                img {
                    height: 22px;
                    width: 22px;
                }
            }

            .btn-panel {
                padding: 33px 0px 20px;
                .btn {
                    width: 100%;
                    height: 40px;
                    background-color: #209fff;
                    border-radius: 2px;
                    text-align: center;
                    font-size: 14px;
                    line-height: 40px;
                    color: #ffffff;
                    cursor: pointer;
                }
            }
        }
    }

    .footer {
        height: 40px;
        background-color: #ffffff;
        font-size: 13px;
        line-height: 40px;
        text-align: center;
        color: #666666;
    }
}
</style>
