# 多参的进化与发展
## 函数调用
### JS调用函数时隐式传递的参数
JS有个有趣的地方：  
> 在调用函数时，函数会隐式的接收到两个参数：  
> * this：函数上下文（调用该函数的对象）
> * arguments：实参对象（函数被调用时接收到的全部实参）
## arguments参数伪数组
arguments：实参类数组对象  
**不要说话，先上代码！**  
```js
function test(){
   for(var i=0;i<=arguments.length;i++){
        alert(""+arguments[i]);
   }    
}
test(1,2,3,4,5,6)
```
通过代码，我们可以知道：  
* 即使 `函数` 未定义形参，但 `arguments` 依旧可以接收到函数被调用时的全部实参数据
* `arguments` 也有 `length` 属性，可通过它获得 `arguments` 成员数（长度）
* `arguments` 支持像数组一样的通过索引获得指定的实参

**但其实arguments并不是数组**  
我们可以通过一个简单的代码证明它是一个对象：  
```js
function test () {
  console.log(arguments)
  console.log(typeof arguments)
  console.log(arguments instanceof Array)
}
test(1, 2, 3, 4, 5, 6)
```
结果：  
```bash
[Arguments] { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6 }
object
false
```
注意：  
* arguments是伪数组（类似数组的对象）
* arguments可以修改元素，但不能改变数组的长短。
* > 可以使用索引获取/修改，但无法使用push()来删除元素  

**更多方法**  
* Caller  
* callee  
> JavaScript新版本中已不推荐使用它们，并且在严格模式下ECMAScript 5中禁止使用它们。
## REST多余参数
### rest参数：解决前面参数确定，后面参数不定的场景
比如，我们平常经常会碰见这样一个问题：  
由于场景不同，我们需要使用的实参个数可能发生变化，但是我们无法事先确定到底有几个形参：  
```js
var test = function (a, b) {
  console.log(a)
  console.log(b)
}
test(1, 2, 3, 4, 5, 6)
```
我们只能使用预先定义好的形参，后面的数据(3,4,5,6)全部无法获取  
但是：  
<span> </span><span> </span><span> </span><span> </span>如果，我们使用`rest参数`，就可以解决不确定需要传递几个参数的问题：  
```js
var test = function (a, b, ...rest) {
  console.log(a)
  console.log(b)
  console.log(rest)
}
test(1, 2, 3, 4, 5, 6)
```
结果：  
```bash
1
2
[ 3, 4, 5, 6 ]
```
数组排序：  
```js
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```
注意：  
* rest参数必须是函数最后一个形参（如果只有一个，那就只能是它）  
* 相比于arguments对象，rest是一个数组，方便操作
* 函数的length属性，不包括 rest 参数  
```js
(function(a) {}).length  // 1
(function(...a) {}).length  // 0
(function(a, ...b) {}).length  // 1
```
注意：匿名函数后面需要加分号，不然会把这三行当做一行导致报错。  

更多：
[ES6专题—扩展运算符和rest运算符](https://zhuanlan.zhihu.com/p/59502528)![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200619114530.jpg)
## 扩展运算符...
扩展运算符 是 REST参数 的 逆向运算  
### 数组扩展运算符-ES6
```js
var a = [1, 2, 3, 4, 5, 6]
console.log(...a)
console.log(1, 11, 111, ...[2, 22, 222], 3, 33)
```
结果：  
```bash
1 2 3 4 5 6
1 11 111 2 22 222 3 33
```
#### 扩展运算符应用
**数组拷贝**  
```js
var a = [1, 2, 3, 4, 5, 6]
// var b = Array.from(a, x => x)
// 效果更强，第二个参数可省略也可传递一个处理函数，和filter高阶函数差不多（a.filter(x => true)）
var b = [...a]// var b = a.slice()// a.slice(0, a.length)
console.log(b)
```
注意：嵌套的数组不行。  

更多：[js中常用的10种数组方法总结](http://blog.sina.com.cn/s/blog_13cd2fec00102wqr4.html])

**数组合并**  
```js
var a = [1, 2, 3]
var b = [4, 5, 6]
var c = [...a, ...b]
console.log(c)
```
我们可以稍微改进下：  
```js
var a = [1, 2, 3]
var b = [4, 5, 6]
// 类似数组的 concat()方法
var sumArr = function (...rest) {
  var totalArr = []
  rest.forEach(function (item, index) {
    totalArr.push(...item)
  })
  // return [...rest => rest.foreach()]
  return totalArr
}
var c = sumArr(a, b)// var c = [];c = c.concat(a, b);console.log(c)
console.log(c)
```
结果：  
```bash
[ 1, 2, 3, 4, 5, 6 ]
```
注意：同样不支持多层数组,我们通过上面简单实现了数组的concat合并方法。  
> 更多：
[【译】快速入门ES6解构以及rest参数语法](https://juejin.im/post/5b98781f6fb9a05d2a1d5327#heading-6)

### 对象扩展运算符（spread）-ES7
ES7将 Rest 解构赋值 / 扩展运算符（ ... ）引入对象，这意味着之前在数组里的rest参数和...扩展运算符在对象同样生效！  

***rest参数结合解构赋值***：  

```js
var obj = {
  a: 1,
  b: 'zhangsan',
  c: {
    d: [1, 2, 3]
  }
}
console.log(obj)
// 解构赋值变量必须和对象属性同名，不然取不到对应值
var { x, y, ...obj2 } = obj
console.log(x, y, obj2)
// 同名时正常获得
var { a, b, ...obj3 } = obj
console.log(a, b, obj3)
// 同名时本质是解构的简写形式！上面本质是：var {a:a,b:b,...obj3} = obj
var { a: z, b: w, ...obj4 } = obj
console.log(z, w, obj4)
```
运行结果：  
```bash
{ a: 1, b: 'zhangsan', c: { d: [ 1, 2, 3 ] } }

undefined undefined { a: 1, b: 'zhangsan', c: { d: [ 1, 2, 3 ] } }

1 zhangsan { c: { d: [ 1, 2, 3 ] } }

1 zhangsan { c: { d: [ 1, 2, 3 ] } }
```
注意：  
* 对象的 Rest 解构赋值用于从一个对象取值，相当于将所有可遍历的、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。
* 完整解构赋值里需要注意--->  变量名和属性名的前后顺序  
* 上面代码：  变量obj3是 Rest 解构赋值所在的对象。它获取等号右边的所有尚未读取的键（a和b之外的键），将它们和它们的值拷贝。

更多：[对象的解构赋值](https://www.cnblogs.com/zfdai/p/9473825.html)

***扩展运算符***：  

**对象拷贝**：  
```js
var obj = {
  a: 1,
  b: 'zhangsan',
  c: {
    d: [1, 2, 3]
  }
}
console.log(obj) // { a: 1, b: 'zhangsan', c: { d: [ 1, 2, 3 ] } }
var obj2 = { ...obj } // 等同于 Object.assign({}, obj);
console.log(obj2) // { a: 1, b: 'zhangsan', c: { d: [ 1, 2, 3 ] } }
```
表面上，我们拷贝obj获得了一个完整的新obj2对象，但其实，这只是个浅拷贝！
```js
var obj = {
  a: 1,
  b: 'zhangsan',
  c: {
    d: [1, 2, 3]
  }
}
console.log('----var定义----扩展运算：obj,obj2---------')
console.log(obj) // { a: 1, b: 'zhangsan', c: { d: [ 1, 2, 3 ] } }
// 扩展运算是  浅拷贝
var obj2 = { ...obj }
console.log(obj2) // { a: 1, b: 'zhangsan', c: { d: [ 1, 2, 3 ] } }
console.log('-----------------')
console.log('----var定义----扩展运算拷贝后修改obj,看obj2是否发生变化---------')
obj.c.d = [4, 5, 6]
console.log(obj) // { a: 1, b: 'zhangsan', c: { d: [ 4, 5, 6 ] } }
console.log(obj2) // { a: 1, b: 'zhangsan', c: { d: [ 4, 5, 6 ] } }
console.log('-----------------')
// 解构赋值和rest结合使用 还是  浅拷贝
console.log('----var定义----解构赋值运算：obj,obj3---------')
var { ...obj3 } = obj
obj.c.d = [7, 8, 9]
console.log(obj) // { a: 1, b: 'zhangsan', c: { d: [ 7, 8, 9 ] } }
console.log(obj3) // { a: 1, b: 'zhangsan', c: { d: [ 7, 8, 9 ] } }
console.log(obj.c.d === obj2.c.d, obj.c.d === obj3.c.d) // true true
console.log('-----------------')
```
从上面代码，我们可以看出：当对象里有对象的时候，拷贝的仅仅是键所指向的对象的地址！

解构赋值拷贝的仅仅是 `对象里所有可读取属性，原型等隐藏属性不可拷贝`：  
```js
var obj = {
  a: 1,
  b: 'zhangsan',
  c: {
    d: [1, 2, 3]
  }
}
console.log('----var定义----扩展运算：obj,obj2---------')
console.log(obj) // { a: 1, b: 'zhangsan', c: { d: [ 1, 2, 3 ] } }
// 扩展运算是  浅拷贝
var obj2 = { ...obj }
console.log(obj2) // { a: 1, b: 'zhangsan', c: { d: [ 1, 2, 3 ] } }
console.log('-----------------')
obj.__proto__ = { name: 'objProto' } // 给obj对象设置原型对象
var { ...obj3 } = obj
console.log(obj, obj.__proto__) // { a: 1, b: 'zhangsan', c: { d: [ 7, 8, 9 ] } }
console.log(obj3, obj3.__proto__) // { a: 1, b: 'zhangsan', c: { d: [ 7, 8, 9 ] } }
console.log('-----------------')
```
注意：[设置/修改原型的建议](https://eslint.org/docs/rules/no-proto)

**对象合并**  
```js
var obj = {
  a: 1,
  b: 'zhangsan',
  c: {
    d: [1, 2, 3]
  }
}
var obj1 = {
  a: 2,
  d: 'lisi'
}
console.log(obj) // { a: 1, b: 'zhangsan', c: { d: [ 1, 2, 3 ] } }
var obj2 = { ...obj, ...obj1 } // 等同于 Object.assign({}, obj, obj1) 或者 Object.assign(obj, obj1)
console.log(obj2) // { a: 2, b: 'zhangsan', c: { d: [ 1, 2, 3 ] }, d: 'lisi' }
```

注意：  
* 两个对象合并，键相同，后者对象值会覆盖前者
* 如果扩展运算符的参数是null或undefined，这个两个值会被忽略，不会报错。  
```js
var obj = {...undefined}
```

> [spread与rest运算符](https://segmentfault.com/q/1010000012679484)的区别：  

1. 等号表达式是典型的赋值形式，函数传参和for循环的变量都是特殊形式的赋值。解构的原理是赋值的两边具有相同的结构，就可以正确取出数组或对象里面的元素或属性值，省略了使用下标逐个赋值的麻烦。
2. 对于三个点号，三点放在形参或者等号左边为rest运算符; 放在实参或者等号右边为spread运算符，或者说，放在被赋值一方为rest运算符，放在赋值一方为扩展运算符。
3. 经验：

   • 在等号赋值或for循环中，如果需要从数组或对象中取值，尽量使用解构。
   • 在自己定义函数的时候，如果调用者传来的是数组或对象，形参尽量使用解构方式，优先使用对象解构，其次是数组解构。代码可读性会很好。
   • 在调用第三方函数的时候，如果该函数接受多个参数，并且你要传入的实参为数组，则使用扩展运算符。可以避免使用下标形式传入参数。也可以避免很多人习惯的使用apply方法传入数组。
   • rest运算符使用场景应该稍少一些，主要是处理不定数量参数，可以避免arguments对象的使用。
4. [ES7中对象的spread与rest](https://blog.csdn.net/qq_30100043/article/details/53424750)

更多：[妙用ES6解构和扩展运算符让你的代码更优雅](https://www.cnblogs.com/chrischjh/p/4848934.html)