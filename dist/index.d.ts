import YAxisTransformer from './YAxisTransformer';
import * as AxisHelper from "./AxisHelper";
declare const _default: {
    YAxisTransformer: typeof YAxisTransformer;
    AxisHelper: typeof AxisHelper;
};
export default _default;
export declare function transform(min: number, max: number, isPercent: boolean): import("./YAxisTransformer").TransformResult;
