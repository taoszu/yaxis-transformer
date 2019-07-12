import YAxisTransformer from './YAxisTransformer'
import * as AxisHelper from "./AxisHelper"
export default {
    YAxisTransformer,
    AxisHelper
}

export function transform(min:number, max:number, isPercent:boolean) {
    const yAxisTransformer = new YAxisTransformer().withMinMaxData(min, max)
    if(isPercent) {
        yAxisTransformer.withPercentUnit()
    }

    return yAxisTransformer.transform()
}