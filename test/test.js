'use strict';
const expect = require('chai').expect;
const YaxisTransformer = require('../dist/YAxisTransformer').YAxisTransformer

describe('yaxis transform test 1', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([100, 22555])
    let transformResult = yaxisTransformer
     .withCount(3)
     .withMinToZero(false)
     .withFormatRuler((data, decimal) => {
         return data.toFixed(decimal)
     })
     .withUnitSet([{range:10000, unit:"万"}])
     .transform()

     expect(transformResult.adviseDecimal).equal(2)
     expect(transformResult.data).deep.equal([100, 10100, 20100, 30100]).deep
     expect(transformResult.dataUnit).deep.equal(['0.01万', '1.01万', '2.01万', '3.01万']).deep
  });
});

describe('yaxis transform test 2', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([100, 22555])
    let transformResult  = yaxisTransformer
     .withCount(3)
     .withMinToZero(false)
     .withUnitFollowMax(false)
     .withFormatRuler((data, decimal) => {
         return data.toFixed(decimal)
     })
     .withUnitSet([{range:10000, unit:"万"}])
     .transform()

     expect(transformResult.adviseDecimal).equal(0)
     expect(transformResult.data).deep.equal([100, 10100, 20100, 30100]).deep
     expect(transformResult.dataUnit).deep.equal(['100', '10100', '20100', '30100']).deep


  });
});