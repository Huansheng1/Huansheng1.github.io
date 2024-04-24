# 循环方法与对比
各大编程语言中，必不可少的永远有循环语句，但是`JavaScript`从出生到现在出现了不同版本的循环方法，今天让我们来了解和掌握它们的基本用法和区别吧。
## for()循环：经典实用
`for`循环是编程史绕不开的循环方法，几乎所有主流编程语言都有它的身影。

常见`for`循环用法：
```js
var arr = [1, 2, 3, 'a', 'b', 'c']
for (let i = 0; i < arr.length; i++) {
  console.log(i, arr[i])
}
```
循环结果：
```js
0 1
1 2
2 3
3 a
4 b
5 c
```
[基本语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for)：
```js
for (起始条件;循环条件;步长){
  // 执行语句
}
```
解释：  
* **起始条件**：又名 初始化 [`initialization`](https://translate.google.cn/#view=home&op=translate&sl=auto&tl=zh-CN&text=initialization) /计数器定义；`for`循环执行的开始代码，只在循环时执行一次，通常用于 变量声明 或 初始化计数器变量。
* **循环条件**：又名 中断条件 [`condition`](https://translate.google.cn/#view=home&op=translate&sl=auto&tl=zh-CN&text=condition) /状态；`for`循环的判断语句，决定循环是否继续执行；该参数必须是返回布尔值的条件表达式。
> 注意：如果忘记传入该参数，默认为真，将会无限循环（传入非布尔值按转换成布尔值结果处理），非要忽略，请在循环执行代码里判断何时中断/跳出（`continue`/`break`/`return`）
* **步长设置**：又名 最终表达 [`final-expression`](https://translate.google.cn/#view=home&op=translate&sl=auto&tl=zh-CN&text=final-expression) /步进策略；`for`每次循环最后执行的表达式，常被用于更新或者递增计数器变量。
> 注意，上面三个参数都是可选的！！！
* 执行语句：[`statement`](https://translate.google.cn/#view=home&op=translate&sl=auto&tl=zh-CN&text=statement);每次循环执行的主体代码，如循环条件为`true`则执行 `{}`内语句，如果单行可省略`{}`和`for(...)`并成一行。
```js
for (let i = 0; i < arr.length; i++) console.log(i, arr[i])
```
忽略第一个参数：
```js
let i = 0
for (; i < arr.length; i++) console.log(i, arr[i])
```
忽略所有参数：
```js
let i = 0
for (; ;) {
  // 忽略啥就需要在里面写啥判断
  if (i >= arr.length) {
    return 'finished'
  };
  console.log(i, arr[i])
  i++
}
```
可是，这循环内部的执行顺序是啥呢？让我们来分析分析：  
```js
var arr = [1, 2, 3, 'a', 'b', 'c']
function init () {
  console.log('定时器设置 ---> 被执行')
  return 0
}
function flag (i) {
  console.log('循环条件判断 ---> 被执行,当前i :' + i)
  return i < arr.length
}
function add (i) {
  console.log('步长加一 ---> 被执行,当前i :' + i)
  return ++i
}
let i
for (i = init(); flag(i); i = add(i)) {
  console.log('循环代码 ---> 被执行')
  console.log(i, arr[i])
}
```
结果：
```js
定时器设置 ---> 被执行
循环条件判断 ---> 被执行,当前i :0
循环代码 ---> 被执行
0 1
步长加一 ---> 被执行,当前i :0
循环条件判断 ---> 被执行,当前i :1
循环代码 ---> 被执行
1 2
步长加一 ---> 被执行,当前i :1
循环条件判断 ---> 被执行,当前i :2
循环代码 ---> 被执行
2 3
步长加一 ---> 被执行,当前i :2
循环条件判断 ---> 被执行,当前i :3
循环代码 ---> 被执行
3 a
步长加一 ---> 被执行,当前i :3
循环条件判断 ---> 被执行,当前i :4
循环代码 ---> 被执行
4 b
步长加一 ---> 被执行,当前i :4
循环条件判断 ---> 被执行,当前i :5
循环代码 ---> 被执行
5 c
步长加一 ---> 被执行,当前i :5
循环条件判断 ---> 被执行,当前i :6
```
执行顺序很明显：  
1. `初始化计数器`表达式 只在循环的开始执行一次
2. `条件判断`表达式 随后开始执行，如为真则执行 `循环内部代码`；如为假则跳到循环末尾结束循环
3. `步长策略`表达式 在 `循环内部代码` 执行后执行（也就是每一个完整循环的最后一步），`定时器`变量值 增加/减少
4. 重复执行`2`和`3`

`for`可以设置多个计数器，条件用"&&"、"||"：  
```js
for (let i = 0, j = 1; i < arr.length && j < 3; i++, j++) {
  console.log(i, j, arr[i])
}
/*
0 1 1
1 2 2
*/
```
真的就完了么？我们来看下`for`循环不同写法的性能区别：  
测试结果：[for vs forEach vs while](https://jsperf.com/for-vs-foreach/66)
```js
var i, values = [],
      sum = 0;
  for (i = 0; i < 10000; i++) {
    values[i] = i;
  }

  function add(val) {
    sum += val;
  }

for (var i = 0; i < values.length; ++i) {
  add(values[i]);
}
```
我总结出以下几条经验：  
1. 循环条件在计数器初始化前缓存（将数组长度值赋值给变量）性能更佳
```js
for (var i = 0, len = values.length; i < len; i++) {
  add(values[i]);
}
```
> [原理](https://v8project.blogspot.com/2017/09/elements-kinds-in-v8.html)：  
数组是一个特殊的对象,`length`属性被调用时在内部会进行一次属性查询计算；预先取出来可以减少这种计算；且如果循环内部对数组进行了增值操作那将陷入死循环。
2. 步长策略尽量使用`++i`而不是`i++`，速度也能获得小提升
```js
for (var i = 0, len = values.length; i < len; ++i) {
  add(values[i]);
}
```
> [原理](https://blog.csdn.net/liuwp5/article/details/107132589/)：    
`i++`申请一个临时变量保存`i`，进行后续计算，再执行自增。  
`++i`先自增，再进行后续计算，无需申请内存。
3. 通过`--`减少变量提升速度
```js
for (i = values.length; i--;) {
  add(values[i])
}
```
> [原理]()：倒序循环通过再次减少变量和减少代码进行优化 ---> `i`获得数组长度，判断条件判断布尔值再减一，故内部代码获得的是`-1`的，判断代码的是没减前的值。

注意：以上经验主要在大数据情况下有用，正常情况下区别并不大哦，而且其实`V8`引擎新版本内部已经对此进行过优化，差别并不会很大（在目前火狐和苹果浏览器上会有略微提升）

在谷歌浏览器上貌似`for`耗时比`while`更短 [2020年] 

更多：[JS数组循环的性能和效率分析（for、while、forEach、map、for of）](https://juejin.im/post/5b645f536fb9a04fc9376882#heading-5)
## for(...in...)：适用于对象取属性
`for...in...`是目前循环里速度最慢的，但是它能方便快捷地[以任意顺序遍历一个对象的除Symbol以外的可枚举属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)。

简单来说：`for...in`就是为遍历 属性为可迭代字符串的对象 所设计的！
如果想遍历的对象`key`为字符串，用它就对了。

语法：  
```js
for (variable in object){
  //statement
}
```
参数：
* `variable`：在每次迭代中，将不同属性名分配给变量。
* `iterable`：被迭代枚举其属性的对象

注意：  
* `for...in`遍历对象包括其原型链属性，故需配合`object.hasOwnproperty()`来判断是否是自身属性来使用
* `for...in`不适合遍历数组，因为数组的索引顺序非常重要（`for...in`遍历顺序不是非常可靠的），且容易遍历到原型属性或者其他属性。
```js
const arr = [1, 2, 3, 4]
Array.prototype.testName = '原型上的值'
arr.name = 666
arr[5] = 777
let index
for (index in arr) {
  console.log('arr[' + index + '] = ' + arr[index])
}
console.log(arr)
/*
arr[0] = 1
arr[1] = 2
arr[2] = 3
arr[3] = 4
arr[5] = 777
arr[name] = 666
arr[testName] = 原型上的值
[ 1, 2, 3, 4, <1 empty item>, 777, name: 666 ]
*/
```
* 我们可以发现，通过`for...in`遍历了`Array`数组，我们需要操心是否原型对象属性有可枚举方法需要我们去除（相比之下，`for`、`forEach`、`for...of`不需要我们操心这个）
* `Array` 在 `Javascript` 中是一个特殊对象， `Array` 的索引其实是字符串形式的属性名。看起来和其他语言的数组类型差不多，其实本质并不是数组（还是个对象）
* `for...in` 只能遍历`可枚举的属性`，数组原型上的 `length` 等属性和方法属于不可枚举属性
* `for...in` 遍历顺序 和 我们数组元素 的实际顺序结果不一致。
* `for...in` 会跳过稀疏元素。

常用对象遍历：
```js
var triangle = { a: 1, b: 2, c: 3 }
function ColoredTriangle () {
  this.color = 'red'
}
ColoredTriangle.prototype = triangle
var obj = new ColoredTriangle()
for (var prop in obj) {
  // 通过判断是否是自身属性来去除原型链的属性
  if (Object.prototype.hasOwnProperty.call(obj, prop)) {
    console.log(`obj.${prop} = ${obj[prop]}`)
  }
}
```
`for...in`遍历对象属性正是其出现的原因！
## forEach()：迭代循环，不可中止跳过
`forEach`内部会 通过`call`切换上下文，运行回调函数，拆除回调调用 导致速度会比`for`慢一点；但如果强调的是 遍历每个属性且中途不会中止、跳出 ，这个原型方法还是非常好用的。

语法
```js
arr.forEach(callback(currentValue [, index [, array]])[, thisArg])
```
参数:
* `callback`:为数组中每个元素执行的函数，该函数接收一至三个参数：  
> * `currentValue`：数组中正在处理的当前元素。
> * `index`：数组中正在处理的当前元素的索引。
> * `array`：`forEach()` 方法正在操作的数组。
* `thisArg`：可选参数。当执行回调函数 `callback` 时，用作 `this` 的值。如果省略了 `thisArg` 参数，或者其值为 `null` 或 `undefined`，`this` 则指向全局对象。
> 注意：如果使用`箭头函数`表达式来传入函数参数， `thisArg` 参数会被忽略，因为`箭头函数`在词法上绑定了 `this` 值。

 `forEach()` 方法按升序为数组中含有效值的每一项执行一次 `callback` 函数，那些已删除或者未初始化的项将被跳过（例如在稀疏数组上）。

注意：  
* 除了抛出异常以外，没有办法中止或跳出 `forEach()` 循环。如果你需要中止或跳出循环，`forEach()` 方法不是应当使用的工具。
* `forEach()` 不会在迭代之前创建数组的副本。如果数组在迭代时被修改了，则当前处于被删除位置的其他元素会被跳过。
```js
var words = ['one', 'two', 'three', 'four'];
words.forEach(function(word) {
  console.log(word);// 遍历到two（位置为1）时，two被删除，three跑到原来two的位置1，这时候遍历还是按下一个位置2来寻找，这时候已经是four，于是three被跳过
  if (word === 'two') {
    words.shift();
  }
});
// one
// two
// four
// console.log(word); 放在 if(...){} 效果一致
```
> `forEach()` 遍历的范围在第一次调用 `callback` 前就会确定。调用 `forEach` 后添加到数组中的项不会被 `callback` 访问到。如果已经存在的值被改变，则传递给 `callback` 的值是 `forEach()` 遍历到他们那一刻的值。已删除的项不会被遍历到。
```js
var words = ['one', 'two', 'three', 'four']
words.forEach(function (word) {
  console.log('删除前：')
  console.log(arguments)
  if (word === 'two') {
    words.shift()
  }
  console.log('删除后：')
  console.log(arguments)
  words.push('test' + arguments[1])
})// 还是只遍历三次，即使外部words已经变成六元素（删了一个，增加了三个）
/*
删除前：
[Arguments] {
  '0': 'test0',
  '1': 3,
  '2': [ 'two', 'three', 'four', 'test0', 'test1', 'test2' ]
}
删除后：
[Arguments] {
  '0': 'test0',
  '1': 3,
  '2': [ 'two', 'three', 'four', 'test0', 'test1', 'test2' ]
}
*/
```
>> 简单来说：增加不管，删除有效
* `forEach()`没有返回值，即使回调函数`return`也无法接收到，只能得到`undefined`
```js
const arraySparse = [1, 3,, 7]
let numCallbackRuns = 0

const result = arraySparse.forEach(function (element) {
  console.log(this)//当前回调函数内部this指针为window或者global，如需修改可传入第二个参数对象，如arraySparse
  console.log(element)
  numCallbackRuns++
  return 1
})
console.log(result)// undefined
console.log('numCallbackRuns: ', numCallbackRuns)//numCallbackRuns:  3
```
常见用法：
```js
let arr = ['apple', 'orange']
    arr.forEach((item, index, arr) => {
      console.log('元素:' item);
      console.log('下标': index);
      console.log('数组': arr);
    }); 
```
摘自：[JS常用的几种遍历方式for , for...in, for...of, map, forEach性能及差异。](https://juejin.im/post/5ea6454d6fb9a03c7e2035b4#heading-8)

`forEach`适用于数组等可迭代对象，[查询速度快](https://blog.csdn.net/weixin_42714245/article/details/81082074)，缺点也致命：无法终止跳过某个循环；虽然不支持链式调用但能让人一眼看出来在做遍历
## for(...of...)：方便取可迭代对象值
ES6语法，用法简单，取值方便，性能较好（相对于`for...in`），能够中止/跳出。

`for...of`支持遍历[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/iterable)（包括 `Array`，`Map`，`Set`，`String`，`TypedArray`，`arguments` 对象等等）
> 为了统一集合类型，ES6标准引入了新的`iterable`类型，也就是 [可迭代对象](递归与遍历的区别和检测.md)

基本语法：
```js
for (variable of iterable) {
    //statements
}
```
参数：
* `variable`：在每次迭代中，将不同属性的值分配给变量。
* `iterable`：被迭代枚举其属性的对象。

优点：
* `for...of`只遍历可迭代对象自身属性
* `for...of`支持`break`、`continue`和`return`语句
* `for...of`直接获取属性值而不是属性，语法更加简洁。
```js
const arr = [1, 2, 3, 4]
Array.prototype.testName = '原型上的值'
arr.name = 666
arr[5] = 777
arr[undefined] = 'undefined'
arr.null = 'null'
arr[''] = ''
for (const value of arr) {
  console.log(value)
}
/*
1
2
3
4
undefined
777
*/
```
我们发现：`for of`遍历会跳过属性名为`undefined`、`null`、`''`的属性

如果我们就是想遍历`for of`怎么办呢？那就只能曲线救国了：  
```js
const obj = {
  name: 'trump',
  age: 18
}
for (const value of Reflect.ownKeys(obj)) {
  console.log(value, obj[value])
}
/*
name trump
age 18
*/
```
同理，我们想同时获得对象属性与属性值呢？
```js
const myArr = ['hello', 'world', 'trum', 'jianguo']
for (const [idx, value] of myArr.entries()) {
  console.log(idx, '=', value)
}
```
## map方法：数组转换
`map()`遍历数组元素，通过传入的回调函数进行元素处理转化，然后返回一个新数组。

语法：
```js
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array 
}[, thisArg])
```
参数：  
* `callback`：生成新数组元素的函数，使用三个参数：
> * `currentValue`：`callback` 数组中正在处理的当前元素。

> * `index`：`callback` 数组中正在处理的当前元素的索引；可选。

> * `array`：`map` 方法调用的数组；可选。
* `thisArg`：
执行 `callback` 函数时值被用作`this`；可选。

返回值：
* 一个由原数组每个元素执行回调函数的结果组成的新数组。

注意： 
* `map`诞生是为了 **生成一个新数组**，当你不打算使用返回的新数组却使用`map`是违背设计初衷的，请用`forEach`或者`for-of`替代。

* `map` 不修改调用它的原数组本身（当然可以在 callback 执行时改变原数组）

* 根据规范中定义的算法，如果被`map`调用的数组是离散的，新数组将也是离散的保持相同的索引为空。

常用：  
```js
var numbers = [1, 4, 9];
var doubles = numbers.map(num => num * 2);
// doubles数组的值为： [2, 8, 18]
// numbers数组未被修改： [1, 4, 9]
```
直接传入函数名使用：
```js
var numbers = [1, 4, 9]
var roots = numbers.map(Math.sqrt)// 有没有看懂这个开平方用法？很好理解的，看下面
console.log(roots)// [ 1, 2, 3 ]
// 如果我们也定义个方法，让我们回想一下map的参数是什么？
function add (num) {
  return ++num
}
roots = numbers.map(add)
/*等同于：
roots = numbers.map(function add (num) {
  return ++num
})
*/
console.log(roots)// [2, 5, 10]
```
取`ASCII码`：
```js
var map = Array.prototype.map
var a = map.call("Hello World", function(x) { 
  return x.charCodeAt(0); 
})
```
> 请记住：数组原型上的方法虽然通常传递一个参数也可用，但函数内部`arguaments`打印出来你会发现依旧拥有三个参数，因此如果你在`map`等方法传入的回调函数可接收多个值，你就必须判断后面参数是否有影响！
## filter方法：数组过滤筛选
`filter()`遍历数组元素，通过传入的回调函数进行元素筛选，然后返回一个新数组（通过函数测试的元素集合）。

语法：
```js
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```
参数：同`map`
> 不复制官方说明了，感觉好累。。。

返回值：  
* 一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。

`filter` 为数组中的每个元素调用一次 `callback` 函数，所有在 `callback` 函数里返回 `true` 或等价于 `true` 的值的元素会创建一个新数组并返回这个数组。

常见用法：
```js
const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
const result = words.filter(word => word.length > 6);// 筛选出长度大于6的数组元素
console.log(result);// ["exuberant", "destruction", "present"]
```
调用用法：
```js
function isBigEnough(element) {
  return element >= 10;
}
var filtered = [12, 5, 8, 130, 44].filter(isBigEnough);//筛选出大于10的元素
// filtered is [12, 130, 44] 
```
## reduce方法：数组计算
`reduce()`遍历数组元素，通过传入的回调函数对每个元素升序（从左到右）执行计算，然后返回一个最终结果。
> 通常用来做累加器。  

语法：
```js
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```
参数：
* `callback`：回调函数，接收四个参数：
> * `accumulator`：累计器；累计回调的返回值; 它是上一次调用回调时返回的累积值，或`initialValue`
> * `currentValue`：当前值；数组当前处理的元素
> * `index`：当前索引；数组中正在处理的当前元素的索引。 如果提供了`initialValue`，则起始索引号为0，否则从索引1起始。
> * `array`：数组；调用`reduce()`的数组`arr`
* `initialValue`：作为第一次调用 `callback`函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 `reduce` 将报错。

返回值：
* 函数累计处理的结果

分析：  
重要参数就三个：累加器`accumulator`、当前值`currentValue`、初始值`initialValue`
* 未提供初始值时，累加器为数组第一个元素，当前值为第二个参数
* 提供初始值时，累加器值为初始值，当前值为第一个元素。
> 如果数组为空且没有提供`initialValue`，会抛出`TypeError` 。如果数组仅有一个元素（无论位置如何）并且没有提供`initialValue`， 或者有提供`initialValue`但是数组为空，那么此唯一值将被返回并且`callback`不会被执行。

忽略初始值的流程：
```js
const arr = [1, 2, 3, 4, 5]
const arrResult = arr.reduce(
  (accumulator, currentValue) => {
    return accumulator + currentValue
  }
)
console.log(arrResult)
```
**流程**：
1. `accumulator` = 1，`currentValue` = 2，当前结果：1 + 2 = 3 ---> 第一次结束，当前累加器 `accumulator` 值为 3
2. `accumulator` = 3，`currentValue` = 3，当前结果：3 + 3 = 6 ---> 第一次结束，当前累加器 `accumulator` 值为 6
3. `accumulator` = 6，`currentValue` = 4，当前结果：6 + 4 = 10 ---> 第一次结束，当前累加器 `accumulator` 值为 10
4. `accumulator` = 10，`currentValue` = 5，当前结果：10 + 5 = 15 ---> 第一次结束，当前累加器 `accumulator` 值为 15
5. 执行完毕，结果为：15

给与 初始值 的流程：
```js
const arr = [1, 2, 3, 4, 5]
const arrResult = arr.reduce(
  (accumulator, currentValue) => {
    return accumulator + currentValue
  }, 1
)
console.log(arrResult)
```
**流程**：
1. `initialValue` = 1，`accumulator` = `initialValue` ，`currentValue` = 1，当前结果：1 + 0 = 1 ---> 第一次结束，当前累加器 `accumulator` 值为 1
2. `accumulator` = 1，`currentValue` = 2，当前结果：1 + 2 = 3 ---> 第一次结束，当前累加器 `accumulator` 值为 3
3. `accumulator` = 3，`currentValue` = 3，当前结果：3 + 3 = 6 ---> 第一次结束，当前累加器 `accumulator` 值为 6
4. `accumulator` = 6，`currentValue` = 4，当前结果：6 + 4 = 10 ---> 第一次结束，当前累加器 `accumulator` 值为 10
5. `accumulator` = 10，`currentValue` = 5，当前结果：10 + 5 = 15 ---> 第一次结束，当前累加器 `accumulator` 值为 15
6. 执行完毕，结果为：15

将二维数组转化为一维：
```js
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
  function(a, b) {
    return a.concat(b);
  },[]
);
// flattened is [0, 1, 2, 3, 4, 5]
```
计算数组内每个元素出现次数：
```js
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
var countedNames = names.reduce(function (allNames, name) { 
  if (name in allNames) {
    allNames[name]++;//如果元素存在则加一
  }
  else {
    allNames[name] = 1;//如果元素不存在新增该属性并将值设置为一
  }
  return allNames;
}, {});
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```
## 更多数组方法
更多：
* [你还在用for循环大法麽？](https://shimo.im/doc/VXqv2bxTlOUiJJqO/)
* [你还在用for循环大法麽？](https://shimo.im/doc/VXqv2bxTlOUiJJqO/)
## 循环控制语句
```js
function test () {
  const arr = ['apple', 'orange', 'banala', 'xiaomi', 'lastTest']
  let flag = false
  for (const v of arr) {
    console.log('外循环：' + v)
    if (v === 'apple') {
      continue// 跳出当前的循环，并不会终止;
    }
    for (;true;) {
      console.log('内循环：' + flag)
      if (!flag) {
        break// 用于跳出当前的循环，如果for循环中嵌套了for循环嵌套的外层循环将会继续执行
      }
      if (flag) {
        return false// 终止循环 即使嵌套循环也没用，有多少个循环都给你跳到最后一行
      }
      console.log('内循环一次完毕：' + flag)
    }
    flag = !flag
    console.log('外循环一次完毕：' + v)
  }
  console.log('函数内全部循环结束')
}
test()
console.log('函数外代码被执行')
```
结果：
```js
外循环：apple
外循环：orange
内循环：false
外循环一次完毕：orange
外循环：banala
内循环：true
函数外代码被执行
```
分析过程：
* 首先，`v`值为`apple`，这时外部循环被`continue`跳过本次循环，故后面代码不执行
* 其次，`v`值为`orange`，这时外部循环前部分代码正常执行，进入内循环，因为`flag`为`false`，内部循环执行`break`中断当前循环，内部循环被结束，跳到内部循环后面一行代码，将`flag`设置为`true`，外部循环被完整执行一次
* 于是，`v`值为`banala`，执行到内部代码触发`return`，导致当前嵌套循环全部终止，直接跳到函数外，执行函数后面的代码。

总结：  
* `continue`跳过本次循环后面代码，开始下一轮循环
* `break`跳出当前循环体，外部循环正常执行
* `return`跳出全部循环，整个函数作用域结束，执行函数外下一行代码
## 总结
|方法|代码示例|优点|缺点|适用场景|
|:-:|:-:|:-:|:-:|:-:|
|`for`|`for(let i = 0;i< 3;i++){...}`|灵活通用|代码较多，不够优雅|能灵活掌握，自定义度高的场合|
|`for in`|`for(let key in object){console.log(key)}`|遍历对象可枚举字符串属性方便，还能获取到原型属性|原型属性带来额外性能消耗，还会干扰结果；遍历结果顺序不可控|遍历对象属性或者对原型属性也想展示|
|`for of`|`for(let value of iterable){console.log(value)}`|支持所有可迭代对象，直接获取属性值|不适合遍历对象；IE老版兼容性较差|遍历可迭代对象定义的要迭代的数据|
|`forEach`|`[1,2,3].forEach(item => {console.log(item)})`|简单直观，数组遍历推荐|不支持中止循环|数组遍历切不需要跳出/中断;无返回值|
|`map`|`console.log([1, 2, 3].map(num => num * 2))`|简单直观，数据转换修改推荐|不支持中止循环|数组数据快速转换修改；返回修改后的数组|
|`reduce`|`console.log(['spray', 'limitTime'].filter(word => word.length > 6))`|简单直观，获取一个结果值方便|不支持中止循环|如想对数组数据进行快速统计计算推荐该方法|
## 参考
* [JS中3种风格的For循环有什么异同？](https://www.cnblogs.com/powertoolsteam/p/3type-forloop.html)