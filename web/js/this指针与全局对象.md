# this、全局对象与箭头函数
## this指向

### 面试题
**this与arguments**  
```js
var obj = {
  age: 18,
  func: function (v) {
    v()
    arguments[0]()
  }
}
var age = 16
function tmp () {
  console.log(this.age)
}
obj.func(tmp)// 结果？
```
上面代码的结果是多少呢？  

```js
16
undefined
```
代码分析：  
* `JavaScript`作用为静态作用域，函数当前对象在定义时就已经指定(除非改变this指向)，代码所示的`tmp`函数对象为`window`
* `arguments`是一个对象，通过下标调用可看作`对象.属性`，这时候`this`已经指向`arguments`对象了，而它没有`age`变量，故为`undefined`

类似于这样改变指向：  
```js
var obj = {
  age: 18,
  func: function (v) {
    v()
    this.fun = v//第三步，obj对象此时为：{age: 18, func: ƒ, fun: ƒ}
    this.fun()//第四步，打印：18
  }
}
var age = 16
function tmp () {
  console.log(this)// 第一步，打印：Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
  console.log(this.age)// 第二步，打印：16
}
obj.func(tmp)
```
不信？我们来测试一下：  
```js
var obj = {
  age: 18,
  func: function (v) {
    v()
    arguments[1] = function say () { console.log(this) }//第三步，arguments对象此时为：Arguments [ƒ, 1: ƒ, callee: ƒ, Symbol(Symbol.iterator): ƒ]
    arguments.age = 6//第四步，给arguments对象新增个age属性
    arguments[0]()//第五步，打印：6
    arguments[1]()//第六步，打印：Arguments [ƒ, 1: ƒ, age: 6, callee: ƒ, Symbol(Symbol.iterator): ƒ]
  }
}
var age = 16
function tmp () {
  console.log(this)// 第一步，打印：Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
  console.log(this.age)// 第二步，打印：16
}
obj.func(tmp)
```
注意：`node`里的`this`与浏览器不同，结果会全是`undefined`哦

来自：[【笔试题👋】分享一道有意思的arguments笔试题](https://juejin.im/post/5e733b746fb9a07ca24f7137)
## 参考文章：
this相关：  
* [全面解析 Javascript 的 this](https://zhuanlan.zhihu.com/p/25294187)
nodeJs里的this：  
* [nodejs中this详解](https://www.cnblogs.com/wjcoding/p/11310077.html)

全局对象相关：  
* [什么是 globalThis，为什么要学会使用它？](https://segmentfault.com/a/1190000021472711)
* [ES6顶层对象（window）和global对象](https://blog.csdn.net/Sunday97/article/details/86754340)
* [了解JS中的全局对象window.self和全局作用域](https://www.cnblogs.com/xy2c/p/7501324.html)
* [JavaScript中的global对象，window对象以及document对象的区别和联系](https://www.cnblogs.com/Renyi-Fan/p/8973652.html)