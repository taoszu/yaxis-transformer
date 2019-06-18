## y轴格式化

- 版本号

  `1.0.3` 

- 引入

```
npm i yaxis-transformer
```

- 使用

```js
const yaxisTransformer = new YaxisTransformer([1000, 22555])
const transformResult = yaxisTransformer
     .withCount(3)
     .withForceDecimal(2)
     .withUnitSet([{range:10000, unit:"万"}])
     .transform()
```

- 计算结果

  ```{
  {
    data: [0, 10000, 20000, 30000],
    dataUnit: ['0.00', '1.00万', '2.00万', '3.00万'], 
    adviseDecimal: 1 
  }
  ```

   其中，data是计算得到的一组数据数组，dataUnit是格式之后带单位的值，格式化的配置可以灵活定制，如小数位数，单位设置等等。adviseDecimal是计算之后得到的建议小数位数。
