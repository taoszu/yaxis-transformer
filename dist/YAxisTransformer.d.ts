/**
 * 基准值生成策略
 */
export declare type Strategy = (interval: number) => number[];
/**
 * 格式化数据的规则
 * 应用于对四舍五入精度有要求的场景
 */
export declare type FormatRuler = (data: number, decimal: number) => string;
export declare type Unit = {
    range: number;
    unit: string;
};
export declare type TransformResult = {
    data: number[];
    dataUnit: string[];
    adviseDecimal: number;
    min: number;
    max: number;
    unit: Unit;
};
export declare class YAxisTransformer {
    /**
    * 奇数基准值生成策略
    */
    oddBaseGenStrategy: (basePowNum: number) => number[];
    /**
      * 偶数数基准值生成策略
      */
    evenBaseGenStrategy: (basePowNum: number) => number[];
    /**
     * 所有基准值生成策略
     */
    allBaseGenStrategy: (basePowNum: number) => number[];
    /**
     * 最小值基准值生成策略
     */
    minBaseGenStrategry: (interval: number, minData: number) => number[];
    defaultFormatRuler: (data: number, decimal: number) => string;
    defaultUnitSet: {
        range: number;
        unit: string;
    }[];
    private _maxData;
    private _minData;
    readonly maxData: number;
    readonly minData: number;
    /**
     * 格式化数据的规则
     */
    private formatRuler;
    /**
     *  生成间距数目
     */
    private _count;
    readonly count: number;
    /**
     * 最小值小于interval 是否格式化为0
     */
    private minToZero;
    /**
     * 最小值为0 是否保留单位
     */
    private keepZeroUnit;
    /**
     * 最小值为0 是否保留小数位数
     */
    private keepZeroDecimal;
    /**
     * 保持单位一致
     */
    private keepUnitSame;
    /**
     * 当keepUnitSame为true时
     * unit是否跟随最大值算出的结果
     */
    private unitFollowMax;
    private unitSet;
    /**
     * 强制小数位数
     */
    private forceDecimal;
    /**
     * 保留的最大小数位数
     */
    private maxDecimal;
    /**
     * 是否使用百分比
     */
    private usePercentUnit;
    constructor(values?: number[]);
    withCount(_count: number): this;
    withUnitSet(unitSet: Unit[]): this;
    withPercentUnit(): this;
    withMinMaxData(minData: number, maxData: number): this;
    withFormatRuler(formatRuler: FormatRuler): this;
    withForceDecimal(decimal: number): this;
    withMaxDecimal(decimal: number): this;
    withKeepZeroUnit(keepZeroUnit: boolean): this;
    withKeepUnitSame(keepUnitSame: boolean): this;
    withUnitFollowMax(unitFollowMax: boolean): this;
    withMinToZero(minToZero: boolean): this;
    withKeepZeroDecimal(keepZeroDecimal: boolean): this;
    transform(): TransformResult;
    private formatDataWithCheck;
    private sortUnitSet;
    private findUnit;
    /**
     * 找出间距
     * @param handleMinArray
     * @param _maxData
     */
    findInterval(handleMinArray: {
        min: number;
        intervals: number[];
    }[], _maxData: number): {
        min: number;
        interval: number;
    };
    /**
     *  预处理最小值
     * @param minData
     * @param maxData
     */
    preHandleMin(minData: number, maxData: number): {
        min: number;
        intervals: number[];
    }[];
}
export default YAxisTransformer;
