# 回顾过往开发中的一些技巧与操作
## 如何实现一个图片懒加载
> 懒加载（Lazy loading），也被称为延迟加载，通过延迟加载网页中的图片，只在图片进入可视区域时才进行加载，从而提升网页加载性能和用户体验。

目的是 只加载当前屏幕的图片，可视区域外的图片不会进行加载，只有当屏幕滚动的时候才加载。

> 实现原理：通常是通过 JavaScript 监听判断图片是否进入了可视区域。如果图片进入了可区域，则将图片资源的地址赋值给 img 元素的 src 属性，触发浏览器加载图片。

### 实现方案
1. 监听页面滚动事件`scroll`，然后 获取 浏览器可视区域高度`documewnt.documentElement.clientHeight` 和 图片元素距离浏览器窗口顶部的高度`getBoundingClientRect().top` 将两者对比判断是否进入可视区域
```js
// 获取所有图片标签
const imgs = document.getElementsByTagName("img");
// 获取可视区域的高度，也可以使用 window.innerHeight 获取
const viewHight = document.documentElement.clientHeight;
// 统计当前加载到了哪张照片，避免每一次都从第一张照片开始检查
let num = 0;

function lazyload() {
  for (let i = num; i < imgs.length; i++) {
    const item = imgs[i]
    // 可视区域高度减去元素顶部距离可视区域顶部的高度，如果差值大于 0 说明元素展示
    let distance = viewHight - item.getBoundingClientRect().top;
    if (distance >= 0) {
      // 展示真实图片
	    item.src = item.getAttribute("data-src");
      num = i + 1;
    }
  }
}

// 监听 scroll 事件，实际项目中需要进行**节流优化**
window.addEventListener("scroll", lazyload, false);

lazyload();
```
2. 使用现代 API `IntersectionObserver`，它可以异步监听目标元素与其祖先或视窗的交叉状态。
> 它是异步的，不随着目标元素的滚动同步触发，所以它并不会影响页面的滚动性能。

Intersection Observer API 的核心概念是观察器（Observer）和目标元素（Target）。观察器用于监听目标元素与视口之间的交叉信息，并在交叉状态发生变化时执行相应的回调函数。

> [使用 Intersection Observer API 的步骤](https://juejin.cn/post/7271639532469747769?searchId=202404251115031584B45DA46147FB76AA)：

1. 创建观察器实例： 使用 new IntersectionObserver(callback, options) 创建一个观察器实例。callback 是一个回调函数，用于处理交叉状态的变化；options 是观察器的配置参数，可以设置用于判断交叉状态的阈值、根节点等。

2. 指定目标元素： 使用观察器实例的 observe(target) 方法，将要观察的目标元素添加进观察器。目标元素可以是单个元素，也可以是一个节点列表。

3. 处理交叉状态变化： 当被观察的目标元素与视口发生交叉状态变化时，观察器会执行指定的回调函数。回调函数会接收一个参数，即包含交叉信息的观察器实例数组（一般只有一个实例）。通过这些交叉信息，可以获取目标元素与视口之间的交叉比例、交叉区域的位置等。

4. 解除观察： 使用观察器实例的 unobserve(target) 方法，可以取消对特定目标元素的观察。当不再需要观察某个元素或者页面销毁时，应及时解除观察，以避免资源的浪费。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04379e120ee94995a503625eb6aadac6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1012&h=853&e=png&b=fefdfd)

```js
// 接受两个参数：触发成功的回调函数 与 配置项
// 配置项：
// root：所监听对象的具体祖先元素，默认是 viewport ；
// rootMargin：计算交叉状态时，将 margin 附加到祖先元素上，从而有效的扩大或者缩小祖先元素判定区域；
// threshold：设置一系列的阈值，当交叉状态达到阈值时，会触发回调函数。
const io = new IntersectionObserver((entries) => {
  // entries 是一个 包含 IntersectionObserverEntry 对象的数组，该对象一共有七大属性：  
  // time：返回一个记录从 IntersectionObserver 的时间原点到交叉被触发的时间的时间戳；
  // target：目标元素；
  // rootBounds：祖先元素的矩形区域信息；
  // boundingClientRect：目标元素的矩形区域信息，与前面提到的 Element.getBoundingClientRect() 方法效果一致；
  // intersectionRect：祖先元素与目标元素相交区域信息；
  // intersectionRatio：返回intersectionRect 与 boundingClientRect 的比例值；
  // isIntersecting：目标元素是否与祖先元素相交。
  entries.forEach(entry => {
    // 当前元素可见时
    if (entry.intersectionRatio > 0) {
      entry.target.src = entry.target.dataset.src // 替换 src
      io.unobserve(entry.target) // 停止观察当前元素，避免不可见时再次调用 callback 函数
    }
  })
},{
    rootMargin: '0px 0px 0px 0px'
})

const imgs = document.querySelectorAll('[data-src]')

// 监听所有图片元素
imgs.forEach(item => {
  io.observe(item)
});
```

> 注意事项：
1. 初始化的时候就需要判断一次是否满足加载图片的条件，避免一开始就在可视区域但是又因为没有触发事件导致图片不加载的问题
2. 如果增加了 错误状态的图片 或者 占位图，需要区别下他们 和 实际要展示的图片地址，避免发生 判断已加载了就不加载实际的图片了；尤其是错误图片如果也来自网络，那么需要注意 错误图片加载失败导致无限重复加载的问题
3. 实际上，出于显示效果，我们会在 快进入可视区域前就先加载，给予 图片一些提前加载的时间，然后 会增加 loading 效果来让用户有更好的体验
### 过往使用的示例代码
* [Angular中封装图片懒加载指令](../angular/封装一个图片懒加载指令.md)
* [小程序中封装图片懒加载组件](../小程序/wechat/图片懒加载.md )
#### Vue 实现自定义指令
> [实现自定义指令](https://juejin.cn/post/7270792006522257445#heading-7)

```js
// 将初始化的 observer动作放在外面，避免创建了N个监听对象
let imageSrc = '';
const options = {
  rootMargin: '0px',
  threshold: 0.1,
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      el.setAttribute('src', imageSrc);
      observer.unobserve(el);
    }
  });
}, options);

const lazyLoad = {
  // 在节点挂载完成后调用
  mounted(el, binding) {
    // el.setAttribute('src', 'loading 图的路径');
    // binding 是一个对象，binding.value 是传递给指令的值
    imageSrc = binding.value;
    observer.observe(el);
  },
};

export default lazyLoad;
```
在 main.js 里添加注册我们的 v-lazy 指令：
```js
import lazyLoad from './directives/lazy'

const app = createApp(App)
app.directive('lazy', lazyLoad)
```
在组件中使用该指令：
```html
<img v-lazy="'src/views/lazyLoad/img/1.jpg'" alt="懒加载1" />
```

## 怎么做移动端适配
rem 或者 vw、vh 来适配

## 如何限制未登录用户访问某些页面
使用全局路由守卫，判断要前往的页面地址是否需要登录，并检测当前token是否存在，如果不存在就跳转到登录页面

在请求拦截器中添加判断，如果token不存在 或者 token过期 并且不在登录页面，也跳转到登录页面

## 有N个弹框形式，需要依次挨个显示
### 场景
进入页面的时候，依次弹出新人引导、升级弹窗、权益弹窗以及其他。 弹窗的优先级后期可能改为后台配置，目前是前端写死。
### 解决方案
#### Promise链式调用
1. 首先我们应该在当前的页面先通过接口获取到弹窗数据，并先按优先级排序好
2. 然后我们要定义一个全局的弹框服务类，传入弹框要显示的参数 或者 传入 组件引用，通过弹框服务创建弹框，弹框服务返回弹框实例，它的接口都是Promise形式的，通过实例拿到 确认、关闭状态 以及 可能要返回的数据 或者 手动通过实例来关闭弹框。（其实在 Angular里的 [ng-bootstrap](https://ng-bootstrap.github.io/#/components/modal/examples)里就是这个思路）
3. 使用这个全局弹框服务返回的Promise接口，链式调用，依次弹出弹框来控制即可。
#### 责任链模式
> [一文带你玩转设计模式之「责任链」](https://juejin.cn/post/6895894824415657991?searchId=20240427185019C12489990578882BC727)
> [浅谈对责任链模式的理解？应用场景？](https://juejin.cn/post/7136896811767169054?searchId=20240427185019C12489990578882BC727)
> [前端设计模式之责任链模式](https://juejin.cn/post/6854573219400122376?searchId=20240427185019C12489990578882BC727)

> 常见的流程如下：

* 发送者知道链中的第一个接受者，它向这个接受者发出请求
* 每一个接受者都对请求进行分析，要么处理它，要么往下传递
* 每一个接受者知道的其他对象只有一个，即它的下家对象
* 如果没有任何接受者处理请求，那么请求将从链上离开，不同的实现对此有不同的反应

类似于 express 或者 koa 中间件的思路，创建了一个弹框处理链，再定义业务需要的 具体弹框处理器。每个处理器负责显示一个弹框，并设置下一个处理器。当调用dialog.show()时，它会依次弹出多个弹框，避免了重叠问题。
```ts
// 弹框处理器接口
interface DialogHandler {
  show(): void;
  setNext(handler: DialogHandler): void;
}

// 具体弹框处理器
class AlertDialogHandler implements DialogHandler {
  private nextHandler: DialogHandler | null = null;

  constructor(private message: string) {}

  show(): void {
    // 实际的弹框逻辑，例如使用Vue的弹框组件
    console.log(`Showing alert dialog: ${this.message}`);
    if (this.nextHandler) {
      this.nextHandler.show();
    }
  }

  setNext(handler: DialogHandler): void {
    this.nextHandler = handler;
  }
}

// 创建弹框处理链
const dialogContents = ['第一个弹框','第二个弹框','第三个弹框'];
let prevDialog: AlertDialogHandler|null = null, firstDialog: AlertDialogHandler|null = null;
for (let i = 0; i < dialogContents.length; i++) {
    let dialogContent:string = dialogContents[i];
    let temDialog = new AlertDialogHandler(dialogContent);
    if(prevDialog){
        prevDialog.setNext(temDialog);
    }else{
        firstDialog = temDialog;
    }
    prevDialog = temDialog;
}

// 触发弹框处理链
firstDialog.show(); // 依次弹出三个弹框
```

### 推荐文章
* [vue3 配合 tsx 优雅的弹窗方案](https://juejin.cn/post/7250356064988725309)

## 假设一个页面有10个请求，但是进去了这个界面后，所有的请求全部报错了，请问 如果每个请求失败都对应一个请求失败的结果，比如 tip，dialog，左上角弹出 等n个形式，怎么调整解决这种显示的问题
1. 如果是同一种，比如都是 message，每次显示的时候都关闭掉之前还在显示的，使用防抖或者互斥机制来确保只显示一个
2. 要考虑这种是否合理，可以考虑调整显示方法，比如 要显示的地方显示个错误的提示，而不是弹出
3. 考虑接口请求逻辑是否应该调整，不应该一进入就同时调用一堆接口，应该有一定的先后顺序和优先级，也可以 对并发请求数进行额外的限制，避免一次性请求太多；
4. 部分接口数据失败可以考虑忽略，使用默认预设值，比如获取点赞数，点赞状态之类的，失败就直接静默不提示，而不是提示个 请求异常
5. 网络请求增加 请求失败后自动重试，如为避免服务器资源不足，可再根据返回code判断是否继续重试
6. 增加请求结果在指定时间内缓存功能，部分不常变动的数据可以本地缓存，避免重复利用 或者 请求失败的时候直接使用
7. 部分场景可以通过`Promise.allSettled`直接对请求失败的信息合并，一起显示，比如：批量上传/处理的时候 显示本次操作 成功更新xx条，失败xx条，请重试，然后主动刷新当前列表，显示出剩余待更新的，供用户重新操作。

## 实现背景颜色跟随图片主题色变化
1. 最简单好用的方案就是 把图片放大至少5-10倍充当背景图片后，叠加高斯模糊，腾讯视频就是这样做的，简单好用
2. [采用canvas绘图，绘制完成后获取r、g、b三个通道的颜色像素累加值，最后再分别除以画布大小，得到每个颜色通道的平均值即可](https://juejin.cn/post/7313979304513044531)。缺点很明显，需要canvas支持，并且图片大小不能过大，否则会非常影响性能，不推荐
3. 在后台上传图片的时候自动分析提取出来图片主要色值并保存到数据库，然后前端显示的时候，直接读取数据库中的色值，不需要再计算。缺点是 上传的时候会增加一些耗时，同时需要后端接口的支持。

## 项目重构优化是怎么做的？你在项目中如何做性能优化的？

1. 优化请求代码：减少并合并可以一次请求解决的问题，利用 状态共享 解决多个地方要使用同一份数据的问题；封装节流指令，解决多次触发的问题；封装图片懒加载指令，解决图片同一时间加载的问题；
2. 对静态图片进行压缩，减少图片体积；
3. 替换部分依赖包为其他体积更小的依赖，如 将 momentjs 替换为 dayjs
4. 使用懒加载路由，使用分包机制，解决打包为一个文件的问题
5. 使用 按需引入，利用 tree shaking 来减少打包体积
6. 按需求封装 组件、指令 或者 ESModule模块，抽取公共代码
7. 部分依赖库使用 link 标签引入，通过 cdn加速
8. 根据项目需求调整目标浏览器版本的设置，比如：不需要支持IE浏览器的话，就可移除掉
9. [组件异步加载，适用于 在某种条件才触发的组件，如：弹框组件](https://juejin.cn/post/7355096015584264192?searchId=20240426190827D5197D47E9C9C49D9C39)
```js
// vue 中实现异步加载组件
import { reactive, ref, onMounted, computed, watch,defineAsyncComponent } from 'vue'
const rule = defineAsyncComponent(() => (import('_c/rule')))
```
10. 增加 loading动画、骨架屏等显示使得观感上更好
11. 长列表使用虚拟滚动
12. 如果可以的话，还可以调整 nginx配置，让协议改为 优先使用 http2，这样并发上限能增加，访问速度会更快

## 请求并发的限制
### 场景
* 用户在后台执行 批量更新、批量上传、批量下载等操作
* 需要实时更新的界面，如 股票交易平台，可能会用到轮询（polling）或WebSocket等技术，多个并发请求。
* 快速切换tab列表的时候，如果网页卡了，导致前一个tab请求的在后一个tab请求之后返回的数据紊乱问题。
### 可能出现的问题
* 频繁的请求，导致服务器压力过大，影响其他用户的请求，甚至导致服务器崩溃。
* 浏览器限制了同时发起的请求数，超出限制的话，请求就得排队等待，这样可能会让一些紧急的请求也变慢。
* 同时发送太多可能会占用过多内存，甚至导致页面卡死
* 并发请求的错误处理也更复杂，得考虑怎么集中处理错误，还有部分请求成功、部分失败的情况。
* 如果显示在一个区域会导致数据错乱。
### 解决方案
* 限制并发数量：使用队列或Promise.allSettled等方式限制同时进行的请求数量。
* 使用缓存：我们可以把部分不怎么变更 或者 不要求实时同步的 请求结果缓存起来，这样就不用每次都去麻烦再次请求了。
* 优先级控制：我们还可以给不同的请求设置优先级，确保重要的请求能先得到处理。
* 通过标识符控制数据正确赋值 或者 利用axios的机制取消前一个请求

下面，让我们来实现一个 控制并行请求数的代码，思路我是参考的 python线程池的用法来实现的：
```js
class ThreadPool {
    constructor(maxThreads, startInterval = 0) {
        this.maxThreads = maxThreads;
        this.tasks = [];
        this.running = 0;
        this.threadStartInterval = startInterval; // 线程之间的启动间隔时间
    }

    async execute (task, startDelay = this.threadStartInterval) {
        return new Promise(async (resolve, reject) => {
            // 1. 将任务包装一下，如果执行完毕了，不管是成功还是失败 都给任务-1，并且在执行完毕后 检测是否有任务需要派发
            const taskWrapper = async () => {
                try {
                    const result = await task();
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    this.running--;
                    await this.dispatch();
                }
            };
            // 2. 将任务添加到待执行队列中
            this.tasks.push(taskWrapper);
            await this.dispatch();
        });
    }

    async dispatch(){
        if (this.tasks.length > 0) {
            // 3. 判断是否达到最大线程数
            while (this.maxThreads - this.running) {
                const nextTask = this.tasks.shift();
                this.running++;
                setTimeout(nextTask, startDelay);
            }
        }
    }


    waitForAllTasks () {
        return new Promise(resolve => {
            // 使用定时器来循环检测当前任务是否全部完成
            const checkTasks = setInterval(() => {
                if (this.running <= 0 && this.tasks.length <= 0) {
                    clearInterval(checkTasks);
                    resolve();
                }
            }, 100);
        });
    }
}
```
使用代码示例：
```js
const threadPool = new ThreadPool(processNumber);

for (const account of accounts) {
    threadPool.execute(async () => {
        await sendRequest(account);
    }, 0);
}

// 使用Promise.all等待所有任务完成
threadPool.waitForAllTasks();
```

> 其实，已经有相关库：`p-limit`

## 虚拟滚动场景与如何实现

## 组件平台有哪些功能？

## 网络请求在项目中一般该怎么封装？比如 axios如何封装？

## 你在项目中封装过哪些组件？

## 在移动端开发（手机端）中，遇见过哪些问题？

## 单页面应用与多页面应用的区别

## 大屏自适应
1. 监听窗口大小变化事件onresize + 动态计算rem，耗时 而且对浏览器最小字体不支持
2. 使用flex + 百分比布局
3. 使用transform的scale动态计算，显示最佳，但是缩放影响地图焦点（[采用对地图再次应用scale，地图的scale值与body身上的scale值相乘等于1即可](https://juejin.cn/post/7133414529441988639?searchId=20240428191029F056C97666149022D5D8)）
4. 使用vw/vh单位来实现
5. zoom属性缩放

## 懒加载组件的原理？

## 你有大屏的项目吗？

### flex和百分比底层是怎么做？

## 微信扫码登录
> [推荐](https://juejin.cn/post/7243413799347601464)

## 开源项目
* [vue-vben-admin 基于Vue3的Vue后台管理框架](https://github.com/vbenjs/vue-vben-admin/blob/main/README.zh-CN.md)
* [soybean-admin 一个清新优雅、高颜值且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite5, TypeScript, Pinia, NaiveUI 和 UnoCSS。](https://github.com/soybeanjs/soybean-admin)