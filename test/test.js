'use strict';
const expect = require('chai').expect;
const YaxisTransformer = require('../dist/YAxisTransformer').YAxisTransformer

describe('yaxis transform test', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([1000, 22555])
    const transformResult = yaxisTransformer
     .withCount(3)
     .withForceDecimal(2)
     .withUnitSet([{range:10000, unit:"万"}])
     .transform()

     transformResult.adviseDecimal

    expect(transformResult.data).deep.equal([0, 10000, 20000, 30000]).deep
    expect(transformResult.dataUnit).deep.equal(['0.00', '1.00万', '2.00万', '3.00万']).deep
  });
});