(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mathjs')) :
	typeof define === 'function' && define.amd ? define(['exports', 'mathjs'], factory) :
	(global = global || self, factory(global.yaxisTransformer = {}, global.mathjs));
}(this, function (exports, mathjs) { 'use strict';

	mathjs = mathjs && mathjs.hasOwnProperty('default') ? mathjs['default'] : mathjs;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var AxisHelper = createCommonjsModule(function (module, exports) {
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
	    var dataStr = data.toString();
	    var decimalIndex = dataStr.indexOf(".");
	    return decimalIndex < 0 ? 0 : dataStr.length - decimalIndex - 1;
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
	});

	unwrapExports(AxisHelper);
	var AxisHelper_1 = AxisHelper.minUnit;
	var AxisHelper_2 = AxisHelper.percentUnit;
	var AxisHelper_3 = AxisHelper.genMaxData;
	var AxisHelper_4 = AxisHelper.findInterval;
	var AxisHelper_5 = AxisHelper.findMinInterval;
	var AxisHelper_6 = AxisHelper.genPowNum;
	var AxisHelper_7 = AxisHelper.getPowBit;
	var AxisHelper_8 = AxisHelper.getDecimalNum;
	var AxisHelper_9 = AxisHelper.isContainDecimal;
	var AxisHelper_10 = AxisHelper.isContainInt;
	var AxisHelper_11 = AxisHelper.getDecimal;
	var AxisHelper_12 = AxisHelper.isEmpty;

	var YAxisTransformer_1 = createCommonjsModule(function (module, exports) {
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result["default"] = mod;
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var AxisHelper$1 = __importStar(AxisHelper);

	var YAxisTransformer = /** @class */ (function () {
	    function YAxisTransformer(values) {
	        var _this = this;
	        this.defaultBaseGenStrategy = function (originInterval) {
	            var base = AxisHelper$1.genPowNum(originInterval);
	            var baseArray = [10 * base, 5 * base, 2 * base, base];
	            if (originInterval < 0) {
	                baseArray = baseArray.reverse();
	            }
	            return baseArray;
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
	        this.unitSet = [AxisHelper$1.percentUnit];
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
	        var _a = this, _count = _a._count, keepUnitSame = _a.keepUnitSame, usePercentUnit = _a.usePercentUnit, maxDecimal = _a.maxDecimal, unitFollowMax = _a.unitFollowMax, forceDecimal = _a.forceDecimal, keepZeroUnit = _a.keepZeroUnit, baseGenStrategy = _a.baseGenStrategy, formatRuler = _a.formatRuler, withKeepZeroDecimal = _a.withKeepZeroDecimal;
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
	        var unit;
	        var decimal = forceDecimal;
	        var adviceDecimal;
	        var interval;
	        // 处理最小值 
	        // 找出规整间距
	        this._minData = this.handleMin(this._maxData, this._minData);
	        interval = (this._maxData - this._minData) / _count;
	        interval = AxisHelper$1.findInterval(interval, baseGenStrategy);
	        this._maxData = AxisHelper$1.genMaxData(this._minData, interval, _count);
	        // 找出单位
	        unit = AxisHelper$1.minUnit;
	        if (usePercentUnit) {
	            unit = AxisHelper$1.percentUnit;
	        }
	        else if (keepUnitSame) {
	            unit = unitFollowMax ? this.findUnit(this._maxData) : this.findUnit(this._minData);
	        }
	        // 找出参考值
	        var reference = unitFollowMax ? this._maxData : this._minData;
	        var min = this._minData < interval ? this._minData : interval;
	        // 处理小数位数
	        adviceDecimal = AxisHelper$1.getDecimal(min, reference, interval, unit);
	        // 如果没有强制小数位数，使用建议小数位数
	        if (!decimal) {
	            adviceDecimal = Math.min(adviceDecimal, this.maxDecimal);
	            decimal = adviceDecimal;
	        }
	        var data = [];
	        var dataUnit = [];
	        for (var i = 0; i < _count + 1; i++) {
	            var result = this._minData + interval * i;
	            data.push(result);
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
	            // 如果格式化之前不是0 格式化之后为0 也需要做处理
	            if (!this.keepZeroDecimal && Number(formatResult) == 0) {
	                result = 0;
	                formatResult = "0";
	            }
	            if (result != 0 || keepZeroUnit) {
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
	        var unit = AxisHelper$1.minUnit;
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
	        var baseInterval = AxisHelper$1.findInterval(interval, this.baseGenStrategy);
	        if (minData > 0 && baseInterval > minData) {
	            return minToZero ? 0 : AxisHelper$1.findMinInterval(minData, baseGenStrategy);
	        }
	        else if (minData < 0 && baseInterval > Math.abs(minData)) {
	            return AxisHelper$1.findMinInterval(minData, baseGenStrategy);
	        }
	        else {
	            var intervalPowNum = AxisHelper$1.genPowNum(baseInterval);
	            var baseNum = intervalPowNum * 10;
	            var keepPart = void 0;
	            if (minData >= 0) {
	                keepPart = Math.floor(minData / baseNum) * baseNum;
	            }
	            else {
	                keepPart = -Math.floor(Math.abs(minData) / baseNum) * baseNum;
	            }
	            var remainPart = minData - keepPart;
	            var remainPowNum = AxisHelper$1.genPowNum(remainPart);
	            var result = keepPart;
	            //如果间距和需要处理的是同一个数量级 则需要再做查找interval的操作
	            //否则直接舍弃处理的part
	            if (Math.abs(intervalPowNum) == Math.abs(remainPowNum)) {
	                var interval_1 = AxisHelper$1.findMinInterval(remainPart, baseGenStrategy);
	                // 计算保留的最大小数位数
	                var maxDecimal = Math.max(AxisHelper$1.getDecimalNum(interval_1), AxisHelper$1.getDecimalNum(keepPart));
	                result = Number(mathjs.bignumber(keepPart).add(mathjs.bignumber(interval_1)).toFixed(maxDecimal));
	            }
	            return result;
	        }
	    };
	    return YAxisTransformer;
	}());
	exports.YAxisTransformer = YAxisTransformer;
	exports.default = YAxisTransformer;
	});

	unwrapExports(YAxisTransformer_1);
	var YAxisTransformer_2 = YAxisTransformer_1.YAxisTransformer;

	var dist = createCommonjsModule(function (module, exports) {
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result["default"] = mod;
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var YAxisTransformer_1$1 = __importDefault(YAxisTransformer_1);
	var AxisHelper$1 = __importStar(AxisHelper);
	exports.default = {
	    YAxisTransformer: YAxisTransformer_1$1.default,
	    AxisHelper: AxisHelper$1
	};
	function transform(min, max, isPercent) {
	    var yAxisTransformer = new YAxisTransformer_1$1.default().withMinMaxData(min, max);
	    if (isPercent) {
	        yAxisTransformer.withPercentUnit();
	    }
	    return yAxisTransformer.transform();
	}
	exports.transform = transform;
	});

	var index = unwrapExports(dist);
	var dist_1 = dist.transform;

	exports.default = index;
	exports.transform = dist_1;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
