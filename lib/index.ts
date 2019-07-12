import YAxisTransformer from './YAxisTransformer'
import * as AxisHelper from "./AxisHelper"
export default {
    YAxisTransformer,
    AxisHelper
}

export function tranform(min:number, max:number) {
    const yAxisTransformer = new YAxisTransformer().withMinMaxData(min, max)
    return yAxisTransformer.transform()
}