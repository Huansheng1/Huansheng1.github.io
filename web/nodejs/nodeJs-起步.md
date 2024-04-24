# NodeJs第一天

## 获取 `node` 后面的输入参数

通过 `node` 运行 `js` 文件通常我们是这样做的： `node test.js` ；

可是，如果我们想给运行的 `js` 传递参数呢？  
其实 `node` 也是支持该操作，为了实现获取参数的效果，我们需要知道一个对象： `process` ：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201020212503.png)

通过打印 `process.argv` ，我们可用知道：

1. `arfv`存储的是`node进程`接收到参数信息，其类型为一个数组
2. 第一个成员为`node绝对路径`，第二个成员为`当前运行的js文件`

那么，我们如果在运行时传递一个参数呢？

``` 
node demo.js testArg
```

结果：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201020212926.png)

那么，我们要做的非常简单，**只需通过 `process.argv[process.argv.length-1]` 即可读取最后一个参数**

## 持续获取用户输入

通过上面的方式，我们只能在 `js` 文件运行时获取一次就执行结束了，那我们能不能做到 接受用户多次输入（持续交互）

``` js
process.stdin.on('data', e => {
    // e.toString()就能打印出我们的输入结果
    console.log(e.toString())
})
```

运行后终端我们可一直输入：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201020220942.png)

## `CommonJs` 与 `Es6` 模块的规范区别

### 无规范的简单实现

``` js
通过匿名函数来形成作用域， 避免无模块化规范时冲突问题
const moduleA = (function() {
    // xxx代码

    // 想导出给其他文件使用的数据
    return {
        name: 'test'，
        age: 18,
    }
})()
```

``` js
// 其他文件使用时，通过 moduleA.name即可使用了
```

简单实现当然是有缺点的：

1. 人家想使用你导出的东西，必须在文件中查看导出的变量名
2. 所有代码都在一个 立即执行函数里，显得比较丑
3. 没有一个统一的规范，程序员之间形不成统一代码

### `Es6 Module` 规范 - `Js官方模块标准`

1. 在当前目录`创建 package.json`文件，并加入以下字段：

``` json
{
    "type": "module"
}
```

2. 导出：

``` js
const obj = {
    obj: {
        name: 'foo',
        age: 18,
    },
    name: 'fooObj'
}
// 只能暴漏一个成员，这个导出方式特殊一点，其他的都是named export - 命名导出，人家引入时需要知道名字，但这个由导入者自己决定叫啥名字。
export default obj

// export var s = {}
//export var b = {}  (可以暴漏多个成员)

// 强烈注意：这里导出的不是对象，和commonJs不一样，因此你如果使用 属性名 - 属性值的对象键值对方式将会报错，所以，并不是Es6的对象语法糖形式！

// 人家是可用as来给变量起别名的
// export {
//     变量a,
//     变量b as 变量新名字
// }
```

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121124810.png)

还可导入一模块又直接导出：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121125137.png)

3. 导入：

``` js
// 导入export default暴漏的成员
import obj from './test.js';
// import * as foo from './test.js';
// foo.default指向的才和上面的相等

// import {s} from '包名（或者是文件路径）' （导入export 暴漏的成员，名字要一致）
// import {s as foo} from '包名（或者是文件路径）' （但是，别名也是可行的）

console.log(obj)
// { obj: { name: 'foo', age: 18 }, name: 'fooObj' }
```

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121125111.png)

4. `import()`函数：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121130508.png)

**注意**：

1. `Es6`标准规范导入`import {a,b,c} from './xxx.js'`这里的`{}`不是对象，`a,b,c`也不是通过`Es6`语法糖 - 对象解构 来导入的，就单纯只是`ES6 module`的规范！
2. 官方的`import`不是`require`这种函数，且不会自动增加`.js`的文件后缀，在`Vue`项目里可以省略后缀名是因为脚手架采用了`webpack`自动帮我们加的！
3. ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121125712.png)
4. ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121125923.png)

### `CommonJs` 规范 - `NodeJs` 使用

> 如果导入一个没导出的文件，其值将为 `{}`

方式一：** `module.exports` 导出**：

``` js
const obj = {
    obj: {
        name: 'foo',
        age: 18,
    },
    name: 'fooObj'
}
module.exports = obj
```

方式二：** `exports` 导出**：

``` js
const obj = {
    name: 'foo',
    age: 18,
}
exports.obj = obj
exports.name = 'fooObj'
```

** `require` 导入**：

``` js
let obj = require('./test')
console.log(obj)
// { obj: { name: 'foo', age: 18 }, name: 'fooObj' }
```

注意：

* `exports.属性名 = 导出的具体数据`导出的数据挂载在同一个对象里，但支持导出多个数据
* `module.exports = {}`只导出一个数据，如果先后导出两次，则其他文件只能获得最后导出的那次数据
* > `module.exports`导出多个数据就得这样：`module.exports={属性1：属性值，属性2：属性值2}`

#### `exports` 与 `module.exports` 区别与联系

* `exports` 变量与 `exports.属性` 关联对象*：

> 情境一：

``` js
// 导出
const obj = {
    name: 'foo',
    age: 18,
}
exports = {}
exports.obj = obj
exports.name = 'fooObj'
// { obj: { name: 'foo', age: 18 }, name: 'fooObj' }
console.log(exports)
```

``` js
// 导入
let obj = require('./test')
console.log(obj)
// {}
```

> 情境二：

``` js
// 导出
const obj = {
    name: 'foo',
    age: 18,
}
exports.obj = obj
exports.name = 'fooObj'
exports = {}
console.log(exports)
// {}
```

``` js
// 导入
let obj = require('./test')
console.log(obj)
// { obj: { name: 'foo', age: 18 }, name: 'fooObj' }
```

> 思考题：

1. 为什么导出的对象和模块里的对象不一样？
2. 只是在导出的那个文件里稍微跳转了下赋值顺序，为什么结果截然相反？

*为什么 `module.exports` 导出两次，后一次数据会覆盖前一次？*

* `exports.属性` 对上 `module.exports` *：

``` js
// 导出
const obj = {
    obj: {
        name: 'foo',
        age: 18,
    },
    name: 'fooObj'
}
exports.obj = obj
module.exports = {
    test: true
}
console.log(exports)
// { obj: { obj: { name: 'foo', age: 18 }, name: 'fooObj' } }
console.log(module.exports)
// { test: true }
```

``` js
// 导入
let obj = require('./test')
console.log(obj)
// { test: true }
```

> 思考题：

1. 为什么`exports`和`module.exports`对象不一样？
2. 为什么其他文件导入结果是`module.exports`对象数据？

* `module.exports=exports` 操作是在 `js` 开始时还是结尾处？*：

``` js
// a.js
// 如果在开始关联，即
// module.exports = {};
// let exports = module.exports;
exports = 123;
// 那么，exports改为基本类型不影响其引用地址，其他模块导入a.js应该是空对象{}

// 结果当然是{}，所以commonjs实现语法糖是在开始时就完成的
```

**结论**：

* `exports`是`module.exports`的语法糖，或者你可以这样说：`exports`是`module.exports`的别名，其指向`module.exports`对象地址：

``` js
let foo.bar = {};
let bar = foo.bar;
bar.name = 'demo';
// 这里，foo就是module.exports，bar就是exports

// exports.a = a  其实是它缩写--> module.exports.a = a 
```

* `module.exports`之所以后一次会覆盖前一次数据，道理非常简单，因此后一次将其指向了新的对象地址：
* `exports.属性`导出后，再将`exports`赋予别的值，结果内部打印结果与外部导入结果不一样的原因是：后面的赋值将`exports`指向了其他类型的引用地址，而导出的对象其实是`module.exports`指向的对象数据

``` js
let foo.bar = bar;
let bar = foo.bar; // 模拟语法糖
bar.name = 'demo'; // 模拟exports导出
bar.aaa = 'test' // 增加导出数据，模拟 exports.xxx = xxx
bar = {} // 模拟后面的赋值操作，exports = {}
console.log(foo) // 这就是为什么其他地方导入数据和内部打印不一样的原因，因为只是改变了bar的指针，但外面人家导入的是foo啊
```

**总结**：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121002020.png)  

* 本质上，`node`里的`commonJs`规范导入导出的对象是`module.exports`对象，内部通过`exports = module.exports`形式将其导出数据对象地址给了`exports`，但如果通过`module.exports`修改对象地址，那么`exports`数据其他模块就无法读取到了，它们读取到的都是`module.exports`对象值。
* 引用类型的导入导出决定了 其实其他模块导入一个模块是可以反过来修改模块对象里的内容的，但是不要这样干
* 导入模块其实就是导入那文件导出的对象，因此`const {a,b,c} = require('xxx')`语法糖其实就是`es6`的解构赋值 - `const a = require('xxx').a`
* `exports = module.exports`操作是在文件最开始的时候的就先进行的

## 其他小知识

### 获取运行文件路径与目录

``` js
// 获取当前运行js文件的绝对路径
console.log(__filename);
// 获取当前运行js文件的所在目录（绝对路径）
console.log(__dirname);
```

## 定时器

### 常用定时器

``` js
// 如果在Node代码时没有代码提示，则可以通过安装插件的方式解决：
// 1. npm init
// 2. npm install --save-dev @types/node

// 延迟执行
setTimeout(() => {
    console.log('setTimeout');
}, 0)
// 定时执行
const handler = setInterval(() => {
    console.log('setInterval');
    clearInterval(handler);
}, 0)
// 立即执行，不需要加时间
setImmediate(() => {
    console.log('setImmediate');
})
// 下一帧执行
process.nextTick(() => {
    console.log('processs.nextTick');
})

// 执行结果：
// processs.nextTick
// setTimeout
// setInterval
// setImmediate
```

## 模块与单例

> `Node.js` 每个模块在一般情况下都是 `单例` 的

让我们来测试一下：

1. 定义一个测试的模块`mathrandom1`：

``` js
class randomNumber {
    constructor() {
        // 如果创建类会随机赋予一个值，不同对象会有不同的值
        this.ranNum = Math.random()
    }
}
// require引入模块如果会执行多次那么也会打印多个这个
console.log('是对接爱尚件大事');
module.exports = new randomNumber()
```

2. 在`index.js`引入测试：

``` js
const mat1 = require('./mathrandom1');
console.log('mat1.ranNum：', mat1.ranNum);
setTimeout(() => {
    mat1.ranNum = 1.11111;
    console.log('mat1.ranNum1000：', mat1.ranNum);
}, 1000);
const mat2 = require('./mathrandom1');
console.log('mat2.ranNum：', mat2.ranNum);
setTimeout(() => {
    console.log('mat2.ranNum1000：', mat2.ranNum);
}, 3000);
```

3. 测试结果如下：

``` shell
是对接爱尚件大事
mat3.ranNum： 0.677979062043867
mat1.ranNum： 0.677979062043867
mat2.ranNum： 0.677979062043867

mat1.ranNum1000： 1.11111
mat2.ranNum1000： 1.11111
```

`nodejs` 的单例模块大概原理是：根据模块文件路径，记载一次的模块就存在 `cache` 缓存里，下次如果路径相同则直接从缓存里去，而不是重新创建运行。

当然，也有部分特殊情况会导致不是单例：[NodeJS 中的模块是单例的吗？](https://segmentfault.com/a/1190000006912853)
