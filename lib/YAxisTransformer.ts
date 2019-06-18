import * as AxisHelper from "./AxisHelper"

export type Strategy = (interval: number) => number[]

export type Unit = { range: number, unit: string }

export type TransformResult = { data: number[], dataUnit: string[], adviseDecimal: number }


/**
 *
 * demo
 */
export function demo() {
    const value = [152, 514]
    const transformer = new YAxisTransformer(value)
    const result = transformer
        .withCount(4)
        .withPercentUnit()
        .transform()

    alert(JSON.stringify(result))
}

export class YAxisTransformer {

    private maxData:number = - Number.MAX_VALUE
    private minData:number = Number.MAX_VALUE

    /**
     *  基准值生成策略
     */
    private baseGenStrategy: Strategy = AxisHelper.defaultBaseGenStrategy

    /**
     *  生成间距数目
     */
    private count = 4

    /**
     * 最小值小于interval 是否格式化为0
     */
    private minToZero = true

    /**
     * 最小值为0 是否保留单位
     */
    private keepZeroUnit = false


    /**
     * 保持单位一致
     */
    private keepUnitSame = true

    /**
     * 当keepUnitSame为true时
     * unit跟随最大值当的结果
     */
    private unitFollowMax = true

    private unitSet = [{range: 10000, unit: "万"}, {range: 100000000, unit: "亿"}]

    /**
     * 强制小数位数
     */
    private forceDecimal: number | undefined


    private usePercentUnit = false

    constructor(values?: number[]) {
        if (values) {
            values.forEach((value) => {
                if (value > this.maxData) {
                    this.maxData = value
                }

                if (value < this.minData) {
                    this.minData = value
                }

            })
        }
    }

    withCount(count: number) {
        this.count = count
        return this
    }

    withUnitSet(unitSet: Unit[]) {
        this.unitSet = unitSet
        return this
    }

    withPercentUnit() {
        this.unitSet = [AxisHelper.percentUnit]
        this.usePercentUnit = true
        this.keepUnitSame = true
        return this
    }

    withMinMaxData(minData: number, maxData: number) {
        this.minData = minData
        this.maxData = maxData
        return this
    }

    withBaseGenStrategy(baseGenStrategy: Strategy) {
        this.baseGenStrategy = baseGenStrategy
        return this
    }

    withForceDecimal(decimal: number) {
        this.forceDecimal = decimal
        return this
    }

    withKeepZeroUnit(keepZeroUnit: boolean) {
        this.keepZeroUnit = keepZeroUnit
        return this
    }

    withKeepUnitSame(keepUnitSame: boolean) {
        this.keepUnitSame = keepUnitSame
        return this
    }

    withUnitFollowMax(unitFollowMax: boolean) {
        this.unitFollowMax = unitFollowMax
        return this
    }

    withMinToZero(minToZero: boolean) {
        this.minToZero = minToZero
        return this
    }

    transform(): TransformResult {
        this.sortUnitSet()

        let {
            maxData, minData, count, keepUnitSame, usePercentUnit,
            unitFollowMax, forceDecimal, keepZeroUnit, baseGenStrategy
        } = this


        let unit
        let decimal = forceDecimal
        let adviceDecimal
        let interval


        if (maxData == minData) {
            interval = minData
            maxData = AxisHelper.genMaxData(minData, interval, count)
        }

        minData = this.handleMin(maxData, minData)
        interval = (maxData - minData) / count
        interval = AxisHelper.findInterval(interval, baseGenStrategy)
        maxData = AxisHelper.genMaxData(minData, interval, count)
        

        // 找出单位
        unit = AxisHelper.minUnit
        if (usePercentUnit) {
            unit = AxisHelper.percentUnit
        } else if (keepUnitSame) {
            unit = unitFollowMax ? this.findUnit(maxData) : this.findUnit(minData)
        }

        // 处理小数位数
        adviceDecimal = AxisHelper.getDecimal(interval, maxData, unit)
        if (!decimal) {
            decimal = adviceDecimal
        }

        const data: number[] = []
        const dataUnit: string[] = []
        for (let i = 0; i < count + 1; i++) {
            const result = minData + interval * i
            if (!keepUnitSame && !usePercentUnit) {
                unit = this.findUnit(result)
            }
            let formatResult = (result / unit.range).toFixed(decimal)
            if (result != 0 || keepZeroUnit) {
                formatResult = formatResult + unit.unit
            }
            data.push(result)
            dataUnit.push(formatResult)
        }

        return {
            data: data,
            dataUnit: dataUnit,
            adviseDecimal: adviceDecimal,
        }

    }

    private sortUnitSet() {
        let {unitSet} = this
        unitSet.sort((one, other) => {
            return one.range - other.range
        })
    }

    private findUnit(data: number) {
        let {unitSet} = this
        let unit = AxisHelper.minUnit
        unitSet.forEach(item => {
            if (data >= item.range) {
                unit = item
            }
        })
        return unit
    }

    private handleMin(maxData: number, minData: number) {
        let {count, minToZero, baseGenStrategy} = this

        let interval = (maxData - minData) / count
        let baseInterval = AxisHelper.findInterval(interval, this.baseGenStrategy)

        if (minData > 0 && baseInterval > minData && minToZero) {
            return 0
        } else {
            let intervalPowNum = AxisHelper.genPowNum(interval)
            let baseNum = intervalPowNum * 10
            let keepPart = Math.floor(minData / baseNum) * baseNum

            let remainPart = minData - keepPart
            let remainPowNum = AxisHelper.genPowNum(remainPart)
            //如果间距和需要处理的是同一个数量级 则需要再做查找interval的操作
            if (intervalPowNum == remainPowNum) {
                return keepPart + AxisHelper.findMinInterval(remainPart, baseGenStrategy)
            } else {
                return keepPart
            }
        }
    }

}
