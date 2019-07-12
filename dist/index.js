"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var YAxisTransformer_1 = __importDefault(require("./YAxisTransformer"));
var AxisHelper = __importStar(require("./AxisHelper"));
exports.default = {
    YAxisTransformer: YAxisTransformer_1.default,
    AxisHelper: AxisHelper
};
function transform(min, max, isPercent) {
    var yAxisTransformer = new YAxisTransformer_1.default().withMinMaxData(min, max);
    if (isPercent) {
        yAxisTransformer.withPercentUnit();
    }
    return yAxisTransformer.transform();
}
exports.transform = transform;
