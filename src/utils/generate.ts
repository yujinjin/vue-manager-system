/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-12 09:53:50
 * @项目的路径: \vue-manager-system\src\utils\generate.ts
 * @描述: 动态生成数据
 */

/**
 * 生成32的字符串，每一位都是随机的16进制数，重复的概率是1/(16^32)
 */
export function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
        .toUpperCase();
}

/*
 * 生成id随机数(年月日+8位随机数)
 */
export function randomId() {
    const currentDate = new Date();
    let randomId = "xxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
    randomId =
        currentDate.getFullYear() +
        "" +
        (currentDate.getMonth() > 8 ? currentDate.getMonth() + 1 : "0" + (1 + currentDate.getMonth())) +
        "" +
        (currentDate.getDate() > 9 ? currentDate.getDate() : "0" + currentDate.getDate()) +
        randomId;
    return randomId;
}
