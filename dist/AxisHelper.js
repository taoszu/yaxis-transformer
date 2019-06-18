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
function defaultBaseGenStrategy(originInterval) {
    var base = genPowNum(originInterval);
    return [10 * base, 5 * base, 2 * base, base];
}
exports.defaultBaseGenStrategy = defaultBaseGenStrategy;
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
    return Math.floor(Math.log10(Math.abs(data)));
}
exports.getPowBit = getPowBit;
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
function getDecimal(interval, max, unit) {
    if (isContainDecimal(interval)) {
        var decimal = Math.abs(getPowBit(interval));
        if (unit.unit == exports.percentUnit.unit) {
            decimal = Math.max(0, decimal - 2);
        }
        return decimal;
    }
    else if (isEmpty(unit.unit)) {
        return 0;
    }
    else {
        var decimal = getPowBit(max) - getPowBit(interval);
        return Math.abs(decimal);
    }
}
exports.getDecimal = getDecimal;
function isEmpty(text) {
    return text == null || text.length == 0;
}
exports.isEmpty = isEmpty;
