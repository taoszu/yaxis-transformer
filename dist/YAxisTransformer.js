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
        /**
        * 奇数基准值生成策略
        */
        this.oddBaseGenStrategy = function (basePowNum) {
            var array = [];
            [10, 5, 2.5].forEach(function (item) { return array.push(item * basePowNum); });
            return array;
        };
        /**
          * 偶数数基准值生成策略
          */
        this.evenBaseGenStrategy = function (basePowNum) {
            var array = [];
            [10, 8, 6, 4].forEach(function (item) { return array.push(item * basePowNum); });
            return array;
        };
        /**
         * 所有基准值生成策略
         */
        this.allBaseGenStrategy = function (basePowNum) {
            var array = [];
            [10, 8, 6, 5, 4, 2.5, 2].forEach(function (item) { return array.push(item * basePowNum); });
            return array;
        };
        /**
         * 最小值基准值生成策略
         */
        this.minBaseGenStrategry = function (interval, minData) {
            var base = AxisHelper.genPowNum(interval);
            if (minData < 0) {
                base = -base;
            }
            ;
            var array = [];
            [8, 6, 5, 4, 2.5, 2, 0].forEach(function (item) { return array.push(item * base); });
            if (minData < 0) {
                return array.reverse();
            }
            else {
                return array;
            }
        };
        this.defaultFormatRuler = function (data, decimal) {
            return data.toFixed(decimal);
        };
        this.defaultUnitSet = [{ range: 10000, unit: "万" }, { range: 100000000, unit: "亿" }];
        this._maxData = -Number.MAX_VALUE;
        this._minData = Number.MAX_VALUE;
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
         * 保留的最大小数位数
         */
        this.maxDecimal = 4;
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
    YAxisTransformer.prototype.withFormatRuler = function (formatRuler) {
        this.formatRuler = formatRuler;
        return this;
    };
    YAxisTransformer.prototype.withForceDecimal = function (decimal) {
        this.forceDecimal = decimal;
        return this;
    };
    YAxisTransformer.prototype.withMaxDecimal = function (decimal) {
        this.maxDecimal = decimal;
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
        var _a = this, _count = _a._count, keepUnitSame = _a.keepUnitSame, usePercentUnit = _a.usePercentUnit, maxDecimal = _a.maxDecimal, unitFollowMax = _a.unitFollowMax, forceDecimal = _a.forceDecimal, keepZeroUnit = _a.keepZeroUnit, formatRuler = _a.formatRuler, withKeepZeroDecimal = _a.withKeepZeroDecimal;
        if (_count <= 0) {
            throw "count should >= 0";
        }
        if (forceDecimal && forceDecimal < 0) {
            throw "forceDecimal: " + forceDecimal + " < 0";
        }
        if (maxDecimal < 0) {
            throw "maxDecimal: " + maxDecimal + " < 0";
        }
        if (this._maxData == -Number.MAX_VALUE) {
            throw "maxData is invalid";
        }
        if (this._minData == Number.MAX_VALUE) {
            throw "minData is invalid";
        }
        if (this._minData > this._maxData) {
            throw "minData: " + this._minData + " >  maxData: " + this._maxData;
        }
        // 最大最小值相等时的处理
        if (this._minData == this._maxData) {
            if (this._maxData == 0) {
                this._maxData = this.usePercentUnit ? 1 : 100;
                this._minData = 0;
            }
            else {
                this._maxData = this._minData + Math.abs(this._minData) * this._count;
            }
        }
        var unit;
        var decimal = forceDecimal;
        var adviceDecimal;
        var interval;
        var handelMinArray = this.preHandleMin(this._minData, this._maxData);
        var result = this.findInterval(handelMinArray, this._maxData);
        // 处理最小值 
        // 找出规整间距
        this._minData = result.min;
        interval = result.interval;
        this._maxData = AxisHelper.genMaxData(this._minData, interval, _count);
        // 找出单位
        unit = AxisHelper.minUnit;
        if (usePercentUnit) {
            unit = AxisHelper.percentUnit;
        }
        else if (keepUnitSame) {
            unit = unitFollowMax ? this.findUnit(this._maxData) : this.findUnit(this._minData);
        }
        // 找出参考值
        var reference = unitFollowMax ? this._maxData : this._minData;
        var min = this._minData < interval ? this._minData : interval;
        // 处理小数位数
        adviceDecimal = AxisHelper.getDecimal(min, reference, interval, unit);
        // 如果没有强制小数位数，使用建议小数位数
        if (!decimal) {
            adviceDecimal = Math.min(adviceDecimal, this.maxDecimal);
            decimal = adviceDecimal;
        }
        var data = [];
        var dataUnit = [];
        for (var i = 0; i < _count + 1; i++) {
            var result_1 = this._minData + interval * i;
            data.push(result_1);
            // 找单位
            if (!keepUnitSame && !usePercentUnit) {
                unit = this.findUnit(result_1);
            }
            var formatResult = void 0;
            if (result_1 == 0 && !this.keepZeroDecimal) {
                formatResult = "0";
            }
            else {
                formatResult = formatRuler(result_1 / unit.range, decimal);
            }
            // 如果格式化之前不是0 格式化之后为0 也需要做处理
            if (!this.keepZeroDecimal && Number(formatResult) == 0) {
                result_1 = 0;
                formatResult = "0";
            }
            if (result_1 != 0 || keepZeroUnit) {
                formatResult = formatResult + unit.unit;
            }
            dataUnit.push(formatResult);
        }
        return {
            data: data,
            dataUnit: dataUnit,
            adviseDecimal: adviceDecimal,
            min: data[0],
            max: data[data.length - 1],
            unit: unit
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
    /**
     * 找出间距
     * @param handleMinArray
     * @param _maxData
     */
    YAxisTransformer.prototype.findInterval = function (handleMinArray, _maxData) {
        var _count = this._count;
        var findIntervals = [];
        handleMinArray.forEach(function (item) {
            var minData = item.min;
            var originInterval = (_maxData - minData) / _count;
            var intervals = item.intervals;
            var findIndex = intervals.findIndex(function (interval) { return originInterval > interval; });
            if (findIndex < 0) {
                findIndex = intervals.length;
            }
            var finalInterval = intervals[Math.max(0, findIndex - 1)];
            findIntervals.push({ min: minData, interval: finalInterval });
        });
        findIntervals.sort(function (o1, o2) {
            var diff = o1.interval - o2.interval;
            return diff == 0 ? Math.abs(o1.min) - Math.abs(o2.min) : diff;
        });
        return findIntervals[0];
    };
    /**
     *  预处理最小值
     * @param minData
     * @param maxData
     */
    YAxisTransformer.prototype.preHandleMin = function (minData, maxData) {
        var _a = this, _count = _a._count, minBaseGenStrategry = _a.minBaseGenStrategry;
        var interval = (maxData - minData) / _count;
        var minArray = [];
        if (minData >= 0 && minData < interval) {
            var newMin = 0;
            var basePowNum = AxisHelper.genPowNum(maxData / _count);
            minArray.push({
                min: newMin,
                intervals: this.allBaseGenStrategy(basePowNum)
            });
        }
        else {
            var basePowNum = AxisHelper.genPowNum(interval);
            var baseArray = minBaseGenStrategry(interval, minData);
            var maxHandleCount = 4;
            var handlePart = minData % (basePowNum * 10);
            var remainPart = minData - handlePart;
            for (var i = 0; i < baseArray.length; i++) {
                var item = baseArray[i];
                if (item <= handlePart) {
                    var newMin = remainPart + item;
                    var intervals = [];
                    basePowNum = AxisHelper.genPowNum((maxData - newMin) / this._count);
                    if (item == 0) {
                        intervals = this.allBaseGenStrategy(basePowNum);
                    }
                    else if (item % (2.5 * basePowNum) == 0) {
                        intervals = this.oddBaseGenStrategy(basePowNum);
                    }
                    else {
                        intervals = this.evenBaseGenStrategy(basePowNum);
                    }
                    minArray.push({
                        min: newMin,
                        intervals: intervals
                    });
                }
                if (minArray.length == maxHandleCount) {
                    break;
                }
            }
        }
        return minArray;
    };
    return YAxisTransformer;
}());
exports.YAxisTransformer = YAxisTransformer;
exports.default = YAxisTransformer;
