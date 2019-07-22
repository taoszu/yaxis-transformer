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
export declare function findInterval(interval: number, strategyFunc: Strategy): number;
/**
 * 查找最小值需格式化部分的值
 * @param remainPart
 * @param interval
 */
export declare function findMinInterval(remainPart: number, strategyFunc: Strategy): number;
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
 * 获取小数的小数位数位数
 * @param data
 */
export declare function getDecimalNum(data: number): number;
/**
 * 绝对值小于1的小数转为绝对值大于1的数 最小需要的小数位数
 */
export declare function getMinDecimalToInt(data: number): number;
/**
 * 小于1的小数扩大转为大于1的数
 * @param data
 */
export declare function decimalToInt(data: number): number;
/**
 * 是否包含小数
 * @param data
 */
export declare function isContainDecimal(data: number): boolean;
export declare function isContainInt(data: number): boolean;
export declare function getValidDecimalNum(data: number, unit: Unit): void;
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
export declare function getDecimal(min: number, reference: number, interval: number, unit: Unit): number;
export declare function isEmpty(text: string): boolean;
