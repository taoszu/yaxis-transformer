import * as AxisHelper from "./AxisHelper";
import { bignumber } from "mathjs";

/**
 * 基准值生成策略
 */
export type Strategy = (interval: number) => number[];

/**
 * 格式化数据的规则
 * 应用于对四舍五入精度有要求的场景
 */
export type FormatRuler = (data: number, decimal: number) => string;

export type Unit = { range: number; unit: string };

export type TransformResult = {
  data: number[];
  dataUnit: string[];
  adviseDecimal: number;
  min: number;
  max: number;
  unit: Unit;
};

export class YAxisTransformer {
  /**
   * 奇数基准值生成策略
   */
  oddBaseGenStrategy = (basePowNum: number) => {
    const array: number[] = [];
    const decimal = AxisHelper.getValidDecimalNum(basePowNum);

    [10, 5, 2.5].forEach(item => array.push(AxisHelper.keepDecimalNumber(item * basePowNum, decimal)));
    return array;
  };

  /**
   * 偶数数基准值生成策略
   */
  evenBaseGenStrategy = (basePowNum: number) => {
    const array: number[] = [];
    const decimal = AxisHelper.getValidDecimalNum(basePowNum);

    [10, 8, 6, 4, 2].forEach(item =>
      array.push(AxisHelper.keepDecimalNumber(item * basePowNum, decimal))
    );
    return array;
  };

  /**
   * 所有基准值生成策略
   */
  allBaseGenStrategy = (basePowNum: number) => {
    const array: number[] = [];
    const decimal = AxisHelper.getValidDecimalNum(basePowNum);

    [10, 8, 6, 5, 4, 2.5, 2].forEach(item =>
      array.push(AxisHelper.keepDecimalNumber(item * basePowNum, decimal))
    );
    return array;
  };

  /**
   * 最小值基准值生成策略
   */
  minBaseGenStrategry = (interval: number, minData: number) => {
    let base = AxisHelper.genPowNum(interval);
    if (minData < 0) {
      base = -base;
    }

    const decimal = AxisHelper.getValidDecimalNum(interval);
    const array: number[] = [];
    [10, 8, 6, 5, 4, 2.5, 2, 0].forEach(item =>
      array.push(AxisHelper.keepDecimalNumber(item * base, decimal))
    );
    if (minData < 0) {
      return array.reverse();
    } else {
      return array;
    }
  };

  defaultFormatRuler = (data: number, decimal: number) => {
    return data.toFixed(decimal);
  };
  defaultUnitSet = [
    { range: 10000, unit: "万" },
    { range: 100000000, unit: "亿" }
  ];

  private _maxData: number = -Number.MAX_VALUE;
  private _minData: number = Number.MAX_VALUE;

  get maxData() {
    return this._maxData;
  }

  get minData() {
    return this._minData;
  }

  /**
   * 格式化数据的规则
   */
  private formatRuler: FormatRuler = this.defaultFormatRuler;

  /**
   *  生成间距数目
   */
  private _count = 4;

  get count() {
    return this._count;
  }

  /**
   * 最小值小于interval 是否格式化为0
   */
  private minToZero = true;

  /**
   * 最小值为0 是否保留单位
   */
  private keepZeroUnit = false;

  /**
   * 最小值为0 是否保留小数位数
   */
  private keepZeroDecimal = false;

  /**
   * 保持单位一致
   */
  private keepUnitSame = true;

  /**
   * 当keepUnitSame为true时
   * unit是否跟随最大值算出的结果
   */
  private unitFollowMax = true;

  private unitSet = this.defaultUnitSet;

  /**
   * 强制小数位数
   */
  private forceDecimal: number | undefined;

  /**
   * 保留的最大小数位数
   */
  private maxDecimal = 4;

  /**
   * 是否使用百分比
   */
  private usePercentUnit = false;

  constructor(values?: number[]) {
    if (values) {
      values.forEach(value => {
        if (value > this._maxData) {
          this._maxData = value;
        }

        if (value < this._minData) {
          this._minData = value;
        }
      });
    }
  }

  withCount(_count: number) {
    this._count = _count;
    return this;
  }

  withUnitSet(unitSet: Unit[]) {
    this.unitSet = unitSet;
    return this;
  }

  withPercentUnit() {
    this.unitSet = [AxisHelper.percentUnit];
    this.usePercentUnit = true;
    this.keepUnitSame = true;
    return this;
  }

  withMinMaxData(minData: number, maxData: number) {
    this._minData = minData;
    this._maxData = maxData;
    return this;
  }

  withFormatRuler(formatRuler: FormatRuler) {
    this.formatRuler = formatRuler;
    return this;
  }

  withForceDecimal(decimal: number) {
    this.forceDecimal = decimal;
    return this;
  }

  withMaxDecimal(decimal: number) {
    this.maxDecimal = decimal;
    return this;
  }

  withKeepZeroUnit(keepZeroUnit: boolean) {
    this.keepZeroUnit = keepZeroUnit;
    return this;
  }

  withKeepUnitSame(keepUnitSame: boolean) {
    this.keepUnitSame = keepUnitSame;
    return this;
  }

  withUnitFollowMax(unitFollowMax: boolean) {
    this.unitFollowMax = unitFollowMax;
    return this;
  }

  withMinToZero(minToZero: boolean) {
    this.minToZero = minToZero;
    return this;
  }

  withKeepZeroDecimal(keepZeroDecimal: boolean) {
    this.keepZeroDecimal = keepZeroDecimal;
    return this;
  }

  transform(): TransformResult {
    this.sortUnitSet();
    let {
      _count,
      keepUnitSame,
      usePercentUnit,
      maxDecimal,
      unitFollowMax,
      forceDecimal,
      keepZeroUnit,
      formatRuler,
      withKeepZeroDecimal
    } = this;

    if (_count <= 0) {
      throw "count should >= 0";
    }
    if (forceDecimal && forceDecimal < 0) {
      throw `forceDecimal: ${forceDecimal} < 0`;
    }

    if (maxDecimal < 0) {
      throw `maxDecimal: ${maxDecimal} < 0`;
    }

    if (this._maxData == -Number.MAX_VALUE) {
      throw "maxData is invalid";
    }
    if (this._minData == Number.MAX_VALUE) {
      throw "minData is invalid";
    }
    if (this._minData > this._maxData) {
      throw `minData: ${this._minData} >  maxData: ${this._maxData}`;
    }

    // 最大最小值相等时的处理
    if (this._minData == this._maxData) {
      if (this._maxData == 0) {
        this._maxData = this.usePercentUnit ? 1 : 100;
        this._minData = 0;
      } else {
        this._maxData = this._minData + Math.abs(this._minData) * this._count;
      }
    }

    let unit;
    let decimal = forceDecimal;
    let adviceDecimal;
    let interval;

    const handelMinArray = this.preHandleMin(this._minData, this._maxData);
    const result = this.findInterval(handelMinArray, this._maxData);

    // 处理最小值
    // 找出规整间距
    if (result) {
      this._minData = result.min;
      interval = result.interval;
    } else {
      interval = this._maxData - this._minData;
    }

    this._maxData = AxisHelper.genMaxData(this._minData, interval, _count);

    // 找出单位
    unit = AxisHelper.minUnit;
    if (usePercentUnit) {
      unit = AxisHelper.percentUnit;
    } else if (keepUnitSame) {
      unit = unitFollowMax
        ? this.findUnit(this._maxData)
        : this.findUnit(this._minData);
    }

    // 找出参考值
    let reference = unitFollowMax ? this._maxData : this._minData;
    let min = this._minData;

    const hasDecimal =
      AxisHelper.isContainDecimal(min) || AxisHelper.isContainDecimal(interval);
    // 处理小数位数
    adviceDecimal = AxisHelper.getDecimal(
      hasDecimal,
      min,
      reference,
      interval,
      unit
    );
    // 如果没有强制小数位数，使用建议小数位数
    if (!decimal) {
      adviceDecimal = Math.min(adviceDecimal, this.maxDecimal);
      decimal = adviceDecimal;
    }
    let data: number[] = [];
    let dataUnit: string[] = [];
    this.formatData(data, dataUnit, unit, interval, decimal);

    return {
      data: data,
      dataUnit: dataUnit,
      adviseDecimal: adviceDecimal,
      min: data[0],
      max: data[data.length - 1],
      unit: unit
    };
  }

  private formatData(
    data: number[],
    dataUnit: string[],
    unit: Unit,
    interval: number,
    decimal: number
  ) {
    const {
      _count,
      keepUnitSame,
      usePercentUnit,
      formatRuler,
      keepZeroUnit
    } = this;

    for (let i = 0; i < _count + 1; i++) {
      let result = this._minData + interval * i;
      data.push(result);

      // 找单位
      if (!keepUnitSame && !usePercentUnit) {
        unit = this.findUnit(result);
      }

      let formatResult;
      if (result == 0 && !this.keepZeroDecimal) {
        formatResult = "0";
      } else {
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
  }

  private sortUnitSet() {
    let { unitSet } = this;
    unitSet.sort((one, other) => {
      return one.range - other.range;
    });
  }

  private findUnit(data: number) {
    let { unitSet } = this;
    let unit = AxisHelper.minUnit;
    unitSet.forEach(item => {
      if (data >= item.range) {
        unit = item;
      }
    });
    return unit;
  }

  /**
   * 找出间距
   * @param handleMinArray
   * @param _maxData
   */
  findInterval(
    handleMinArray: { min: number; intervals: number[] }[],
    _maxData: number
  ) {
    const { _count } = this;
    let findIntervals: { min: number; interval: number }[] = [];
    handleMinArray.forEach(item => {
      const minData = item.min;
      const originInterval = (_maxData - minData) / _count;
      const intervals = item.intervals;

      // @ts-ignore
      let findIndex = intervals.findIndex(
        (interval: number) => originInterval > interval
      );
      if (findIndex < 0) {
        findIndex = intervals.length;
      }
      const finalInterval = intervals[Math.max(0, findIndex - 1)];
      findIntervals.push({ min: minData, interval: finalInterval });
    });

    findIntervals.sort((o1, o2) => {
      const diff = o1.interval - o2.interval;
      return diff == 0 ? Math.abs(o1.min) - Math.abs(o2.min) : diff;
    });
    return findIntervals[0];
  }

  /**
   *  预处理最小值
   * @param minData
   * @param maxData
   */
  preHandleMin(minData: number, maxData: number) {
    let { _count, minBaseGenStrategry } = this;
    let interval = (maxData - minData) / _count;

    let minArray = [];
    if (minData >= 0 && minData < interval) {
      let newMin = 0;
      let basePowNum = AxisHelper.genPowNum(maxData / _count);

      minArray.push({
        min: newMin,
        intervals: this.allBaseGenStrategy(basePowNum)
      });
    } else {
      let basePowNum = AxisHelper.genPowNum(interval);

      const baseArray = minBaseGenStrategry(interval, minData);
      const maxHandleCount = 4;
      const handlePart = minData % (basePowNum * 10);
      const remainPart = minData - handlePart;

      for (let i = 0; i < baseArray.length; i++) {
        const item = baseArray[i];
        if (item <= handlePart) {
          const newMin = AxisHelper.keepValidDecimal(
            (remainPart + item).toFixed(this.maxDecimal)
          );
          let intervals: number[] = [];
          basePowNum = AxisHelper.genPowNum((maxData - newMin) / this._count);

          if (item == 0) {
            intervals = this.allBaseGenStrategy(basePowNum);
          } else if (item % (2.5 * basePowNum) == 0) {
            intervals = this.oddBaseGenStrategy(basePowNum);
          } else {
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
  }
}

export default YAxisTransformer;
