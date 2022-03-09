/**
 * 作者：yujinjin9@126.com
 * 时间：2021-12-30
 * 描述：站点常用验证工具类方法
 */

// 中国手机号码验证
export function chinaPhoneNumberValidate(phoneNumber: string): boolean {
    return !!phoneNumber && /^1[0-9]{10}$/.test(phoneNumber.replace(/\s/g, ""));
}

// 验证邮箱
export function emailValidate(email: string): boolean {
    return !!email && /^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.trim());
}

// 中国身份证验证（支持香港、澳门、台湾）
export function chinaIDCardValidate(IDCard: string): boolean {
    if (!IDCard || !IDCard.trim()) {
        return false;
    }
    IDCard = IDCard.trim();
    if (/^[a-zA-Z][0-9]{6}((（|\()[0-9aA](\)|）)|[0-9aA])$/.test(IDCard)) {
        // 香港
        return true;
    } else if (/^[a-zA-Z][0-9]{9}$/.test(IDCard)) {
        // 台湾
        const genderSex: string = IDCard.substring(1, 2);
        if (genderSex === "1" || genderSex === "2") {
            return true;
        }
        return false;
    } else if (/^[157]\d{6}((（|\()[0-9](\)|）))$/.test(IDCard)) {
        // 澳门
        return true;
    } else if (/^[1-9][0-9]{5}(18|19|20)?[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/.test(IDCard)) {
        // 大陆身份证(18位，不支持15位)
        // 18位身份证需要验证最后一位校验位
        const IDCardArray: string[] = IDCard.split("");
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验位
        const parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0,
            ai = 0,
            wi = 0;
        for (let i = 0; i < 17; i++) {
            ai = parseInt(IDCardArray[i], 10);
            wi = factor[i];
            sum += ai * wi;
        }
        const last = String(parity[sum % 11]);
        if (last != IDCardArray[17].toLocaleUpperCase()) {
            return false;
        }
        return true;
    }
    return false;
}

/**
 * 验证银行卡
 *
 * 验证规则是：全数字，长度必须在5到24之间
 */
export function validateBankCard(bankCard: string): boolean {
    if (!bankCard) return false;
    return /^[0-9]{5,25}$/.test(bankCard.trim());
}

/**
 * 验证姓名
 *
 * 验证规则是：全中文，或者中文之间有（·），或者全英文
 * 用例：1:测试，2:艾格里·买买提，3:jack yu
 * 错误用例：1.测 试，2.测试J，4.J
 */
export function validateName(name: string): boolean {
    if (!name) return false;
    return /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\\·]{0,18}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,18}[a-zA-Z]{1}$)/.test(name.trim());
}
