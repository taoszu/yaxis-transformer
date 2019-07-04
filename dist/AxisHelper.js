"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minUnit = { range: 1, unit: "" };
exports.percentUnit = { range: 0.01, unit: "%" };
function genMaxData(minData, interval, count) {
    return minData + interval * count;
}
exports.genMaxData = genMaxData;
function findInterval(range, strategyFunc) {
    var originInterval = range;
    var factorList = strategyFunc(originInterval);
    for (var i = 1; i < factorList.length; i++) {
        if (originInterval > factorList[i]) {
            return factorList[i - 1];
        }
    }
    return originInterval;
}
exports.findInterval = findInterval;
/**
 * 查找最小值需格式化部分的值
 * @param remainPart
 * @param interval
 */
function findMinInterval(remainPart, strategyFunc) {
    var factorList = strategyFunc(remainPart);
    for (var i = 1; i < factorList.length; i++) {
        if (remainPart >= factorList[i]) {
            return factorList[i];
        }
    }
    return 0;
}
exports.findMinInterval = findMinInterval;
/**
 * 生成十的幂次方
 * @param data
 */
function genPowNum(data) {
    var bit = getPowBit(data);
    var base = Math.pow(10, bit);
    if (data < 0) {
        base = -base;
    }
    return base;
}
exports.genPowNum = genPowNum;
/**
 *  获取数字的十的幂次方的位数
 *  如 90 则为 1
 *  如 0.01则为 -2
 * @param data
 */
function getPowBit(data) {
    return (data == 0) ? 0 : Math.floor(Math.log10(Math.abs(data)));
}
exports.getPowBit = getPowBit;
/**
 * 获取小数的小数位数位数
 * @param data
 */
function getDecimalNum(data) {
    var decimal = 0;
    var num = data;
    while (isContainDecimal(num)) {
        num = num * 10;
        decimal++;
    }
    return decimal;
}
exports.getDecimalNum = getDecimalNum;
/**
 * 是否包含小数
 * @param data
 */
function isContainDecimal(data) {
    return Math.floor(data) !== data;
}
exports.isContainDecimal = isContainDecimal;
function isContainInt(data) {
    return data >= 1;
}
exports.isContainInt = isContainInt;
/**
 * 大致思路就是为了获取最小的数
 * 相对于参考值的倍数
 * 例如 1000 相对于 10000是0.1 那么最小需要的小数位数就是1
 * 这样就可以确保完整显示出所有有效的小数位数
 * 对于小数位数，直接取interval的小数位数
 * @param min
 * @param reference
 * @param interval
 * @param unit
 */
function getDecimal(min, reference, interval, unit) {
    var decimal;
    var isMinContainDecimal = isContainDecimal(min);
    var isIntervalContainDecimal = isContainDecimal(interval);
    if (isMinContainDecimal || isIntervalContainDecimal) {
        var minDecimal = getDecimalNum(min);
        var intervalDecimal = getDecimalNum(interval);
        decimal = Math.max(minDecimal, intervalDecimal);
    }
    else {
        if (min > reference || isEmpty(unit.unit) || min == 0) {
            decimal = 0;
        }
        else {
            decimal = getPowBit(unit.range) - getPowBit(min);
            decimal = Math.max(0, decimal);
        }
    }
    // 如果是百分比 需要减2
    if (unit.unit == exports.percentUnit.unit) {
        decimal = Math.max(0, decimal - 2);
    }
    return decimal;
}
exports.getDecimal = getDecimal;
function isEmpty(text) {
    return text == null || text.length == 0;
}
exports.isEmpty = isEmpty;
