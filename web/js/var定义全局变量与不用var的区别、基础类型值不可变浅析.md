# 栈、堆与数据类型 与 Var
## 程序与数据
程序运行 难免需要空间来存放程序需要用到的数据，而这往往就需要使用到 栈(stack) 和 堆(heap) 这两个内存空间  

### 栈(stack)
栈 是有结构的（可以看做 数据结构的栈），它有个**原则**：`后进先出-LIFO(last-in first-out)`  
当然，我们不要求 了解得特别深，不然 没法讲完， 只需要 简单知道：栈的基本功能和操作 就可以了。  

栈 的**功能**：  
* 存放 基础数据类型
* > 基本类型有 `Undefined`、`Null`、`Boolean`、`Number` 和`String`。
* > [ES6新增 `Symbol`、ES7新增 `BigInt`](JS基础篇1：数据类型（8种）https://blog.csdn.net/u013592575/article/details/95087953)
* > 这些类型在内存中分别占有固定大小的空间，他们的值保存在栈空间，JS通过按值来访问的。
* 存放 引用类型指向堆数据的地址 也就是 指针  

栈 的**操作**：  
* pop()：出栈  
* push()：入栈/压栈  

注意：  
* 数据只能从栈顶端插入和删除[![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200621165009.png)](https://www.cnblogs.com/fengyepiaoluo/p/4063995.html)
* 栈 知道每个区块的大小，因此`寻址速度`比堆要快
* 栈 可看做 程序运行时作用域（容器/执行上下文）
* > 一个方法执行时，会建立自己的内存栈，在这个方法内定义的变量将会逐个放入这块栈内存里，随着方法的执行结束，这个方法的内存栈也将自然销毁了。因此，所有在方法中定义的变量都是放在栈内存中的；
* **存放在 栈空间 的 数据可以共享**
* > 假设我们同时定义 `int a = 3; int b = 3；`，编译器先处理 `int a = 3`:  
首先它会在栈中创建一个变量为 a 的引用，然后查找有没有字面值为 3 的地址，没找到，就开辟一个存放 3 这个字面值的地址，然后将 a 指向 3 的地址  
接着处理 `int b = 3;`，在创建完 b 的引用变量后，由于在栈中已经有 3 这个字面值，便将 b 直接指向 3 的地址。这样，就出现了 a 与 b 同时均指向 3 的情况  
特别注意的是，这种`字面值的引用与类对象的引用不同`。假定两个类对象的引用同时指向一个对象，如果一个对象引用变量修改了这个对象的内部状态，那么另一个对象引用变量也即刻反映出这个变化  
相反，通过字面值的引用来修改其值，不会导致另一个指向此字面值的引用的值也跟着改变的情况。如上例，我们定义完 a 与 b 的值后，再令 `a=4;`，那么，b 还是等于 3  
因为，在编译器内部遇到 `a=4;` 时，它会重新搜索栈中是否有 4 的字面值，如果没有，开辟一个存放 4 的值 的 新地址空间；如果有了，则直接将 a 指向这个地址。因此 a 值的改变不会影响到 b 的值  

> 如何栈溢出：递归调用方法，随着栈深度的增加，直到内存不够分配，产生栈溢出，报错。
### 堆(heap)
首先，我们明确一个概念：这里的堆 不是 数据结构 里的那个堆！  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200710142708.png)
**堆 主要 用于 存放 引用类型（JS里就是指对象） 的 复杂数据**  
* 常见Object对象：Date()、Array()、Function()、Math()等
* > 不信，可看这篇文章：[js 判断各种数据类型 typeof 几种类型值](https://www.cnblogs.com/chaoyuehedy/p/7885277.html])
* 对象之所以需要放到堆里，因为其大小不定，我们将大小固定的引用放到栈区

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200621182653.jpg)

`一个 引用类型 的变量 ，程序 将 其地址 存入 栈空间中，地址指向的复杂数据存入 堆空间。`  
因此，当两个对象进行比较时，比较的是它们存放在栈空间的地址信息，由于 地址 指向 不同的 堆空间，故两者地址数据不会相等！  

堆内存与栈内存是有区别的：  
* 栈内存运行效率比堆内存高，空间相对推内存来说较小，反之则是堆内存的特点。
* 栈内存存放的局部变量在该方法执行完毕后当即被销毁，而堆里的对象只在不需要使用的情况下才被垃圾回收机制收回。
* > 一个方法定义的变量（包括形参）都放置在栈里，调用方法时会产生一个新的内存栈用于存放方法所需要的变量，因此当方法被执行完毕，该栈内的变量即被销毁；
* > 创建对象相对消耗资源，但相对栈数据的大小和生命周期等限制更加灵活，因此，即使局部方法里创建了一个变量，也不会被轻易回收！
* 所以将构造简单的原始类型值放在栈内存中，将构造复杂的引用类型值放在堆中而不影响栈的效率。

> 如何堆溢出：循环创建对象，通俗点就是不断的new 一个对象（或者包含超大数据的对象）。

### 总结
包装类需要注意：使用`new`关键字创建一个对象，不使用则是变量  
```js
var a = new String('123')
var b = String('123')
var c = '123'
console.log(a==b, a===b, b==c, b===c, a==c, a===c)  
console.log(typeof a,typeof b,typeof c)
```
运行结果：
```js
true false true true true false
object string string
```

**浏览器的全局环境是window作用域**：  
* 浏览器加载界面时 会生成window（全局作用域），全局变量就是window作用域内的“局部”变量
* 而栈内存提供 js自上而下的执行环境（执行栈/作用域）
* 需要用到的基础变量的值，程序都是直接在栈区存储；
* 当栈内存被销毁（方法调用完毕），存储的字面量（局部变量）基本被销毁（所以不要定义多余变量和尽量避免闭包）
* 数据复杂和不确定的引用类型的值，在预处理阶段，程序就放置在堆内存，避免栈溢出
* 程序需要使用引用类型数据的时候，通过栈区数据获得堆区数据的地址来找到对应数据进行使用
* 当前作用域链在查找变量时，会一层一层的往上查找，直到找到为止，如果找到window全局作用域还未找到，就报undefined；
* 基本类型在当前执行环境结束时销毁，而引用类型不会随执行环境结束而一同销毁，它的生命周期取决于垃圾回收机制
* > 低版本IE浏览器  -  引用计数回收机制：只有当所有引用它的变量不存在时这个对象才被垃圾回收机制回收。
* > 现代浏览器  -  标记清除GC算法以及对于它的改进算法

> 注意：  
0. 传统的“堆栈”概念不太适用于JS：JavaScript 属于解释型语言，JavaScript 的执行分为：解释和执行两个阶段
1. JavaScript是基于VM（虚拟机）的语言，我们只需大致了解，无需深刻纠结于堆栈问题（这涉及到JS引擎内部实现，不纠结其实是因为我目前水准不够），我们更应该关注于JS知识等
2. 搜索到的资料大多重复和缺失，以上结论属于个人总结+推论，如有错误，欢迎告知错误处和正确知识 [我总觉得这解释有点问题，如以后了解得更完善，会回来再次修改的]。

> 更多文章：  
* [js中的栈、堆、队列、内存空间](https://www.cnblogs.com/slly/p/10366290.html)
* [js中的堆和栈](https://www.cnblogs.com/cherishnow/p/10901586.html)
* [内存管理-堆栈和堆在哪里？](https://stackoverflow.com/questions/79923/what-and-where-are-the-stack-and-heap?rq=1)
* [js中的堆内存与栈内存](https://zhuanlan.zhihu.com/p/50420357)
* [内存管理-堆栈和堆在哪里？](https://stackoverflow.com/questions/79923/what-and-where-are-the-stack-and-heap)
* [谈谈程序的堆和栈](https://cloud.tencent.com/developer/news/420596)
* [深入理解堆与栈](https://blog.csdn.net/u014608280/article/details/82218079)
* [JavaScript的内存管理](https://juejin.im/post/5e2155cee51d4552455a8878)


## var定义浅析
### 前置知识
1. 在全局作用域中声明的变量、函数都是window对象的属性和方法
```js
var aaa = 1
console.log(window.aaa) // 1
```
2. var定义的全局变量不能通过delete操作符删除
```js
... // 承接上面代码
delete aaa // false
```
3. 访问未声明的变量会抛出错误，但通过window对象查询属性（全局对象），并不报错，只会显示undeined
```js
var newValue = oldValue 
//这里会抛出错误，因为oldValue未定义
// Uncaught ReferenceError: oldValue is not defined at <anonymous>:1:16
var newValue = window.oldValue
//这里不会抛出错误，因为这是一次属性查询
// undefined
```
4. 有些自执行函数里面的变量，想要外部也访问到的话，用window.XX来做
```js
/* eslint-disable semi */
// 注意：自执行函数 就是 匿名函数
var a = 222;
// 常见错误写法：报错--> Uncaught SyntaxError: Unexpected token (
// (function () {
//    console.log(a)
//   }()
// 最常见和实用方法
(function () {
  console.log(a)
})();
// 方法二
+(function () {
  window.b = 2；// node里面没有window,可用global
  console.log(b)
}());
// 方法三
!(function () {
  console.log(b)
}());
```
5. JS代码块无作用域（var），只有function有作用域
```js
if (1) {
  var a = 222
}
console.log(a)// 222
function fn () {
  var b = 222
}
fn()
console.log(b) // ReferenceError: b is not defined
```
6. var声明变量 有 变量提升效用，不用var声明变量没有

匿名函数注意事项：  
* 匿名函数为了让JS解释器能看懂需要加上';' 避免识别为一句代码！
* js引擎在解析js代码的时候，遇到function定义的函数会当做函数声明，然后检查语法错误 --> 两个报错原因：
* > 1. 函数声明必须有函数名，而()前面没有；
* > 2. 函数声明到第二个花括号处[函数代码结尾]，后面的()会被当作分组操作符，从而导致JS解释器误以为这与我们函数无关
* >> 解决办法：在function前面加上一些操作符 --->  ()/+/!等等

### var与window浅析
**背景**：  
* var 我们在日常写JavaScript用得很多
* ES6的const和let 因为浏览器兼容问题，即使我们在项目里使用它们，也往往通过babel将其转换为var的相关代码。

**全局变量与window属性**  
ES5中，一个全局变量的诞生有两种方法：  
```js
var a = '全局变量a'
b = '全局变量b'
function fn () {
  c = '全局变量c'
}
fn()
console.log(a,b,c)// 全局变量a 全局变量b 全局变量c
```
但是，这样看起来var用不用好像差不多？
但其实差异还是蛮多的
* 首先，var有这些特性：变量提升，当前函数作用域生效（函数内使用在该函数作用域内生效-->局部变量）
* 其次，函数里不用window声明等于直接对全局对象某属性赋值，不管在何处（如果没有属性，则就是新增该全局属性）
* 因为浏览器中全局变量/方法都会挂载到window对象里，也就是说：全局变量就是全局属性

按道理我们可以使用`delete 某变量名`来将该属性删除：  
```js
delete a // false
delete b // true
```
但是，结果并不符合我们预期，这是为什么？
* > var声明定义全局变量默认是不可删的，而直接对未定义变量赋值则是可删的
我们可以通过`getOwnPropertyDescriptor(对象，'对象属性')`返回的对象来查看该属性的相关权限

```js
var a = '全局变量a'
b = '全局变量b'
function fn () {
  c = '全局变量c'
}
fn()
console.log(this.a, window.a) // 全局变量a 全局变量a
console.log(this === window,a === this.a,this.a === window.a) // true true true
console.dir(Object.getOwnPropertyDescriptor(window, 'a'))
/** 
 Object:
 configurable: false
 enumerable: true
 value: "全局变量a"
 writable: true
 __proto__: Object
**/
console.dir(Object.getOwnPropertyDescriptor(window, 'b'))
/** 
 Object:
 configurable: true
 enumerable: true
 value: "全局变量b"
 writable: true
 __proto__: Object
**/
```
通过上面尝试，我们知道：
* var定义变量时，默认使用`Object.defineProperty()`这种方法设置`configrable` 属性导致不可删。
* > `configrable 描述属性是否配置，以及可否删除`
* 使用变量时，JS会在当前作用域寻找该变量，如找不到，往上一级作用域寻找，一直到window全局对象寻找是否有该属性

而且，我们可以推断：
> 全局作用域里，this指的就是window！

什么，你不相信？我们来证实一下：
```js
let name = '全局作用域-name'
console.log(name,window.name,this.name)
// 全局作用域-name， ""， ""
```
首先，我们需要知道：  
1. 浏览器中，window对象默认有个`name`全局属性
2. let/const 定义声明的全局变量，并不在window对象里

ES6开始，全局作用域逐渐与window脱钩，因为`var`定义的全局变量有弊端：
> 当var被用于全局作用域时，它会创建一个新的全局变量作为全局对象(浏览器环境中的window对象)的属性。  
这意味着用var 很可能会无意中覆盖一个已经存在的全局变量
```js
// 无法输出window.name值：""
// 报错：ReferenceError: Cannot access 'name' before initialization
console.log(name) // 原因：let/const存在 当前作用域死锁/绑定的特性 ---> 专业术语：临时死区(Temporal Dead Zone)
const aa = 1
let name = 2
console.log(aa, name) // 1 2
// 注意，以下查询有差异：
console.log(window.aa, window.name) // 通过window.xx  来查询属性  ---->  undefined ""
console.log('aa' in window, 'name' in window) // 不信，通过 in 来查询属性  ---->  false true
console.log(window.hasOwnProperty('aa'), window.hasOwnProperty('name')) // 还不信，通过 hasOwnProperty() 来查询属性  ---->  false true
```
通过上面代码，我们可以知晓：  
1. 查询属性方面：  
* `window.x`查询属性 不能用在x的属性值存在，但为 undefined的场景
* `'x' in Obj` 无法区分自身和原型链上的属性
* `hasOwnProperty()` 只查询自身对象是否含有该属性
2. 在全局作用域中使用`let/const`，不会添加为全局对象window的属性,而是创建一个平级全局`Script`作用域。
> 换句话说，用let或const不能覆盖全局变量，而只能遮蔽它。  
> 如果我们想要`区别使用全局变量/全局属性`，我们只需要在前面加上`window.`来区分

**总结**：  
`let/const`定义的全局变量，会在全局作用域内产生一个`[[Scopes]]`作用域，可看作和window平级的全局作用域 --- `块级作用域（Script）`
```js
//类似于创建一个全局的匿名函数，使得其与window分隔开
... window作用域
(function () {
  ...Script/Global作用域
  let a = 1
})()
```
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200701113836.png)
> 实际上，我们认为的`全局作用域`应该是`Script作用域`，`window`作用域更像是`JavaScript`运行的环境，`var`的变量提升使得其全局变量挂载到`window`上

> const这类属于`Declarative Environment Records`，和函数、类一样在单独的存储空间

> var这类，属于`object environment record`，挂载到某个对象上，会沿着原型链去向上查找

参考：  
* [浅谈var和delete](https://juejin.im/post/5df7ad29e51d45581a70a348)
* [Object.defineProperty()  | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
* [块级作用域绑定(临时死区)(var && let && const 的区别和联系)](https://juejin.im/post/5d80fb3751882565721a5816#heading-10)

### Const浅析
> 常量：一个无法进行重新赋值（reassignment）的变量。
* 这个定义表明了常量与值无关的事实。
* 无论常量承载何值，该变量都不能使用其他的值被进行重新赋值。
* 常量 标识的是 无非重新赋值！

如果我们简单将 常量 看作 不可改变 的 值，那可能产生误会的：  
```js
const x = [2]
console.log(x)// [ 2 ]
x[0] = 1
console.log(x)// [ 1 ]
```
当常量值为引用类型的时候，其值是可以改变的。
* 尽管 X 是一个常量，但是 数组 是可变的
* x 指向的数组类型地址确实没变，变的是数组
> const 作为一个表达意图的标识关键字，用来告知阅读你代码的读者该变量不会被重新赋值。  
但是，一旦碰见引用数据类型，这就会对我们造成误导，所以我们尽量少对传入数据进行直接修改，通过拷贝一个副本修改再返回该拷贝更加合理。


**冻结**: 
一种简单廉价的（勉强）将像对象、数组、函数这样的可变的数据转为“不可变数据”的方式：
```js
var x = Object.freeze( [2] );
```
> `Object.freeze(..)` 方法会遍历对象或数组的每个属性/索引，将其设置为只读，因此其也禁止被重新赋值，事实上这和使用 const 声明变量的效果基本一致。  

> `Object.freeze(..)` 还会将属性标记为“不可配置（non-reconfigurable）”，并且使对象或数组本身不可扩展（即不会被添加新属性）。

> `Object.freeze(..)` 提供浅层的、初级的不可变性约束。
> * 如果你希望更深层的不可变约束，那么你得手动遍历整个对象或数组结构来为所有后代成员应用 Object.freeze(..)。
```js
var x = Object.freeze( [ 2, 3, [4, 5] ] );

// 不允许改变：
x[0] = 42;

// oops，仍然允许改变：
x[2][0] = 42;
```

因此，如果我们想确信某个变量为常量，相比于`const`，我们可通过冻结来确保和信赖该常量的不可变！

## 原始值的不可变性 浅析
JavaScript中类型分为两种： 
1. 基本数据类型
* > String字符串、Number数字、Undefined未定义、Boolean布尔、Null空
2. 引用数据类型
* > Array/[]数组对象、Object对象等
```js
var a = 'huansheng'
var b = 10
var c
var d = null
var e = true
console.log(a, b, c, d, e)// huansheng 10 undefined null true
console.log(a.length = 4)// 4 ---> 非严格模式下静默失败，这个很奇怪，'use strict' 严格模式下报错：TypeError: Cannot assign to read only property 'length' of string 'huansheng'
console.log(a.length)// 9
a[5] = '8'
console.log(a[5], a.charAt(5))// 5 5
```
注：
> 当 index 的取值不在 str 的长度范围内时，str[index] 会返回 undefined，而 charAt(index) 则返回空字符串

> str[index] 不兼容 ie6-ie8，charAt(index) 可以兼容，我们推荐它

通过上面代码我们可以发现：  
* JS 会 隐式将 基本数据类型 包装成 对应的包装类（number、string 和 boolean），故可使用length等基本属性
* 基础数据类型新增属性/对属性赋值时，默认忽略/抛弃该操作
* 字符串 能像数组一样通过索引下标获取对应元素，但是其和length一样都只是可读不可修改的，即使进行修改也会默认失败/忽略

**传参区别**
```js
// 引用类型
var a = {
  name: 'trump',
  age: 18
}
function fix (obj) {
  obj.age = 12
}
fix(a)
console.log(a)//{ name: 'trump', age: 18 }
// 基础类型
var a = 1
function fix (num) {
  num = 18
  console.log('num:',num);//num: 18
}
fix(a)
console.log('a:',a)//a: 1
```
> 引用类型传值传递的是地址，基本类型传递的是值

**赋值与不可变解析**：  
> 在 JavaScript 中，基本类型的值是不可变的，这意味着一旦基本类型值被创建就不能被改变
* 注意，我们说的是原始值不可变，而非变量不可变
* 五种基本类型 在 JS 里看起来可变（“boxing”特性），其实是创建了一个新的值将其赋值给变量，而非 改变之前的原始值
```js
1 = 2 // 1,2 是原始值，它们不可变，故不可赋值
var x = 3 // x 是数字类型的变量，不可变的是数字3这个值，非 x
x = 4 // 这是成立的，因为，我们在这改变的是 x 在栈 里 的指向，将 x 指向 4，而不是改变了 3 这个原始值
```

扯得有点远了，目前了解的就这些，如有错误，欢迎指正！

> 推荐文章：
* [值的不可变性 |《你不知道的JS》姊妹篇](https://juejin.im/post/59af907a5188252427260dee)
* [理解JavaScript中的作用域、作用域链和闭包](https://blog.csdn.net/qappleh/article/details/80311443)