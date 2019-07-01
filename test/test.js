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
      .withUnitSet([{ range: 10000, unit: "万" }])
      .transform()

    expect(transformResult.adviseDecimal).equal(2)
    expect(transformResult.data).deep.equal([100, 10100, 20100, 30100]).deep
    expect(transformResult.dataUnit).deep.equal(['0.01万', '1.01万', '2.01万', '3.01万']).deep
  });
});

describe('yaxis transform test 2', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([1542, 6100])
    let transformResult = yaxisTransformer
      .withCount(3)
      .withMinToZero(false)
      .withUnitFollowMax(false)
      .withFormatRuler((data, decimal) => {
        return data.toFixed(decimal)
      })
      .withUnitSet([{ range: 10000, unit: "万" }])
      .transform()

    expect(transformResult.adviseDecimal).equal(0)
    expect(transformResult.data).deep.equal([1000, 3000, 5000, 7000]).deep
    expect(transformResult.dataUnit).deep.equal(['1000', '3000', '5000', '7000']).deep


  });
});


describe('yaxis transform test 3', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([100, 22555])
    let transformResult = yaxisTransformer
      .withCount(3)
      .withMinToZero(false)
      .withUnitFollowMax(false)
      .withFormatRuler((data, decimal) => {
        return data.toFixed(decimal)
      })
      .withUnitSet([{ range: 10000, unit: "万" }])
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
      .withUnitSet([{ range: 10000, unit: "万" }])
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
      .withUnitSet([{ range: 10000, unit: "万" }])
      .transform()

    expect(transformResult.adviseDecimal).equal(1)
    expect(transformResult.data).deep.equal([0, 0.1, 0.2, 0.30000000000000004]).deep
    expect(transformResult.dataUnit).deep.equal(['0', '0.1', '0.2', '0.3']).deep
  });
});

describe('yaxis transform test 6', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([-0.99994, -0.99992, -0.99990, -0.99989])
    let transformResult = yaxisTransformer
      .withCount(3)
      .withMinToZero(true)
      .withPercentUnit()
      .transform()

    expect(transformResult.adviseDecimal).equal(3)
    expect(transformResult.data).deep.equal([-0.99995, -0.9999, -0.99985, -0.9998]).deep
    expect(transformResult.dataUnit).deep.equal(['-99.995%', '-99.990%', '-99.985%', '-99.980%']).deep
  });
});


describe('yaxis transform test 7', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([0.5, 6.5])
    let transformResult = yaxisTransformer
      .withCount(3)
      .withMinToZero(false)
      .transform()

    expect(transformResult.adviseDecimal).equal(1)
    expect(transformResult.data).deep.equal([0.5, 2.5, 4.5, 6.5]).deep
    expect(transformResult.dataUnit).deep.equal(['0.5', '2.5', '4.5', '6.5']).deep
  });
});


describe('yaxis transform test 8', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([
      -0.1110716308666484,
      -0.08482853616429809,
      -0.09731445038757636,
      -0.12409227113546528,
      -0.10157881013488756,
      -0.12611438359020577
    ])
    let transformResult = yaxisTransformer
      .withCount(3)
      .withMinToZero(false)
      .withKeepZeroDecimal(false)
      .transform()

    expect(transformResult.adviseDecimal).equal(2)
    expect(transformResult.dataUnit).deep.equal(['-0.15', '-0.10', '-0.05', '0']).deep
  });
});
