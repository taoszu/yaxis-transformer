## y轴格式化

* 引入
npm i @taoszu/yaxis-transformer

* 使用

```js

    const yaxisTransformer = new YaxisTransformer([1000, 22555])
    const transformResult = yaxisTransformer
     .withCount(3)
     .withForceDecimal(2)
     .transform()
```

生成结果为  { 
    data: [0, 10000, 20000, 30000],
    dataUnit: ['0.00', '1.00万', '2.00万', '3.00万'], 
    adviseDecimal: 1 
}




