"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minUnit = { range: 1, unit: "" };
exports.percentUnit = { range: 0.01, unit: "%" };
function genMaxData(minData, interval, count) {
    return minData + interval * count;
}
exports.genMaxData = genMaxData;
function findInterval(interval, strategyFunc) {
    var originInterval = interval;
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
    return (data == 0) ? 0 : Math.floor(log10(Math.abs(data)));
}
exports.getPowBit = getPowBit;
function log10(data) {
    return Math.log(data) / Math.log(10);
}
exports.log10 = log10;
/**
 * 获取小数的小数位数位数
 * @param data
 */
function getDecimalNum(data) {
    var dataStr = Math.abs(data).toString();
    var decimalIndex = dataStr.indexOf(".");
    return decimalIndex < 0 ? 0 : dataStr.length - decimalIndex - 1;
}
exports.getDecimalNum = getDecimalNum;
/**
 * 绝对值小于1的小数转为绝对值大于1的数 最小需要的小数位数
 */
function getMinDecimalToInt(data) {
    data = Math.abs(data);
    var decimal = 0;
    while (data < 1) {
        decimal++;
        data *= 10;
    }
    return decimal;
}
exports.getMinDecimalToInt = getMinDecimalToInt;
/**
 * 小于1的小数扩大转为大于1的数
 * @param data
 */
function decimalToInt(data) {
    var decimal = 0;
    while (data < 1) {
        decimal++;
        data *= 10;
    }
    return data;
}
exports.decimalToInt = decimalToInt;
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
function getValidDecimalNum(value) {
    var data = value.toString();
    var decimalIndex = data.indexOf(".");
    if (decimalIndex < 0) {
        return 0;
    }
    else {
        if (data.lastIndexOf("0") == data.length - 1) {
            var decimalStr = data.substring(decimalIndex).replace("0", "");
            return decimalStr.length;
        }
        else {
            return data.length - decimalIndex - 1;
        }
    }
}
exports.getValidDecimalNum = getValidDecimalNum;
/**
 * 保存data的小数位数和decimal一致
 * @param data
 * @param decimal
 */
function keepDecimalNumber(data, decimal) {
    return Number(data.toFixed(decimal));
}
exports.keepDecimalNumber = keepDecimalNumber;
function keepValidDecimal(data) {
    var value = Number(data);
    return Number(value.toFixed(getValidDecimalNum(value)));
}
exports.keepValidDecimal = keepValidDecimal;
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
function getDecimal(hasDecimal, min, reference, interval, unit) {
    var decimal;
    if (hasDecimal) {
        var minDecimal = getDecimalNum(min);
        var intervalDecimal = getDecimalNum(interval);
        decimal = Math.max(minDecimal, intervalDecimal);
    }
    else {
        var realMin = min < interval ? min : interval;
        if (realMin > reference || isEmpty(unit.unit)) {
            decimal = 0;
        }
        else {
            if (realMin == 0) {
                decimal = getDecimalNum(interval / unit.range);
            }
            else {
                decimal = Math.max(getDecimalNum(min / unit.range), getDecimalNum(interval / unit.range));
            }
        }
    }
    decimal = Math.max(0, decimal);
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
