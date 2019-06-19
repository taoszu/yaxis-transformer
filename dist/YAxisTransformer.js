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
var YAxisTransformer = /** @class */ (function () {
    function YAxisTransformer(values) {
        var _this = this;
        this.defaultBaseGenStrategy = function (originInterval) {
            var base = AxisHelper.genPowNum(originInterval);
            return [10 * base, 5 * base, 2 * base, base];
        };
        this.defaultFormatRuler = function (data, decimal) {
            return data.toFixed(decimal);
        };
        this.defaultUnitSet = [{ range: 10000, unit: "万" }, { range: 100000000, unit: "亿" }];
        this._maxData = -Number.MAX_VALUE;
        this._minData = Number.MAX_VALUE;
        /**
         *  基准值生成策略
         */
        this.baseGenStrategy = this.defaultBaseGenStrategy;
        /**
         * 格式化数据的规则
         */
        this.formatRuler = this.defaultFormatRuler;
        /**
         *  生成间距数目
         */
        this._count = 4;
        /**
         * 最小值小于interval 是否格式化为0
         */
        this.minToZero = true;
        /**
         * 最小值为0 是否保留单位
         */
        this.keepZeroUnit = false;
        /**
         * 最小值为0 是否保留小数位数
         */
        this.keepZeroDecimal = false;
        /**
         * 保持单位一致
         */
        this.keepUnitSame = true;
        /**
         * 当keepUnitSame为true时
         * unit是否跟随最大值算出的结果
         */
        this.unitFollowMax = true;
        this.unitSet = this.defaultUnitSet;
        /**
         * 是否使用百分比
         */
        this.usePercentUnit = false;
        if (values) {
            values.forEach(function (value) {
                if (value > _this._maxData) {
                    _this._maxData = value;
                }
                if (value < _this._minData) {
                    _this._minData = value;
                }
            });
        }
    }
    Object.defineProperty(YAxisTransformer.prototype, "maxData", {
        get: function () {
            return this._maxData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YAxisTransformer.prototype, "minData", {
        get: function () {
            return this._minData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YAxisTransformer.prototype, "count", {
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    YAxisTransformer.prototype.withCount = function (_count) {
        this._count = _count;
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
        this._minData = minData;
        this._maxData = maxData;
        return this;
    };
    YAxisTransformer.prototype.withBaseGenStrategy = function (baseGenStrategy) {
        this.baseGenStrategy = baseGenStrategy;
        return this;
    };
    YAxisTransformer.prototype.withFormatRuler = function (formatRuler) {
        this.formatRuler = formatRuler;
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
    YAxisTransformer.prototype.withKeepZeroDecimal = function (keepZeroDecimal) {
        this.keepZeroDecimal = keepZeroDecimal;
        return this;
    };
    YAxisTransformer.prototype.transform = function () {
        this.sortUnitSet();
        var _a = this, _count = _a._count, keepUnitSame = _a.keepUnitSame, usePercentUnit = _a.usePercentUnit, unitFollowMax = _a.unitFollowMax, forceDecimal = _a.forceDecimal, keepZeroUnit = _a.keepZeroUnit, baseGenStrategy = _a.baseGenStrategy, formatRuler = _a.formatRuler, withKeepZeroDecimal = _a.withKeepZeroDecimal;
        var unit;
        var decimal = forceDecimal;
        var adviceDecimal;
        var interval;
        // 处理最小值 
        // 找出规整间距
        this._minData = this.handleMin(this._maxData, this._minData);
        interval = (this._maxData - this._minData) / _count;
        interval = AxisHelper.findInterval(interval, baseGenStrategy);
        this._maxData = AxisHelper.genMaxData(this._minData, interval, _count);
        // 找出单位
        unit = AxisHelper.minUnit;
        if (usePercentUnit) {
            unit = AxisHelper.percentUnit;
        }
        else if (keepUnitSame) {
            unit = unitFollowMax ? this.findUnit(this._maxData) : this.findUnit(this._minData);
        }
        // 处理小数位数
        if (keepUnitSame && !unitFollowMax) {
            adviceDecimal = AxisHelper.getDecimal(interval, this._minData, unit);
        }
        else {
            adviceDecimal = AxisHelper.getDecimal(interval, this._maxData, unit);
        }
        if (!decimal) {
            decimal = adviceDecimal;
        }
        var data = [];
        var dataUnit = [];
        for (var i = 0; i < _count + 1; i++) {
            var result = this._minData + interval * i;
            // 找单位
            if (!keepUnitSame && !usePercentUnit) {
                unit = this.findUnit(result);
            }
            var formatResult = void 0;
            if (result == 0 && !this.keepZeroDecimal) {
                formatResult = "0";
            }
            else {
                formatResult = formatRuler(result / unit.range, decimal);
            }
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
        var _a = this, _count = _a._count, minToZero = _a.minToZero, baseGenStrategy = _a.baseGenStrategy;
        var interval = (maxData - minData) / _count;
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
exports.default = YAxisTransformer;
