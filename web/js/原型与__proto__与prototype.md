# 原型与原型对象
## 原型
是不是还傻傻分不清`__proto__`和`prototype`？

`__proto__`（隐式原型）：对象有一个`[[prototype]]`属性，在标准中，这是一个隐藏属性。该属性指向的是这个对象的原型。  
> ES5之前没有标准的方法访问这个内置属性，大多数浏览器支持通过`__proto__`来访问。  

> ES5开始有了对于这个内置属性标准的Get方法：`Object.getPrototypeOf()` 

`prototype`（显式原型）：每一个函数在创建之后都拥有一个名为`prototype`的属性，这个属性指向函数的原型对象。
> 注意：通过`Function.prototype.bind`方法构造出来的函数是个例外，它没有`prototype`属性。

简单来说：  
1. `JavaScript`对象都有自己的隐式原型`[[prototype]]`，该属性在之前是没有官方标准的方法，大部分浏览器自身实现对象以`__proto__`属性名可获取自己原型对象，后来标准推出了`Obejct.getPrototypeof()`方法来获取对象原型（`__protp__`指向的对象）
```js
function Foo () {
  this.name = 'trump'
}
var f1 = new Foo()
console.log(f1.__proto__)//对象的原型对象
/***
{
  constructor:ƒ Foo(),
  __proto__:Object
}
***/
```
2. `Function`函数对象作为一等公民，自然与众不同，它除了`[[prototype]]`隐式原型属性外，还拥有`prototype`显示原型属性，通过`Function.prototype`获得该函数的原型对象
> 函数也是一个对象，它的`[[prototype]]`指向谁呢？
> * 指向该函数的构造函数的原型对象 ---> 一个函数的构造函数：`Function`，所以函数的`[[prototype]]`就是`Function.prototype`
> * 那`Function.prototype`也就是JS里的`Function`函数原型对象的`[[prototype]]`隐式原型对象指向谁呢？答：`Object.prototype` - JS对象公共属性与方法的原型对象最顶层（注意：这里说了前提：*共享方法* 的原型对象最顶层，原型的最顶层是`null`空对象，但是`null`很明显是没有方法与属性的）

> * **注意**：  

> * 1. 只要是对象，如果你找不到构建函数，那么就是由 Object() 这个构造函数创建  
* >> 所有的内建对象都是由Object()创建而来。
> * 2. 原型对象是对象，故`Function.prototype`这个对象之后就只有`[[prototype]]`隐式原型属性。
```js
console.log(Foo.prototype)//函数的原型对象
/**
{
  constructor:ƒ Foo(),
  __proto__:Object
}
**/
Foo.__proto__ === Function.prototype// true
Foo.prototype.__proto__ === Object.prototype// true
```
3. 原型对象是什么？实例对象的原型对象就是其构造函数的原型对象，`JavaScript`的继承机制就是基于原型，原型对象是该实例对象的父类/基类/超类
* > 原型对象最少含有两个属性：`[[prototype]]` 与 `constructor`
* > `[[prototype]]` 用于指向父类（原型对象），`constructor` 用于指回原构造函数
```js
function Foo () {
  this.name = 'trump'
}
var f1 = new Foo()
console.log(Foo.prototype === f1.__proto__)//  true
console.log(f1.__proto__.constructor)
/**
ƒ Foo() {
  this.name = 'trump'
}
**/
```
4. 原型对象的作用：
* > 所有同一构造函数创建的对象实例拥有共同的属性与方法  
（例如JS一切属性都有`length`属性 --- 因为其在`Object.prototype`里）
* > `[[prototype]]`构成原型链，`prototype`实现基于原型的继承与属性的共享。
```js
function Foo () {
  this.name = 'trump'
}
Foo.prototype.age = 18
Foo.prototype.say = function () {
  console.log('myName is ' + this.name + ', myAge is ' + this.age)
}
var f1 = new Foo()
var f2 = new Foo()
console.log(f1, f2)//Foo { name: 'trump' } Foo { name: 'trump' }
console.log(f1.__proto__ === f2.__proto__)//true
f1.say()//myName is trump, myAge is 18
f2.say()//myName is trump, myAge is 18
```
原型图示例：由 [doris](http://zhihu.com) 绘制
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200710105708.jpg)

我们最后来通俗总结下：  
1. 有一个小孩`foo`对象实例张三，其父亲为`[[prototype]]`隐式原型对象。
2. `foo`张三 从`new`出生开始，`[[prototype]]`父亲给与张三 他的 `属性`姓氏和财产，并传授`方法`家传绝技
3. 有一天他问父亲为什么母亲是他父亲的老婆？父亲告诉他，夫妻之间是有结婚证的，通过结婚证（属性）可以看到，`[[prototype]]`父亲的 合法夫妻关系`constructor`属性 指向的是 `constructor`构造函数Foo，所以`foo`张三其母亲为`constructor`构造函数Foo，，而母亲Foo的丈夫`prototype`就是`[[prototype]]`父亲
4. `constructor`母亲感觉 `foo`张三 太皮蛋，要求自己的丈夫 `prototype` 教会 `foo`张三  `新方法` 礼貌并写入家规，让以后的儿女都必须知礼，从此  `foo`张三 见人会礼貌的打招呼 `方法调用`
5. `foo`张三 上学了，教育局办理学籍档案时，通过 `foo`张三 能找到 他的 `[[prototype]]`父亲 和 `constructor`母亲，并能通过父母信息继续找到他们的家族谱
6. `foo`张三 眼睛浅棕色，他去问 `[[prototype]]`父亲，父亲告诉他这是他爸爸的爸爸（爷爷）遗传给他的，而他爷爷又是他爷爷的爸爸遗传给他的。。。。。。，最后 张三明白了他们家族的 浅棕色眼眸 都是 老祖宗 `Object.prototype` 遗传给他们的，至于老祖宗哪来的？张三后来学过生物，明白是从不是人的生物`null`进化过来的
7. 张三 有一天发现个问题：自己明明是`constructor`母亲生的，但是却没有`constructor`私有属性来指向自己母亲。如果想寻找自己的母亲`构造函数`，身份信息查询系统通过`[[prototype]]`父亲的`constructor`妻子属性 找到的，可是俺张三是学过英语的，`constructor`不就是母亲的意思么，为什么在父亲那是`constructor`妻子关系，而不是在我档案里弄个`constructor`母亲关系呢？
8. 这里我们需要明白：**`JavaScript`世界的繁衍`继承`是基于家族谱`原型链`繁衍`继承`的**；张三 寻找自己的`constructor`构造函数母亲，其是通过父亲`[[prototype]]`原型对象来调用原型对象的`constructor`属性，如果原型的`constructor`属性不指向`constructor`构造函数，而是指向自己的构造函数，那么岂不是每个对象的`construtor`属性通过原型链去查找最后都指向`Object`构造函数了？
9. 所以，儿子的母亲构造函数 就是 老爹的妻子`constructor`属性 ，这也就说得过去了！
10. end...

图示总结：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200712125621.png)

相关文章：  
* [js中__proto__和prototype的区别和关系？](https://www.zhihu.com/question/34183746)
* [一文读懂JS中类、原型和继承](https://juejin.im/post/5e95db9ee51d4546d635868e)
* [彻底搞懂js里的__proto__和prototype到底有什么区别？](https://segmentfault.com/a/1190000016024573)
* [彻底理解JavaScript原型链（一）—__proto__的默认指向](https://www.jianshu.com/p/686b61c4a43d)
* [prototype和__proto__ ](https://www.jianshu.com/p/3d756c5bba16)
* [Object.prototype.__proto__ - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)
* [Object.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)
* [JavaScript中的类、原型、原型链、继承](https://zhuanlan.zhihu.com/p/99103505)