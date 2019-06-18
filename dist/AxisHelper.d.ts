import { Strategy, Unit } from "./YAxisTransformer";
export declare const minUnit: {
    range: number;
    unit: string;
};
export declare const percentUnit: {
    range: number;
    unit: string;
};
export declare function genMaxData(minData: number, interval: number, count: number): number;
export declare function findInterval(range: number, strategyFunc: Strategy): number;
/**
 * 查找最小值需格式化部分的值
 * @param remainPart
 * @param interval
 */
export declare function findMinInterval(remainPart: number, strategyFunc: Strategy): number;
export declare function defaultBaseGenStrategy(originInterval: number): number[];
/**
 * 生成十的幂次方
 * @param data
 */
export declare function genPowNum(data: number): number;
/**
 *  获取数字的十的幂次方的位数
 *  如 90 则为 1
 *  如 0.01则为 -2
 * @param data
 */
export declare function getPowBit(data: number): number;
/**
 * 是否包含小数
 * @param data
 */
export declare function isContainDecimal(data: number): boolean;
export declare function isContainInt(data: number): boolean;
export declare function getDecimal(interval: number, max: number, unit: Unit): number;
export declare function isEmpty(text: string): boolean;
