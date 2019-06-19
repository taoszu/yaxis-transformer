'use strict';
const expect = require('chai').expect;
const YaxisTransformer = require('../dist/YAxisTransformer').YAxisTransformer

describe('yaxis transform test', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([1000, 22555])
    const transformResult = yaxisTransformer
     .withCount(3)
     .withForceDecimal(1)
     .withFormatRuler((data, decimal) => {
         return data.toFixed(decimal)
     })
     .withUnitSet([{range:10000, unit:"万"}])
     .transform()

     expect(yaxisTransformer._maxData).equal(30000)
     expect(yaxisTransformer._minData).equal(0)

    expect(transformResult.data).deep.equal([0, 10000, 20000, 30000]).deep
    expect(transformResult.dataUnit).deep.equal(['0', '1.0万', '2.0万', '3.0万']).deep
  });
});