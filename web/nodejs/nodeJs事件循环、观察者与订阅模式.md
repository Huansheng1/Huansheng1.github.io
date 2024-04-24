# 观察者模式与事件循环
> [API 文档 | Node.js 中文网](http://nodejs.cn/api/)
## 观察者模式
在`nodeJs`里通过`EventEmitter`类我们可快速创建一个`发布者`来往外发出信息：
```js
// 导入EventEmitter类
const EventEmitter = require('events').EventEmitter

class Product extends EventEmitter {
  constructor() {
    super()
    this.postMessage()
  }
  postMessage() {
    // 通过定时器定时往外面发送消息
    setInterval(()=>{
      this.emit('listenMessage', {
        info: '当前时间：' + new Date().toLocaleString(),
      })
    },5000)
  }
}
const product = new Product()
// 通过事件监听来观察接受消息
product.addListener('listenMessage', (res) => {
  console.log(res)
})
```
这里面的重点：
* `nodeJs`的`events`模块提供`EventEmitter`类给与我们`emit`方法来往外发送事件
* `addListener`监听事件来订阅获取被观察者发出的信息
### 观察者模式的缺点
1. `发布者`（当然，也可叫 `被观察者`）无法知道谁接收到它发出的信息
2. `发布者`无法知道`观察者`是否拿到它的信息后执行了它想要他执行的操作

因此，如果某些信息只管发出，而、不需要考虑安全性，不用考虑谁来监听，接收方是否执行什么操作的话，用这个模式是很适合的。