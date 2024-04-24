# JavaScript基础面试题与解析
## ES5
1. `typeof`能判断哪些类型？
`typeof`能识别的类型有：
* 基本类型：`number`、`string`、`boolean`、`undefined`  
> ES6及以后新增：`Syboml`、`BigInt`
```js
var a = 1
console.log(a,typeof a)// 1 "number"
var a = 'huansheng' - 1
console.log(a,typeof a)// NaN "number" ；NaN是一个不是数字的特殊数字类型
var a = '1'
console.log(a,typeof a)// 1 string
var a = true
console.log(a,typeof a)// true "boolean"
var a = undefined
console.log(a,typeof a)// undefined "undefined"
var a = Symbol('1')
console.log(a,typeof a)// Symbol(1) "symbol"
var a = BigInt('11111111111111111111111111111111')
console.log(a,typeof a)// 11111111111111111111111111111111n "bigint"
```
* 引用类型：`function`、`object`
```js
var a = null
console.log(a,typeof a)// null "object"
var a = function(){}
console.log(a,typeof a)// ƒ (){} "function"
var a = {}
console.log(a,typeof a)// {} "object"
var a = []
console.log(a,typeof a)// [] "object"
```
> 要想具体判断对象类型，需使用：`obj实例 intanceof Object类型` 或者 `Object.prototype.toString.call(obj实例)` 

更多：[instanceof与typeof原理浅析](../web/js/变量类型判断.md)  

2. 实现一个深拷贝函数
```js
function deepCopy (obj, cache = []) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    if (Object.prototype.toString.call(obj) === '[object Date]') return new Date(obj)
    if (Object.prototype.toString.call(obj) === '[object RegExp]') return new RegExp(obj)
    if (Object.prototype.toString.call(obj) === '[object Error]') return new Error(obj)
   
    const item = cache.filter(item => item.original === obj)[0]
    if (item) return item.copy
    
    let copy = Array.isArray(obj) ? [] : {}
    cache.push({
        original: obj,
        copy
    })

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })
    return copy
}
```
更多：[深浅拷贝](../web/js/深浅拷贝.md)

3. 通过扁平化数组数据生成一个树形结构
> 1. 递归方式调用
```js
// 原始数组数据
const models = [
  { id: 1, title: 'hello', parent: 0 },
  { id: 3, title: 'hello', parent: 1 },
  { id: 4, title: 'hello', parent: 3 },
  { id: 5, title: 'hello', parent: 4 },
  { id: 2, title: 'hello', parent: 0 },
  { id: 6, title: 'hello', parent: 4 },
  { id: 7, title: 'hello', parent: 3 },
  { id: 8, title: 'hello', parent: 10 }
]
// 封装的函数，传入两个参数，一个是原始数组数据，一个是最顶层父级元素ID
function getNestedChildren (arr, parent) {
  var out = []
  for (const item of arr) {
    // 如果数组元素的父级ID如果等于传入的父级ID
    if (item.parent === parent) {
    // 如果其父级为顶级ID，则递归调用方法，传入其自身ID判断并获取其子项数据
      const children = getNestedChildren(arr, item.id)
      // 如果children属性值长度不为零，即其子项不为空
      if (children.length) {
        // 将其结果children赋值给子项
        item.children = children
      }
      // 如果数组元素的父级ID如果等于传入的父级ID，将其Push到结果数组里
      out.push(item)
    }
  }
  return out
}
// 调用我们封装的函数
const nestedStructure = getNestedChildren(models, 0)
// 打印最终结果
console.log(nestedStructure)
```
> 2. [多次循环实现无限层级树形数据结构](https://blog.csdn.net/Mr_JavaScript/article/details/82817177)
```js
function treeData(source, id, parentId, children){   
    let cloneData = JSON.parse(JSON.stringify(source))
    return cloneData.filter(father=>{
        let branchArr = cloneData.filter(child => father[id] == child[parentId]);
        branchArr.length>0 ? father[children] = branchArr : ''
        return father[parentId] == 0        // 如果第一层不是parentId=0，请自行修改
    })
}
 
// 调用时，字段名以字符串的形式传参，如treeData(source, 'id', 'parentId', 'children')
```

99. `Object.is()` 与 `===` 的区别？  

...  
`Object.is()` 是 `===` 的BUG修复版，推荐使用前者。
## ES6

## Dom文档对象模型

## Bom浏览器API
