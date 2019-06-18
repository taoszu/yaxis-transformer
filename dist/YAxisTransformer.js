"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AxisHelper = __importStar(require("./AxisHelper"));
/**
 *
 * demo
 */
function demo() {
    var value = [152, 514];
    var transformer = new YAxisTransformer(value);
    var result = transformer
        .withCount(4)
        .withPercentUnit()
        .transform();
    alert(JSON.stringify(result));
}
exports.demo = demo;
var YAxisTransformer = /** @class */ (function () {
    function YAxisTransformer(values) {
        var _this = this;
        this.maxData = -Number.MAX_VALUE;
        this.minData = Number.MAX_VALUE;
        /**
         *  基准值生成策略
         */
        this.baseGenStrategy = AxisHelper.defaultBaseGenStrategy;
        /**
         *  生成间距数目
         */
        this.count = 4;
        /**
         * 最小值小于interval 是否格式化为0
         */
        this.minToZero = true;
        /**
         * 最小值为0 是否保留单位
         */
        this.keepZeroUnit = false;
        /**
         * 保持单位一致
         */
        this.keepUnitSame = true;
        /**
         * 当keepUnitSame为true时
         * unit跟随最大值当的结果
         */
        this.unitFollowMax = true;
        this.unitSet = [{ range: 10000, unit: "万" }, { range: 100000000, unit: "亿" }];
        this.usePercentUnit = false;
        if (values) {
            values.forEach(function (value) {
                if (value > _this.maxData) {
                    _this.maxData = value;
                }
                if (value < _this.minData) {
                    _this.minData = value;
                }
            });
        }
    }
    YAxisTransformer.prototype.withCount = function (count) {
        this.count = count;
        return this;
    };
    YAxisTransformer.prototype.withUnitSet = function (unitSet) {
        this.unitSet = unitSet;
        return this;
    };
    YAxisTransformer.prototype.withPercentUnit = function () {
        this.unitSet = [AxisHelper.percentUnit];
        this.usePercentUnit = true;
        this.keepUnitSame = true;
        return this;
    };
    YAxisTransformer.prototype.withMinMaxData = function (minData, maxData) {
        this.minData = minData;
        this.maxData = maxData;
        return this;
    };
    YAxisTransformer.prototype.withBaseGenStrategy = function (baseGenStrategy) {
        this.baseGenStrategy = baseGenStrategy;
        return this;
    };
    YAxisTransformer.prototype.withForceDecimal = function (decimal) {
        this.forceDecimal = decimal;
        return this;
    };
    YAxisTransformer.prototype.withKeepZeroUnit = function (keepZeroUnit) {
        this.keepZeroUnit = keepZeroUnit;
        return this;
    };
    YAxisTransformer.prototype.withKeepUnitSame = function (keepUnitSame) {
        this.keepUnitSame = keepUnitSame;
        return this;
    };
    YAxisTransformer.prototype.withUnitFollowMax = function (unitFollowMax) {
        this.unitFollowMax = unitFollowMax;
        return this;
    };
    YAxisTransformer.prototype.withMinToZero = function (minToZero) {
        this.minToZero = minToZero;
        return this;
    };
    YAxisTransformer.prototype.transform = function () {
        this.sortUnitSet();
        var _a = this, maxData = _a.maxData, minData = _a.minData, count = _a.count, keepUnitSame = _a.keepUnitSame, usePercentUnit = _a.usePercentUnit, unitFollowMax = _a.unitFollowMax, forceDecimal = _a.forceDecimal, keepZeroUnit = _a.keepZeroUnit, baseGenStrategy = _a.baseGenStrategy;
        var unit;
        var decimal = forceDecimal;
        var adviceDecimal;
        var interval;
        if (maxData == minData) {
            interval = minData;
            maxData = AxisHelper.genMaxData(minData, interval, count);
        }
        minData = this.handleMin(maxData, minData);
        interval = (maxData - minData) / count;
        interval = AxisHelper.findInterval(interval, baseGenStrategy);
        maxData = AxisHelper.genMaxData(minData, interval, count);
        // 找出单位
        unit = AxisHelper.minUnit;
        if (usePercentUnit) {
            unit = AxisHelper.percentUnit;
        }
        else if (keepUnitSame) {
            unit = unitFollowMax ? this.findUnit(maxData) : this.findUnit(minData);
        }
        // 处理小数位数
        adviceDecimal = AxisHelper.getDecimal(interval, maxData, unit);
        if (!decimal) {
            decimal = adviceDecimal;
        }
        var data = [];
        var dataUnit = [];
        for (var i = 0; i < count + 1; i++) {
            var result = minData + interval * i;
            if (!keepUnitSame && !usePercentUnit) {
                unit = this.findUnit(result);
            }
            var formatResult = (result / unit.range).toFixed(decimal);
            if (result != 0 || keepZeroUnit) {
                formatResult = formatResult + unit.unit;
            }
            data.push(result);
            dataUnit.push(formatResult);
        }
        return {
            data: data,
            dataUnit: dataUnit,
            adviseDecimal: adviceDecimal,
        };
    };
    YAxisTransformer.prototype.sortUnitSet = function () {
        var unitSet = this.unitSet;
        unitSet.sort(function (one, other) {
            return one.range - other.range;
        });
    };
    YAxisTransformer.prototype.findUnit = function (data) {
        var unitSet = this.unitSet;
        var unit = AxisHelper.minUnit;
        unitSet.forEach(function (item) {
            if (data >= item.range) {
                unit = item;
            }
        });
        return unit;
    };
    YAxisTransformer.prototype.handleMin = function (maxData, minData) {
        var _a = this, count = _a.count, minToZero = _a.minToZero, baseGenStrategy = _a.baseGenStrategy;
        var interval = (maxData - minData) / count;
        var baseInterval = AxisHelper.findInterval(interval, this.baseGenStrategy);
        if (minData > 0 && baseInterval > minData && minToZero) {
            return 0;
        }
        else {
            var intervalPowNum = AxisHelper.genPowNum(interval);
            var baseNum = intervalPowNum * 10;
            var keepPart = Math.floor(minData / baseNum) * baseNum;
            var remainPart = minData - keepPart;
            var remainPowNum = AxisHelper.genPowNum(remainPart);
            //如果间距和需要处理的是同一个数量级 则需要再做查找interval的操作
            if (intervalPowNum == remainPowNum) {
                return keepPart + AxisHelper.findMinInterval(remainPart, baseGenStrategy);
            }
            else {
                return keepPart;
            }
        }
    };
    return YAxisTransformer;
}());
exports.YAxisTransformer = YAxisTransformer;
