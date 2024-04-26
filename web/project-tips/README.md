# 项目经验积累
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

## 虚拟滚动场景与如何实现

## 组件平台有哪些功能？

## 开源项目
* [vue-vben-admin 基于Vue3的Vue后台管理框架](https://github.com/vbenjs/vue-vben-admin/blob/main/README.zh-CN.md)
* [soybean-admin 一个清新优雅、高颜值且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite5, TypeScript, Pinia, NaiveUI 和 UnoCSS。](https://github.com/soybeanjs/soybean-admin)