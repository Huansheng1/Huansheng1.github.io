# `Promise` 入门

## `JavaScript` 引擎

`JavaScript` 是单线程 `single threaded` 的

> 提示：没有引入 `web worker` 之前， `JavaScript` 没有 `线程、进程` 的概念， `JavaScript` 也就是虚拟机，一次只能执行一条语句。

也许你会想，为什么 `JavaScript` 不能是多线程的？

首先，我们知道 单线程意味着同一时间只能做一件事，所有任务必须按照顺序从上到下排成任务队列一个一个来执行。

多线程等于我们可以同时执行几件事（比如一遍吃东西一遍看电视，甚至还能一边泡脚），按道理设计成多线程更有利我们。

`JavaScript` 引擎是依托于浏览器为我们渲染网页服务；如果当前 `JavaScript` 是多线程的，那我们可以同时渲染多个地方，这岂不是非常棒？

表面看确实如此，但是，让我们细想一下：如果多个线程同时修改一个 `Dom` 节点，那我们应该改成什么样呢？很明显，多线程对与 `UI` 界面的展示是困难重重的，。当然，学过其他语言，了解过多线程方面知识的可能会知道：我们可以采用 `锁` 机制啊；当某个线程需要修改 `Dom` 节点时我们就给它加把锁，修改完毕就给它解锁。

可是，我们是不是忘了一个问题： `死锁` 怎么办？ `死锁` 对于多线程来说是一个比较麻烦的问题， `Python` 里为了安全在底层加了一把全局锁 `GIL` 避免死锁难以处理的问题。如果我们人为处理死锁问题，那这会非常麻烦，且不能保证绝对安全。（关于 `线程、进程、死锁` 问题比较复杂，日后再讲）

而且，我们可以先忽略 `死锁` ，看看别的问题。多线程之间同步是有开销的，且面临着同步问题，如果所有的线程都能操作 `ui` ，一旦 `CPU` 发生线程切换，那么网页将可能产生不可忽视的风。例如： `A` 线程 `ui` 界面改了一半， `CPU` 线程切换到 `B` 线程又去改同一处；而界面本质上来说只是操作系统对数据在显示器上的一个映射，各个线程操作的都是数据，这么一来，你改我也改，你还没改完我有改，你改了一半我接着改，那还怎么玩。

所以要支持多线程，必须提供同步工具且线程之间不会彼此发生冲突。如果在 `JavaScript` 中支持多线程，不仅会增加 `JavaScript` 虚拟机的复杂度，也会增加编码的复杂度（程序猿不得不自己处理好同步问题），所以，这才是 `JavaScript` 为什么到现在还是一个主线程的本质原因（先忽略web worker）。

因此，**如果 `JavaScript` 语言设计成多线程，那么不但代码将会大幅复杂化，影响性能，且使用不当存在潜在死锁的问题**。

> 即使是 `Java` 等支持多线程的语言，在处理安卓 `UI` 编程时依旧只支持 `UI` 线程对界面进行操作，其他线程操作界面将会抛出异常报错。

## 同步与异步

> 同步/异步， 它们是消息的通知机制。

### 同步

**同步**，就是在发出一个功能调用时，在没有得到结果之前，该调用就不返回；由“调用者”主动等待这个“调用”的结果，如结果迟迟不返回，后面代码被阻塞，无法往下进行。

> 我们常见的方法的调用大部分是同步，在方法内部调用另外的方法，往往都是在等待方法的处理结果然后获取结果，接着进行后续的处理。

### 异步

**异步**，就是在发出一个功能调用后，不返回任何结果；“调用者”无需等待“调用”结果，继续往后执行；"被调用者"执行完毕后通知“调用者”，或通过回调函数处理这个调用。因此：异步调用发出后，不影响后面代码的执行。

**执行部件和调用者可以通过三种途径返回结果**：
1. 状态

> 调用者和执行者商量一个状态，执行者在执行到不同状态时，去改变那个公共的信号，调用者不停的去看看状态改变没有，然后根据改变执行相应的事情；

2. 通知

> 执行完之后直接通知你去做事情。

3. 回调函数。

> 回调类似状态，通过将 `callback function` 加入到事件队列 `call queue` 中， `JavaScript` 在执行栈执行完毕清空后再检测事件队列，有则压入执行栈进行调用。

开发中比较常用的异步操作有：

* 网络请求，如`ajax`、`axios`、`XMLHttpRequest`
* IO 操作，如`readFile`、`readdir`
* 定时函数，如`setTimeout`、`setInterval`

更多：[搞懂同步、异步，阻塞非阻塞](https://juejin.im/post/5ec1f7386fb9a0432a3c479e)

## 异步的解决方案

> 解决办法如果简单了解会记不住，故暂时不写，日后再补，若需了解请参考：

* [「硬核JS」深入了解异步解决方案](https://isboyjc.top/blog/2020/02/14/javascript/%E3%80%8C%E7%A1%AC%E6%A0%B8JS%E3%80%8D%E6%B7%B1%E5%85%A5%E4%BA%86%E8%A7%A3%E5%BC%82%E6%AD%A5%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/#「硬核-JS」深入了解异步解决方案)
* [前端基本知识（四）：JS的异步模式：1、回调函数；2、事件监听；3、观察者模式；4、promise对象](https://www.cnblogs.com/chengxs/p/6497575.html)
* [JavaScript | 异步处理](https://juejin.im/post/5cd97d75e51d453a69177ecc#heading-7)
* [JS核心理论之《异步API与编程解决方案》](https://juejin.im/post/5ea8f74af265da7b95054cc8#heading-6)
* [细说JS异步发展历程](https://juejin.im/post/5ce40e5ee51d4556be5b39b7#heading-0)

### 回调函数

异步核心原理，就是将 `callback` 作为参数传递给异步执行函数，等准备好之后（异步操作执行完毕）再触发 `callback` 执行

### 事件监听

> 待更新...

### 发布/订阅模式

> 待更新...

### `Promise`

> 待更新...

### `async` 与 `await`

尽管 `promise` 链式调用很好用，但是，如果我们在某个地方需要发送多个请求，且后一个请求需要根据前一个请求返回值进行相应处理，那么，用 `promise` 调用我们依旧会发现比较丑陋：

```js
// 采用回调方式，不推荐：
promise请求1.then(res1 => {
    promise请求2.then(res2 => {
        promise请求3.then(res3 => {
            // ......
            promise请求.then(res => {
                console.log('最终结果')
            })
        })
    })
})

// 链式调用，但依旧丑陋：
promise请求1.then(res1 => promise请求2(res1))
    .then(res2 => promise请求3(res20))
    .then(res3 => {
        /** ...... **/
    })
    .then(res => {
        console.log('最终结果')
    })
```

`async` 和 `await` 为了解决多个异步之间的顺序问题，它采用了同步方式表达异步，可谓是目前 `JavaScript` 处理异步的终极解决方案，且其基于 `Promise` ，能和 `Promise` 比较完美的过渡！

```js
// await 必须和 async 搭配使用

// 定义一个延时函数
async function sleep(time) {
    return await new Promise(async (resolve, reject) => {
        return await setTimeout(() => {
            resolve(time);
        }, time);
    })
}

// 想使用这个函数的延时效果，必须调用处也使用async包裹，因为async函数就是异步调用的，它返回的是一个promise对象
// 在sleep函数内部，await看起来是同步的，因为 使用await的前提是在async函数内部即可
// 在sleep外部，如果不用async包裹，那它就只是个promise包裹的异步函数
// 可以这样理解，async和await就是把这个函数里面的代码改造成了一个promise对象，如果同步就放在then调用，保证顺序一致；但其实其本质也是异步方式，只是这个async函数里你看起来是同步而已，因为被它底层用promise包装了，看起来顺序是对的
async function test() {
    // 通过await保证延时效果生效，因为async函数就是异步调用的，不用await，等于你就只是创建了个promise对象而已，并不会阻塞下面代码的执行
    let j = await sleep(6666);
    console.log('执行完毕：', j);
}
```

> 待更新...

### `Generator`

> 待更新...

### `Web Worker`

现代浏览器里尽管 `JavaScript` 只是个单线程，但它的性能足够大多数业务场景使用，那我们为什么还诞生了 `Web Worker` 呢？

随着电脑性能的发展，还是可能存在极少需求（密集CPU计算避免主线程卡死的场景）需要用到 `Web Worker` ：  
1. 大文件的解析与上传（例如视频）
2. 网站运行情况监控（包括日志处理）。
3. 大型数据解析与处理

当然也会带来部分问题：  
1. 性能损耗
2. 代码复杂化
3. 问题不易定位

> 以后再更....

更多：
* [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)
* [Worker - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker)

## 单线程的 `JavaScript` 如何实现异步操作

`JavaScript` 是单线程的，不支持创建新的线程，那我们的异步操作是怎么实现的？  

> 实现异步依赖的是浏览器的多线程机制。

浏览器是多进程、多线程的 `事件驱动型` 程序, 每次新开一个标签页，浏览器就启动了一个新的页面进程，各进程直接互相独立。当然，浏览器还创建一个GPU进程用于3D绘制和硬件加速（除此之外，浏览器插件运行时都会创建自己独立的进程）

> 每个进程里面最少包括一个线程，线程存在于进程里面。

浏览器内核，也就是浏览器渲染进程，负责一个网页从请求、下载、渲染的全部过程，因此浏览器的多**线程**包含：
* `GUI`界面渲染线程（渲染和绘制页面）
* `JavaScript`引擎线程（运行和渲染JS代码，如`V8`引擎）

> 由于 `JavaScript` 可以操作 `DOM` 从而引发网页界面回流、重绘等影响 `UI` 渲染，因此 `JavaScript` 主线程和 `GUI` 线程是互斥的。

* `Dom`事件触发线程，如：`click`点击事件、`onMouseOver`鼠标失去焦点事件
* 定时触发器线程，如：`setTimeout`、`setInterval`
* 异步`HTTP`网络请求线程等。

> `JavaScript` 引擎以外的线程都是浏览器给我们提供的 `Web Apis`

**为什么浏览器需要提供这些辅助线程**？  

我们需要注意，在日常场景中，有些操作是非常消耗时间或者不立即触发的，比如：网页请求、定时器、事件监听等。

同步阻塞：如果全部由 `JavaScript` 主线程来完成，由于单线程的特点，那么 `JavaScript` 执行效率会非常低，网页大概率出现当前界面假死（等待执行...）或界面白屏、闪屏等大幅降低体验的表现；

异步非阻塞： `JavaScript` 在执行任务时，浏览器作为 `JavaScript` 的宿主环境，通过提供辅助线程，让 `JavaScript` 主线程遇见这些耗时任务就丢给浏览器提供的辅助线程来执行（浏览器开辟了新线程），从而避免主进程卡死的出现；

辅助线程执行完毕后将结果数据通过触发回调函数加入到 `JavaScript` 主线程的事件队列 `callback queue` ， `JavaScript` 主线程再根据事件循环的机制

因此，浏览器多线程环境，使得单线程的 `JavaScript` 达到异步执行的效果，又避免了卡死的出现，何乐而不为呢？

> 为了利用多核 `CPU` 的计算能力， `HTML5` 提出 `Web Worker` 标准，允许 `JavaScript` 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 `DOM` 。所以，这个新标准并没有改变 `JavaScript` 单线程的本质。

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200717175339.png)

因此，我们需要明白，尽管我们打开一个标签页访问页面时，浏览器给这个页面分配了多个线程同时进行准备、渲染、执行工作，但是一个标签页只会分配出一个线程去执行 `JavaScript` 代码（尽管 `JavaScript` 引擎/内核 存在多个线程，但 `JavaScript` 脚本只会在一个主线程执行，其他都是提供的辅助线程），因此 `JavaScript` 在代码执行过程中，一次只能处理一个事情，所以说JS是单线程的。

参考资料：
* [Multithreaded toolkits: A failed dream?](https://community.oracle.com/blogs/kgh/2004/10/19/multithreaded-toolkits-failed-dream)
* [js的单线程和异步](https://www.cnblogs.com/woodyblog/p/6061671.html)
* [javascript既然是单线程语言 ， 为什么会分主线程和消息线程(event loop) ? ](https://www.zhihu.com/question/35905242)
* [JavaScript 运行机制详解：再谈Event Loop - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
* [秒懂JS中的同步/异步编程是什么](https://juejin.im/post/5eb81bb7f265da7bf1691d02)

## `Promise` 解决了什么问题？

### 回调地狱

**回调地狱的出现**：  
回调地狱 `callback hell` ：

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200720170222.jpg)

在 `ES5` 中，当进行多层嵌套回调时，会导致代码层次过多，很难进行维护和二次开发；而且会导致回调地狱的问题。 `ES6` 中的 `Promise` 就可以解决这两个问题。

如果使用 `Promise` 的话：

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200720170316.jpg)

### Promise优缺点

`Promise` 横空出世，它的核心是 `链式调用` 。

它成功避免了回调函数 `callback function` 嵌套多重带来的难以阅读与维护，不再深陷泥潭；
相比于之前的异步回调写法， `Promise` 通过链式调用的优雅写法快速风靡，于是很快民间出身的它被招安了，融入 `ES6` 规范，成为了 `JavaScript` 里的一个标准。

`Promise` 有两层意思：  
1. 顾名思义，`承诺`，`Promise`保证状态不被外界所干扰，这就意味着`Promise`对象一旦状态确定就不能更改  
2. `Promise`对象表示未来将要发生的事情（异步），我们通过`Promise`对象.`then()`来启用异步操作。

> `Promise` 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值.

`Promise` 为什么优雅？用同步的方式写异步代码，非常直观。

**缺点**：  
* `Promise`一旦新建，无法中途取消；
* 如果不在`Promise`内设置回调函数捕获异常，外面无法获得`Promise`的内部错误；
* 处于`pending`状态时，无法得知目前进展（内部执行刚开始还是快结束）。
* `Promise`本质还是`callback function`，只是表现形式改变

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200717173105.png)

## Promise常用语法和API

更多：[使用 Promise - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)

**简单理解**：  

有一天，我从网上下单网购了一件商品，可突然要出差不能到时候去楼下取件怎么办？  

我们打个电话给快递员： `Promise` 先生（以下我们简称：承诺先生），我们与他约定好：如果快递到了，请求他帮我们放在我们家附近到时候我们回来了好去拿。

```js
const p = new Promise((发短信， 打电话) => {
    function 打电话() {
        function 存快递() {
            /*异步代码执行*/
            快递员寻找快递点...
                存放快递...
                快递员得到取件号码
            return 取件号码
            /*异步代码执行完毕*/
        }
        快递运输中...
            if (快递到了) {
                存快递()
            }
    }
    打电话() // 打电话告诉快递员干啥，看作启用一个异步操作
    if (存快递成功)) {
    发短信(取件号码)
} else {
    打电话('通知到出意外情况了')
}
})
```

我们花费的时间仅在我们给承诺先生打电话这件事上 - 打电话通知快递员办事是同步代码，会现在执行（传递给 `Promise` 构造函数的 `executor` ），它需要我放下手头的事给快递员吩咐。

我们请求他帮我们存快递到快递点的那件事是异步 - 快递到了承诺先生放某个小店 就是 传给 `Promise` 执行的异步事件，快递员到附近寻找快递点这件事它不干预我们出差时干的事（异步请求代码），承诺先生在放快递时，我们在正常出差。

承诺先生办完我们吩咐他做的事（异步代码执行完毕）后给我们发短信告诉我们取件号码是多少（ `resolve(取件号码)` ）。

```js
// num 接收到的就是承诺先生告诉我们的取件号码
p.then(取快递(num) {
    //出示取件号码
    console.log('当前取件号码：' + num)
})
```

我们到时候有空了去那个地方拿快递 `.then` 。

> 单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。

### promise语法

基本语法：

```js
new Promise(function(resolve, reject) {
    ...
} /* executor */ );
```

**参数**：  
* 创建`Promise`对象需要传递一个可执行函数`executor function` ---> 简单来说：传入回调函数

> `Promise` 内部构造函数通过调用传入的回调函数来执行当前同步代码，并将回调函数内执行结果返回给创建的 `Promise` 对象

* `executor`函数可传入 两个参数：`resolve`成功回调函数与`reject`失败回调函数。这两个函数在 `executor`函数 内部代码（通常是异步代码）执行完毕后调用。

> `resolve` 和 `reject` 函数被调用时，分别将 `promise` 的状态改为 `fulfilled` （完成）或 `rejected` （失败）。

> 异步代码执行成功后，内部将执行成功结果传入 `resolve` 函数使得 `promise` 对象状态改为 `fulfilled` 并将结果设置为成功值，反之则通过 `reject` 将失败原因传递给 `promise` 对象并将状态设置为 `rejected`

### 创建Promise对象

**经典创建 `promise` 对象**：

```js
/* eslint-disable prefer-promise-reject-errors */
const p = new Promise((resolve, reject) => {
    /* 异步执行代码，比如网络请求 */
    const num = Math.random(0, 1) // 假装这是网络请求
    // 用随机数模拟执行成功时
    if (num > 0.5) {
        resolve('执行成功结果：' + num) // 成功时出修改状态并传入参数
    } else {
        // 失败修改状态为`rejected`并传递失败原因
        reject('执行失败了') // es-lint不推荐我们这么写
        // reject(new Error('执行失败了'))// 正确错误提示
    }
})
p.then(v => console.log('接收成功信息：' + v)) // 接收成功信息：执行成功结果：0.741894589137791
p.catch(e => console.log('捕获错误：' + e)) // 捕获错误：执行失败了 (node:6836) UnhandledPromiseRejectionWarning: 执行失败了 ....
```

* 上面代码，`p`是我们创建通过`new Promise`创建出来的`promise`对象
* 构造函数`Promise`必须接收一个`executor function`，该函数至少传递一个参数`resolve`，不然我们无法设置`promise`对象状态。

```js
const p = new Promise((resolve) => {
    /* 异步执行代码，比如网络请求 */
    const num = Math.random(0, 1)
    // 用随机数模拟执行成功时
    if (num > 0.5) {
        resolve('执行成功结果：' + num)
    } else {
        throw new Error('当然，还是能抛出错误的！')
    }
})
console.log(p) // romise {  <rejected> Error: 当然，还是能抛出错误的！....错误具体描述....
p.then(v => console.log('接收成功信息：' + v)) // 接收成功信息：执行成功结果：0.741894589137791
p.catch(e => console.log('捕获错误：' + e)) // 捕获错误：Error: 当然，还是能抛出错误的！ UnhandledPromiseRejectionWarning: Error: 当然，还是能抛出错误的！....错误具体描述....
```

这样做也是不会报错的，我们还可以通过 `throw` 手动抛出错误来触发异常，从而修改 `promise` 对象状态。

但是，省略 `resolve` 肯定就不行了！为什么？我们的 `promise` 对象状态将永远是 `pending` ， `then` 和 `catch` 都没有用处了，这样 `Promise` 没有任何意义。

> `executor` 函数的返回值被忽略。

**原生网络请求通过 `Promise` 形式调用回调函数**

```js
function myAsyncFunction(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(); // 如果回调函数写在send后面可能发生上个命令的回调函数缓存到下个的情况
    });
};
```

### Promise状态

** `promise` 对象状态**：  
* 初始状态：`pending`

> 注意，如 `executor` 函数 内部既无异常，也没有通过 `resolve` 或者 `reject` 触发，那么 `promise` 对象状态将一直是 `pending`

* 成功状态：`fulfilled` - 操作已完成 ，`executor`函数执行成功后通过`resolve`函数将状态从`pending`初始 改为 `fulfilled`；成功状态被`promise`对象的`.then`方法第一个参数接收

> `then` 方法包含两个参数： `onfulfilled` 和 `onrejected` ，它们都是 `Function` 类型。当 `Promise` 状态为 `fulfilled` 时，调用 `then` 的 `onfulfilled` 方法，当 `Promise` 状态为 `rejected` 时，调用 `then` 的 `onrejected` 方法

* 失败状态：`rejected` - 操作已失败，`executor`函数执行过程中如出现问题通过`reject`函数将状态从`pending`初始 改为 `rejected`操作失败；失败状态被`promise`对象的`.catch`方法或者`.then`方法第二个参数接收

> 注意：如 `executor` 函数 内部出现异常，那么 `promise` 对象状态将自动变为 `rejected` ，异常后面代码不再执行，一路向上抛出，直到被 `catch` 方法捕获。

```js
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('延时调用')
    }, 1000)
})
console.log('当前p: ', p) // 当前p:  Promise {<pending>}
const newP = p.then(v => {
        console.log('当前p: ', p, ', ' + '当前接收的v: ' + v)
    }) //当前p:  Promise {<resolved>: "延时调用"} , 当前接收的v: 延时调用
    .then(v => {
        throw new Error('触发异常')
    }) // 触发异常，也可这样写：  .then(v => Promise.reject('触发异常'))
newP.catch(e => console.log('当前newP: ', newP, ', ' + '当前接收的e: ' + e))
/* Promise {<rejected>: Error: 触发异常
    at p.then.then.v (<anonymous>:6:22)
    at <anonymous>}__proto__: Promise[[PromiseStatus]]: "rejected"[[PromiseValue]]: Error: 触发异常
    at p.then.then.v (<anonymous>:6:22)
    at <anonymous> , 当前接收的e: Error: 触发异常
*/
```

运行流程分析：  
1. 通过`Promise`构造函数创建`promise`对象`p`，创建时定时器已经启动（定时器可看作异步任务）；在`Promise`角度来看，内部代码已经执行完毕代码（构造器传入的回调函数代码都是同步任务从上往下执行）
2. `.then`和`.catch`在`pending`状态无法被调用
3. 一秒后定时器执行完毕，通过`resolve`改变`p`的状态为`fulfilled`，第一个`p.then`于是开始异步执行（异步代码不阻塞同步代码的执行），它接收到的数据为一个`promise`对象（状态是`fulfilled`，值为'延时调用'），打印完毕，因为没返回数据，因此默认返回一个`promise`对象（状态未改变还是`fulfilled`，值为`undefined`）
4. 第二个`.then`接收到第一个`.then`返回的对象，这里的`v`是`undefined`，我们在这里通过`throw`抛出错误触发状态更改为`rejected`，抛出新`promise`对象（状态是`rejected`，值为'触发异常'的异常）

> 千万注意， `.then` 里触发状态更改成失败，必须用 `throw new Error('异常描述')` 或者 `return Promise.reject('异常描述')` 来制造一个失败状态的 `promise` 并返回（抛给）下面。

5. 将`newP`指向`rejected`状态的新`promise`对象，再用`.catch`捕获错误并处理。

注意：  

为什么我们这里使用 `newP` 保存执行后返回的 `promise` 对象，再通过 `.catch` 来捕获？  

因为：链式调用的核心就是前者执行返回对象给后者继续执行，如果我们不用新变量保存抛出异常后产生的新 `promise` 对象，那么， `.catch` 里我们打印不了当前对象， `p` 还是 `Promise {<pending>}`

> `resolved` 是状态确定的意思，既可能是 `fufilled` 也可能是 `rejected` ；将 `pending` 转为 `resolved` 的过程就叫 `resolve` 确定

### Promise.resolve()

除了通过 `new Promise` 创建 `promise` 对象外，我们通过该方法也可以创建 `promise` 对象。

语法：  

```js
Promise.resolve(value) // 返回一个状态由给定`value`决定的`Promise`对象。
```

注意，：  
* 参数是一个 `Promise` 实例

> 如果参数是 `Promise` 实例，那么 `Promise.resolve` 将不做任何修改、原封不动地返回这个实例。

```js
const p = new Promise((res, rej) => {})
const p1 = Promise.resolve(p)
p === p1 // true
```

* 如果参数是一个原始值，或者是一个不具有`then`方法的对象，则`Promise.resolve`方法返回一个新的 `Promise` 对象，状态为`resolved`。

```js
Promise.resolve('Hello')
```

* 参数是一个`thenable`对象，也叫 `Promise like`对象，也就是像`Promise`的对象

> `Promise.resolve` 方法会将这个对象转为 `Promise` 对象，然后就立即执行 `thenable` 对象的 `then` 方法。
> 这也就意味着， `thenable` 对象里的 `then` 方法决定了最后生成的 `Promise` 对象状态

```js
const thenable = {
    then: function(resolve, reject) {
        console.log('thenable对象then方法被调用') // 2. thenable对象then方法被调用
        resolve('成功')
        return '我不设置状态'
    }
}
// console.log(Promise.resolve('thenable'))// Promise { 'thenable' }
// console.log(Promise.resolve(new Promise((resolve, reject) => { resolve('test') })))// Promise { 'test' }
const p1 = Promise.resolve(thenable)
console.log(p1) // 1. Promise {
    <
    pending >
}
p1.then(function(value) {
        console.log('then: ' + value) // 3. then: 成功
    })
    .catch(function(res) {
        console.log('catch: ' + res)
    })
    .finally(() => console.log('执行完毕！')) // 4. 执行完毕！
setTimeout(() => console.log(p1), 0) // 5. Promise { '成功' }
```

从上我们可以看出：  
1. `Promise.resolve()`参数如非`thenable`对象都是同步代码，立即返回结果；反之则是异步操作，需要在本次事件循环结尾方能得到异步结果。

> 我们这里通过定时器来在下一次事件循环开始获取结果并打印。

2. `thenable`对象里是否设置状态决定了`Promise.resolve()`返回的对象状态结果；如不通过`resolve`、`throw`或者`reject`设置状态，那么结果将是`Promise { <pending> }`；经过测试，`thenable`对象转换`Promise`对象底层其实使用的`then`方法，故也可通过`return promise对象`来设置状态！

```js
return reject('错误') // 这种形式
```

这通常用于：将一个不知道是否是 `Promise` 对象的数据转换为 `Promise` 对象方便我们进行链式调用。

```js
const promise = Promise.resolve('foo')
// 等价于  new Promise(resolve => resolve('foo'))
promise.then(v => console.log(v)) // foo
console.log(promise) // Promise {<resolved>: "foo"}
```

* 代码先通过`Promise.resolve()`创建一个`Promise`对象
* 因为其为字符串，故该对象为`Promise {<resolved>: "foo"}`，在后面的同步代码打印出来
* 同步代码执行完毕开始执行异步操作，`.then`接收到上面的对象进行拆箱，取出对象里的值`foo`并进行打印。

更多：[Promise - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### Promise.reject()

通过 `Promise.reject()` 我们可以创建一个状态为 `fulfilled` 状态的 `promise` 对象。
但是与 `Promise.resolve` 不同，即使传入的是一个 `Promise` 对象， 该方法依旧返回一个新对象。

```js
let p = Promise.reject(new Error("error!"))
console.info(
    p === Promise.reject(p) // 打印false
)
```

`Promise.reject()` 不管参数是什么，都能直接返回结果，因此是同步代码，不用担心异步执行导致当前不能立即获得结果的事情。

### Promise.protype.then()

then方法返回的是一个新的 `Promise` 实例（注意，不是原来那个 `Promise` 实例），这也是它可以链式调用的基础。

除此之外，还有一些东西需要注意：

```js
Promise.resolve()
    .then(() => {
        return new Error('error!!!')
    })
    .then((res) => {
        console.log('then: ', res)
    })
    .catch((err) => {
        console.log('catch: ', err)
    })
```

结果：

```js
// return new Error('error!!!') 等价于 return Promise.resolve(new Error('error!!!'))
then: Error: error!!!
    at Promise.resolve.then(...)
at...
```

> 返回任意一个非 promise 的值都会被包裹成 promise 对象

<span style="color:yellow">注意一</span>：**如果想让 `then` 方法返回一个 `rejected` 状态的 `Promise` 对象，必须通过抛出异常 `throw new Error('xxx')` 或者显示返回一个拒绝状态的新对象 `return Promise.reject('xxx')` **，除此之外，将其他对象（即使是错误对象）返回依旧是当做 `fulfilled` 状态来返回创建的 `Promise` 对象

```js
Promise.resolve(1)
    .then()
    .then('')
    .then(2)
    .then(Promise.resolve(3))
    .then(console.log)
```

结果：

```js
1
```

<span style="color:yellow">注意二</span>：** `.then` 或者 `.catch` 的参数期望是函数，但如果我们传入参数不是函数（比如字符串、数字、不传等）则会发生值穿透。**

> 值穿透 - 当前方法不接住收到的值，直接往下一个传递，直到后面的某个方法能接受这个值。

### Promise.protype.catch()

`Promise.prototype.catch(e => e)` 其实就是 `Promise.prototype.then(null, e => e)` 的语法糖。

`catch` 方法返回的还是一个 `Promise` 对象，因此后面还可以接着链式调用 `then` 方法。

> 我们应该在 `Promise` 链式调用最后使用 `catch` 方法，而不是 `then` 方法的第二个参数。

因为如果最后使用 `then` 的第二个参数来捕获异常，那捕获异常的 `then` 方法，第一个参数出现异常怎么办？第二个参数是无法捕获一个参数异常的，只能捕获之前 `then` 方法的异常。  
当然，我们也可将第一个参数设置为 `undefined` 或者 `null` ，可如此的话，为什么不直接使用 `catch` 呢？

### Promise.protype.finally()

基本语法：

```js
Promise.prototype.finally(onFinally)
```

解释：  
* 添加一个事件处理回调于当前`promise`对象，并且在原`promise`对象解析完毕后，返回一个新的`promise`对象。回调会在当前`promise`运行完毕后被调用，无论当前`promise`的状态是完成(`fulfilled`)还是失败(`rejected`)

> 简单来说： `finlly` 如放在链式调用代码最后，则在 `promise` 结束时，不管成功还是失败都将执行其 `onFinally` 回调，该回调无需参数；注：此方法是 `ES2018` 的标准

```js
const p = new Promise((resolve, reject) => {
    resolve('1')
})
const p1 = p.then(v => {
    console.log('p：' + v)
    return 2
})
const p2 = p1.finally(function test(v) {
    console.log('finally：')
    console.log(arguments)
    console.log('p1：' + v)
    return 3
})
const p3 = p2.then(v => {
    console.log('p2：' + v)
    return 3
}, e => console.log(console.log('p2：' + e)))
setTimeout(() => {
    console.log('p：')
    console.log(p)
    console.log('p1：')
    console.log(p1)
    console.log('p2：')
    console.log(p2)
    console.log(p1 === p2)
    console.log('p3：')
    console.log(p3)
})
```

结果：  

```js
p： 1
finally： [Arguments] {}
p1： undefined
p2： 2
p：
Promise {
    '1'
}
p1：
Promise {
    2
}
p2：
Promise {
    2
}
false
p3：
Promise {
    3
}
```

从上我们可以注意到：
* `finlly`将上一个`promise`的值包装成的新`promise`对象并返回，其自身不接收参数（即使`finally`方法声明形参也无效），其自身返回的`return`也无效。

> `finlly` 适用于写在 `promise` 链式调用代码结尾，不管成功还是失败都将执行其 `onFinally` 回调函数，如果有同样的语句需要在 `then()` 和 `catch()` 中各写一次的情况下用它就比较合适。

### Promise.all()

`Promise.all(iterable)` 用于将多个 `Promise` 实例包装成一个新的 `Promise` 实例，参数为一组 `Promise` 实例组成的数组

```js
Promise.all([promise1, promise2, promise3....])
    .then(() => {})
```

`iterable` 类型为 `ES6` 标准引入，包括： `可迭代对象` ， `Array` 、 `Map` 和 `Set` 等类型 ，可查看这篇文章：[递归与遍历](递归与遍历的区别和检测.md)，这里我们就先把这个参数简单理解成数组就可以。

```js
const p1 = Promise.resolve(1)
const p2 = Promise.reject(2)
// eslint-disable-next-line promise/param-names
const p3 = new Promise((reject) => {
    setTimeout(() => {
        reject('3')
    }, 6000)
})
const p = Promise.all([p1, p2, p3])
p.then((data) => {
    console.log(data)
}).catch((err) => {
    console.log('err:' + err) // 3
})
```

注意：  

0. `all`异步返回结果，因此`p`对象状态最少需等到同步代码执行完毕方可确定

```js
Promise {
    <
    pending >
}
```

1. `all`里面状态全为`fufilled`最终结果则为真，反之只要有一个为`rejected`对象，那么，`all`内部将新建并返回一个 以 第一个`rejected`状态的对象信息 为基础 的新对象（表面相同，但不是一个对象）

> 可简单看作： `&&` 符号

```js
console.log(p === p2) // false
```

2. 如果没出现状态为`rejected`的对象结果（假设结果对象状态全为成功），那么`all`的结果需等到 所有异步执行完毕，各个操作结果全部获得 方可处理返回 新对象。也就是说，如果前面异步执行没有失败，那么`all`执行时间为所有异步都执行完毕的时间（大概率是执行最长的操作时间 再多一点点）
3. 并行执行异步时，尽管出现异常，`all`的结果已确定，但是其他的异步任务仍会正常执行，只是不参与`all`结果，也就是说，执行结果被抛弃。

> 适用于我们一个操作需要先从多个地方获取数据，比如一次网络请求需要先从前几个接口各自获取数据最后进行拼接再次发出完整的网络请求

[ `promise.all()` 内操作虽然异步执行, 但返回结果会按顺序排列好，和
`iterable` 顺序一致](https://segmentfault.com/q/1010000008174264/a-1020000008175569)。

### Promise.race()

`Promise.race(iterable)` 和上面 `Promise.all(iterable)` 效果相反，一个可看作 `&&` 且操作，这个可看作 `||` 或操作符

```js
const p2 = Promise.reject(2)
// eslint-disable-next-line promise/param-names
const p3 = new Promise((reject) => {
    setTimeout(() => {
        reject('3')
    }, 6000)
})
const p1 = Promise.resolve(1)
const p = Promise.race([p1, p2, p3])
console.log(p)
console.log(p2)
console.log(p === p2)
p.then((data) => {
    console.log(data)
}).catch((err) => {
    console.log('err:' + err) // 3
})
```

结果：

```js
Promise {
    <
    pending >
}
Promise {
    < rejected > 2
}
false
1
```

只要有一个任务提前执行完毕返回真， `Promise.race(iterable)` 结果对象就为真，其信息就来自等同于第一个执行成功的对象（内部也是异步新建返回一个类似对象）

> `Promise.race(iterable)` 有任意一个返回成功后，就算完成，但是 其他异步进程不会立即停止，不过执行结果会被抛弃，适用于配合定时器在多少秒后告诉用户网络超时

### `resolve()` 拆箱操作与区别

我们之前知道了 `Promise.resolve()` 在接受参数时底层操作是因参数类型不同而有区别的。

```js
Promise.resolve(value); // Promise.resolve() ---> 不传递参数我归类于非对象一类，因为不传就等于传入了undefined
Promise.resolve(promise);
Promise.resolve(thenable);
```

这三种情况我们再来简单说一下巩固一下：
1. 情况一，非对象参数 被传入直接返回该参数的`Promise`对象，如无对象，和传入`undefined`同理，结果为：`Promise {<resolved>: undefined}`
2. 情况二，`Promise`对象 被传入直接返回该对象，不作任何处理
3. 情况三，`thenable`对象 被传入则将其转为`Promise`对象并调用其`then`方法确定状态

`thenable` 对象底层转换代码类似于：  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200720161324.png)

```js
new Promise((resolve, reject) => {
    console.log("async1 start");
    console.log("async2");
    resolve(Promise.resolve());
}).then(() => {
    console.log("async1 end");
});

new Promise(function(resolve) {
    console.log("promise1");
    resolve();
}).then(function() {
    console.log("promise2");
}).then(function() {
    console.log("promise3");
}).then(function() {
    console.log("promise4");
});
```

<details>
<summary>结果与解析</summary>

结果：

```js
async1 start
async2
promise1
promise2
promise3
async1 end
promise4
```

[解析](https://segmentfault.com/q/1010000016913023)：

1. 我们将代码进行转换，看看实际是什么样：

```js
// p1
new Promise((resolve, reject) => {
    console.log("async1 start");
    console.log("async2");
    const 新Promise对象 = Promise.resolve()
    // resolve(新Promise对象);
    new Promise((res, rej) => {
        新Promise对象.then(res, rej)
            .then(resolve)
    })
}).then(() => {
    console.log("async1 end");
});
// p2
new Promise(function(resolve) {
    console.log("promise1");
    resolve();
}).then(function() {
    console.log("promise2");
}).then(function() {
    console.log("promise3");
}).then(function() {
    console.log("promise4");
});
```

2. 从上可以看出，当参数为`Promise`对象时，拆箱重新包装会多出两个`then`时序。
3. `then`作为异步方法被调用时即被推入微任务队列，链式调用的前提是上一个调用返回结果才能进行下一个，故`p1`调用一下`then`将其推入微任务队列，下一个的`.then`在上一个未确认时并不被调用，就轮到`p2`调用其`then`
4. 但由于`p1`的`new Promise`会隐式的推入两个`then`方法，因此表现上就延迟了两个时序，结果就如上面这样了。

</details>

我们之前说过， `Promise.resolve()` 等价于下面这种写法，其实这种说法是部分错误的：

```js
new Promise(resolve => resolve(value))
```

因为，在参数为 `Promise` 时，两者结果其实是不一致的； `Promise.resolve()` 在面对 `Promise` 对象参数时直接返回源对象，但 `resolve()` 却是创建原 `Promise` 对象副本再返回！

> 此外， `Promise.reject()` 和 `reject()` 不管接收到什么参数（包括 `Promise` 对象）统统返回 `rejected` 状态、信息为传入参数的新 `Promise` 对象，因此他们没有拆箱的步骤

```js
var p0 = Promise.resolve('test')
var p = new Promise((resolve, reject) => {
    resolve(p0)
})
console.log(p, p0) // Promise { <pending> } Promise { 'test' }
console.log(p === p0) // false
setTimeout(() => {
    console.log(p === p0) // false
    console.log(p) // Promise { 'test' }
}, 0)
```

<details>
<summary>解析</summary>

这里我们可以看出：  
* `new Promise`里的 `resolve` 在接收到一个`Promise`对象时会重新创建一个新对象，并不是原来的`Promise`对象；和`Promise.resolve`其实不一样
* `resolve`设置`Promise`对象状态看参数类型决定是否是异步创建与设置的，如果接收到的参数是`Promise`对象或者`thenable`对象则是异步创建新对象，在本次循环同步代码执行完毕后开始设置状态

因此，我们可以列出使用一个 `Promise` 对象哪些异步哪些同步：  

```js
const p = new Promise((resolve, reject) => {
    // func()
    // console.log('xxxx')
    // throw 'xxx' // 没想到吧？抛出异常直接检测到设置失败，应该是promise里自带的try...catch...捕获设置的，以后再检验
    // ......
    // reject('xxx') // 没想到吧，reject没有“拆箱”操作
    // 上面 都是同步代码；下面是否是异步代码取决于参数
    resolve(变量)
    /*
      1. 变量 类型为非对象，同步
      2. 变量 类型为`Promise`或者`Promiselike`对象则为异步
    */
})
// 这都是异步代码
p.then(v => console.log(v))
    .catch(e => console.log(e))
```

</details>

> 因此，我们从上可以注意，如果 `Promise.resolve()` 或 `resolve()` 接收都 `PromiseLike` 类型的对象时会多出两个 `then` 时序任务（称为拆箱操作）。

> 额外注意： `resolve()` 对于 `Promise` 对象同样如此。

## Promise面试题

### `then` 与 `catch` 返回对象注意死循环情况

```js
const promise = Promise.resolve()
    .then(() => {
        return promise
    })
promise.catch(console.error)
```

<details>
<summary>答案与解析</summary>

结果：

```js
TypeError: Chaining cycle detected
for promise # < Promise >
    at < anonymous >
```

解析： `.then` 或 `.catch` 返回的值不能是 `promise` 本身，否则会造成死循环。

流程详细分析：
* `Promise.resolve()`返回一个值为`undefined`的 `Promise`对象，通过调用`then`方法本来能返回一个新的`Promise`对象再赋值给`promise`变量
* 但是，我们这里将`promise`变量返回给`promise`变量，这意味着：代码陷入了一个循环，如同 蛇吞尾 现象；
* 我们将代码伪代码化一下方便讲述与理解：

```js
定义 promise变量 = 返回新对象(Promise对象) {
return promise变量
})
// ...
```

* 接下来我们继续描述，第一个执行后：  

```js
promise变量 = 返回新对象(Promise对象) {
return 返回新对象(Promise对象) {
    return promise变量
})
})
```

* 第二次：

```js
promise变量 = 返回新对象(Promise对象) {
return 返回新对象(Promise对象) {
    return 返回新对象(Promise对象) {
        return promise变量
    })
})
```

* 看明白了么？`promise`变量就等于调用一个方法返回方法本身的代码，这就是一个没有条件结尾的递归循环！

</details>

### `resolve` 与 `Promise.resolve()`

```js
new Promise(resolve => {
    resolve(1);
    Promise.resolve().then(() => {
        console.log(2)
    });
    console.log(4)
}).then(t => {
    console.log(t)
});
console.log(3);
```

<details>
<summary>查看答案与解析</summary>

结果：

```js
4
3
2
1
```

解析：
1. 进入构造函数，`resolve()`立即确定`Promise`对象状态
2. `Promise.resolve()`立即返回个类似 `Promise <resolved undefined>` 的`Promise`对象
3. 遇见`then`方法，异步代码，但因为`Promise`对象已经有了状态，调用`then`就将其加入到微任务队列中，等待`script`代码执行完毕当前同步代码后运行，当前的微任务队列是这样的：`function(){console.log(2)}`
4. `console.log(4)`是同步代码，控制台打印：`4`
5. 构造函数内代码执行完毕，`Promise`对象状态在`resolve()`时已经被确定，故遇到外面的`then`方法时，便立即执行调用了`then`方法，可它是异步代码，故将其压入微任务队列，当前的微任务队列是这样的：`function(){console.log(2)} ---> function(t){console.log(t)}`
6. `console.log(3);`是同步代码，控制台打印：`3`
7. `script`宏任务内同步代码执行完毕，开始查询微任务队列，取出第一个任务
8. `console.log(2)`在控制台打印：`2`；执行完毕后紧接着取出当前的第一个微任务
9. `console.log(t)`；`t`为`1`，故在控制台打印：`1`

</details>

### 定时器与 `then` 先后顺序

```js
var p1 = new Promise(function(resolve, reject) {
        setTimeout(() => {
            throw Error('async error')
        })
    })
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

<details>
<summary>查看答案与解析</summary>
<p>

结果：

```js
Uncaught Error: async error
at setTimeout( < anonymous >: 3: 15)
```

解析：

```js
1. `script`
执行 `new Promise`
内部代码， 启动定时器（ 异步， 虽然定时器未设置时间， 谷歌浏览器默认为1ms， 但其回调需在下次事件循环开始执行）
2. 此时的 `p1`
状态为 `pending`
状态
3. 因此 `then`
和 `catch`
未触发无法被调用。
4. 下次循环 `tick`
开始， 定时器抛出异常， 本轮循环中没有 `catch`
在后面捕获， 故控制台报错
5. 尽管如此， 但 `Promise`
内部抛出的异常不影响外界执行， 因此， 如果后面还有其他任务会继续执行
```

</p>
</details>

### Promise 中的异常与交替性执行

```js
var p1 = new Promise(function(resolve, reject) {
    foo.bar();
    resolve(1);
});

p1.then(
    function(value) {
        console.log('p1 then value: ' + value);
    },
    function(err) {
        console.log('p1 then err: ' + err);
    }
).then(
    function(value) {
        console.log('p1 then then value: ' + value);
    },
    function(err) {
        console.log('p1 then then err: ' + err);
    }
);

var p2 = new Promise(function(resolve, reject) {
    resolve(2);
});

p2.then(
    function(value) {
        console.log('p2 then value: ' + value);
        foo.bar();
    },
    function(err) {
        console.log('p2 then err: ' + err);
    }
).then(
    function(value) {
        console.log('p2 then then value: ' + value);
    },
    function(err) {
        console.log('p2 then then err: ' + err);
        return 1;
    }
).then(
    function(value) {
        console.log('p2 then then then value: ' + value);
    },
    function(err) {
        console.log('p2 then then then err: ' + err);
    }
);
```

<details>
<summary>查看答案与解析</summary>
<p>

结果：

```js
p1 then err: ReferenceError: foo is not defined
p2 then value: 2
p1 then then value: undefined
p2 then then err: ReferenceError: foo is not defined
p2 then then then value: 1
```

解析：

```js
Promise中的异常由then参数中第二个回调函数（ Promise执行失败的回调） 处理， 异常信息将作为Promise的值。 异常一旦得到处理， then返回的后续Promise对象将恢复正常， 并会被Promise执行成功的回调函数处理。 另外， 需要注意p1、 p2 多级then的回调函数是交替执行的， 这正是由Promise then回调的异步性决定的。
```

</p>
</details>

### Promise 会存储返回值

```js
var p1 = new Promise(function(resolve, reject) {
        reject(1)
    })
    .catch(err => {
        console.log(err)
        return 2
    })

setTimeout(() => {
    p1.then(res => console.log(res))
}, 1000)
```

<details>
<summary>答案与解析</summary>

答案：

```js
1
2 // 大概一秒后多一点
```

解析：

```js
Promise会将最后的值存储起来， 如果在下次使用promise方法的时候回直接返回该值的promise。
```

</details>

### resolve vs reject 拆箱

```js
var p1 = new Promise(function(resolve, reject) {
    resolve(Promise.resolve('resolve'));
});

var p2 = new Promise(function(resolve, reject) {
    resolve(Promise.reject('reject'));
});

var p3 = new Promise(function(resolve, reject) {
    reject(Promise.resolve('resolve'));
});

p1.then(
    function fulfilled(value) {
        console.log('fulfilled: ' + value);
    },
    function rejected(err) {
        console.log('rejected: ' + err);
    }
);

p2.then(
    function fulfilled(value) {
        console.log('fulfilled: ' + value);
    },
    function rejected(err) {
        console.log('rejected: ' + err);
    }
);

p3.then(
    function fulfilled(value) {
        console.log('fulfilled: ' + value);
    },
    function rejected(err) {
        console.log('rejected: ' + err);
    }
);
```

<details>
<summary>答案与解析</summary>

答案：

```js
p3 rejected: [object Promise]
p1 fulfilled: resolve
p2 rejected: reject
```

解析：

```js
Promise回调函数中的第一个参数resolve， 会对Promise执行 "拆箱"
动作。 即当resolve的参数是一个Promise对象时， resolve会 "拆箱"
获取这个Promise对象的状态和值， 但这个过程是异步的。 p1 "拆箱"
后， 获取到Promise对象的状态是resolved， 因此fulfilled回调被执行； p2 "拆箱"
后， 获取到Promise对象的状态是rejected， 因此rejected回调被执行。 但Promise回调函数中的第二个参数reject不具备” 拆箱“ 的能力， reject的参数会直接传递给then方法中的rejected回调。 因此， 即使p3 reject接收了一个resolved状态的Promise， then方法中被调用的依然是rejected， 并且参数就是reject接收到的Promise对象。
```

</details>

### `then()` 异步微任务

```js
Promise.resolve().then(() => {
        console.log('mm')
        Promise.resolve()
            .then(() => {
                console.log('xx')
            })

            .then(() => {
                console.log('yy')
            })
    })

    .then(() => {
        console.log('nn')
    })
```

<details>
<summary>答案与解析</summary>

答案：

```js
mm
xx
nn
yy
```

解析：

```js
1. Promise.resolve() 立即返回一个 Promise对象
2. 状态确定调用then()， 启动异步微任务， 将其回调函数压入微任务队列
3. 微任务队列取出then() 开始执行， 执行console.log('mm')， 控制台打印： mm
4. Promise.resolve() 立即返回另一个 Promise对象， 调用then(() => console.log('xx'))， 执行异步微任务， then() 的回调函数() => console.log('xx') 压入微任务队列； 第二个then(() => console.log('yy')) 需等到前一个返回状态确定的Promise对象方可调用
5. 里面代码已完成， 给外部返回状态为fulfilled， 值为undefined的Promise对象， 调用then()， 将其回调() => console.log('nn') 压入微任务队列
6. 从微任务回调函数队列取出队首函数开始执行， 执行console.log('xx')， 控制台打印： xx
7. 调用then(() => console.log('yy'))， 启动异步微任务， 将其回调函数() => console.log('yy') 压入微任务队列
8. 从微任务回调函数队列取出队首函数开始执行， 执行console.log('nn')， 控制台打印： nn
9. 从微任务回调函数队列取出队首函数开始执行， 执行console.log('yy')， 控制台打印： yy
```

</details>

### `all()` 和 `race()` 传入空数组

```js
console.log(Promise.all([]))
console.log(Promise.race([]))
```

<details>
<summary>答案与解析</summary>

答案：

```js
Promise {
    <
    resolved >: Array(0)
}
Promise {
    <
    pending >
}
```

解析：

```js

```

</details>

更多：  
* [Promise 必知必会（十道题）](https://juejin.im/post/5a04066351882517c416715d)
* [八段代码彻底掌握Promise](https://segmentfault.com/a/1190000010345031)
* [要就来45道Promise面试题一次爽到底(1.1w字用心整理)](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

## 手写Promise

> 待更新...

相关文章：  
* [面试官眼中的Promise](https://juejin.im/post/5c233a8ee51d450d5a01b712)
* [性感的Promise，拥抱ta然后扒光ta](https://juejin.im/post/5ab20c58f265da23a228fe0f)
* [ES6--浅析Promise内部结构](https://www.cnblogs.com/chengxs/p/10592282.html)

## 更多

Promise相关文章：  
* [Promise迷你书（中文版）](http://liubin.org/promises-book/#_)
* [你真的懂Promise吗](https://juejin.im/post/5e650f646fb9a07cb83e3209)
* [promise 总结篇 并实现一个 promise（then, all, allSettled, race, catch）附详细解释](https://juejin.im/post/5eb760c35188256d6467c492)
* [面试精选之Promise](https://juejin.im/post/5b31a4b7f265da595725f322#heading-6)
* [理解JavaScript Promise](https://zhuanlan.zhihu.com/p/26523836)

Promise与this文章：  
* [javascript - 关于Promise中this的指向问题？](https://segmentfault.com/q/1010000017344059)
