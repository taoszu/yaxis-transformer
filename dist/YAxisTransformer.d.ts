export declare type Strategy = (interval: number) => number[];
export declare type Unit = {
    range: number;
    unit: string;
};
export declare type TransformResult = {
    data: number[];
    dataUnit: string[];
    adviseDecimal: number;
};
export declare class YAxisTransformer {
    private maxData;
    private minData;
    /**
     *  基准值生成策略
     */
    private baseGenStrategy;
    /**
     *  生成间距数目
     */
    private count;
    /**
     * 最小值小于interval 是否格式化为0
     */
    private minToZero;
    /**
     * 最小值为0 是否保留单位
     */
    private keepZeroUnit;
    /**
     * 保持单位一致
     */
    private keepUnitSame;
    /**
     * 当keepUnitSame为true时
     * unit跟随最大值当的结果
     */
    private unitFollowMax;
    private unitSet;
    /**
     * 强制小数位数
     */
    private forceDecimal;
    private usePercentUnit;
    constructor(values?: number[]);
    withCount(count: number): this;
    withUnitSet(unitSet: Unit[]): this;
    withPercentUnit(): this;
    withMinMaxData(minData: number, maxData: number): this;
    withBaseGenStrategy(baseGenStrategy: Strategy): this;
    withForceDecimal(decimal: number): this;
    withKeepZeroUnit(keepZeroUnit: boolean): this;
    withKeepUnitSame(keepUnitSame: boolean): this;
    withUnitFollowMax(unitFollowMax: boolean): this;
    withMinToZero(minToZero: boolean): this;
    transform(): TransformResult;
    private sortUnitSet;
    private findUnit;
    private handleMin;
}
export default YAxisTransformer;
