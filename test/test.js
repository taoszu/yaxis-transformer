'use strict';
const expect = require('chai').expect;
const YaxisTransformer = require('../dist/YAxisTransformer').YAxisTransformer

describe('yaxis transform test', () => {
  it('result ', () => {

    const yaxisTransformer = new YaxisTransformer([10000, 22555])
    const transformResult = yaxisTransformer
     .withCount(3)
     .transform()

    expect(transformResult.data).deep.equal([10000, 15000, 20000, 25000]).deep
    expect(transformResult.dataUnit).deep.equal(['1.0万', '1.5万', '2.0万', '2.5万']).deep
  });
});