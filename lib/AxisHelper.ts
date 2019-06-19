import {Strategy, Unit} from "./YAxisTransformer";
export const minUnit = {range:1, unit:""}
export const percentUnit = {range:0.01, unit:"%"}

export function genMaxData(minData:number, interval:number, count:number) {
    return  minData + interval * count
}

export function findInterval(range: number, strategyFunc:Strategy) {
    let originInterval = range
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
    return Math.floor(Math.log10(Math.abs(data)))
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


export function getDecimal(interval: number, max:number, unit:Unit) {
    if (isContainDecimal(interval)) {
        let decimal = Math.abs(getPowBit(interval))
        if (unit.unit == percentUnit.unit) {
            decimal = Math.max(0, decimal - 2)
        }
        return decimal

    } else if(isEmpty(unit.unit)) {
        return 0
    } else {
        const decimal = getPowBit(max) - getPowBit(interval)
        return Math.abs(decimal)
    }

}

export function isEmpty(text:string):boolean {
    return text == null || text.length == 0
}