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

    const yaxisTransformer = new YaxisTransformer([1542, 6100])
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
     expect(transformResult.data).deep.equal([1000, 3000, 5000, 7000]).deep
     expect(transformResult.dataUnit).deep.equal(['1000', '3000', '5000', '7000']).deep


  });
});


describe('yaxis transform test 3', () => {
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


describe('yaxis transform test 4', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([100, 22555])
    let transformResult = yaxisTransformer
     .withCount(3)
     .withMinToZero(true)
     .withFormatRuler((data, decimal) => {
         return data.toFixed(decimal)
     })
     .withUnitSet([{range:10000, unit:"万"}])
     .transform()

     expect(transformResult.adviseDecimal).equal(0)
     expect(transformResult.data).deep.equal([0, 10000, 20000, 30000]).deep
     expect(transformResult.dataUnit).deep.equal(['0', '1万', '2万', '3万']).deep
  });
});


describe('yaxis transform test 5', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([0.25, 0, 0, 0.00990099009900991, 0, 0.010101010101010166])
    let transformResult = yaxisTransformer
     .withCount(3)
     .withMinToZero(true)
     .withUnitSet([{range:10000, unit:"万"}])
     .transform()

     expect(transformResult.adviseDecimal).equal(1)
     expect(transformResult.data).deep.equal([0, 0.1, 0.2, 0.30000000000000004]).deep
     expect(transformResult.dataUnit).deep.equal(['0', '0.1', '0.2', '0.3']).deep
  });
});