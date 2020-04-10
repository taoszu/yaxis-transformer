import {Strategy, Unit} from "./YAxisTransformer";
import { bignumber } from "mathjs";
export const minUnit = {range:1, unit:""}
export const percentUnit = {range:0.01, unit:"%"}

export function genMaxData(minData:number, interval:number, count:number) {
    return  minData + interval * count
}

export function findInterval(interval: number, strategyFunc:Strategy) {
    let originInterval = interval
    let factorList = strategyFunc(originInterval)
    for (let i = 1; i < factorList.length; i++) {
        if (originInterval > factorList[i]) {
            return factorList[i - 1]
        }

    }
    return originInterval
}

/**
 * 查找最小值需格式化部分的值
 * @param remainPart
 * @param interval
 */
export function findMinInterval(remainPart: number,  strategyFunc:Strategy) {
    let factorList = strategyFunc(remainPart)
    for (let i = 1; i < factorList.length; i++) {
        if (remainPart >= factorList[i]) {
            return factorList[i]
        }
    }
    return 0
}


/**
 * 生成十的幂次方
 * @param data
 */
export function genPowNum(data: number) {
    let bit = getPowBit(data)
    let base = Math.pow(10, bit)
    if (data < 0) {
        base = -base
    }
    return base
}

/**
 *  获取数字的十的幂次方的位数
 *  如 90 则为 1
 *  如 0.01则为 -2
 * @param data
 */
export function getPowBit(data: number) {
    return (data == 0) ? 0 :  Math.floor(log10(Math.abs(data)))
}

export function log10(data: number) {
    return Math.log(data) / Math.log(10)
}
/**
 * 获取小数的小数位数位数
 * @param data 
 */
export function getDecimalNum(data:number) {
    let dataStr = Math.abs(data).toString()
    let decimalIndex = dataStr.indexOf(".");
    return decimalIndex < 0 ? 0 : dataStr.length - decimalIndex - 1;
}

/**
 * 绝对值小于1的小数转为绝对值大于1的数 最小需要的小数位数
 */
export function getMinDecimalToInt(data:number) {
    data = Math.abs(data)
    let decimal = 0
    while(data < 1) {
        decimal ++
        data *= 10
    }
    return decimal
}

/**
 * 小于1的小数扩大转为大于1的数
 * @param data 
 */
export function decimalToInt(data:number) {
    let decimal = 0
    while(data  < 1) {
        decimal ++
        data *= 10
    }
    return data
}

/**
 * 是否包含小数
 * @param data
 */
export function isContainDecimal(data: number) {
    return Math.floor(data) !== data
}

export function isContainInt(data: number) {
    return data >= 1
}

export function getValidDecimalNum(value:number) {
    const data = value.toString()
    let decimalIndex = data.indexOf(".")
    if(decimalIndex < 0) {
        return 0
    } else {
        if(data.lastIndexOf("0") == data.length - 1) {
            const decimalStr = data.substring(decimalIndex).replace("0", "")
            return decimalStr.length
        } else {
            return data.length - decimalIndex - 1
        }
    }
}

/**
 * 保存data的小数位数和decimal一致
 * @param data 
 * @param decimal 
 */
export function keepDecimalNumber(data:number, decimal:number) {
    return Number(data.toFixed(decimal))
}

export function keepValidDecimal(data:string) {
    const value = Number(data)
    return Number(value.toFixed(getValidDecimalNum(value)))
}

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
export function getDecimal(hasDecimal:boolean, min: number, reference:number, interval:number, unit:Unit) {
    let decimal

    if(hasDecimal) {
        const minDecimal = getDecimalNum(min)
        const intervalDecimal = getDecimalNum(interval)
        decimal = Math.max(minDecimal, intervalDecimal)
    } else {
        const realMin = min < interval ? min: interval
        if(realMin > reference || isEmpty(unit.unit)) {
            decimal = 0
        } else {
            if(realMin == 0) {
                decimal = getDecimalNum(interval/unit.range)
            } else {
                decimal = Math.max(getDecimalNum(min/unit.range), getDecimalNum(interval/unit.range))
            }
        }
    }
    decimal = Math.max(0, decimal)

    // 如果是百分比 需要减2
    if (unit.unit == percentUnit.unit) {
        decimal = Math.max(0, decimal - 2)
    }
    return decimal
}

export function isEmpty(text:string):boolean {
    return text == null || text.length == 0
}