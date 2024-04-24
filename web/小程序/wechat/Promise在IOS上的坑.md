# Promise 在 IOS 上的坑

在之前绘制海报分享图时，由于为了保证先绘制图片再绘制文字（我们文字得根据图片绘制完后才好计算 Y 坐标，避免被图片覆盖），我们使用了`Promise`来保证异步执行的先后顺序。

通过`Promise.prototype.all()`方法来等待所有网络图片全部绘制成功。

问题就出在这里，我在 开发者工具和手机上测试都没问题，但是，在同事的苹果真机测试时出现了大问题 - 一直显示`极速绘制中...`，无法正常完成。

经过逐步排查（笨拙的使用 - `wx.showModal()`弹框来显示每一步结果），终于发现了问题：

`Promise.prototype.finally()`内部代码没被执行！

为什么会这样？经过查阅资料和寻找更多苹果手机测试，我得出一个结论：

> `Promsie`支持性不全，`Promise.prototype.finally`在`ios`上竟然没有你敢信？

没办法，总得解决，我们需要手动打一个补丁来解决该问题（当然你也可以不用`finally`）：

```js
// polyfill - app.js加入以下代码
// 兼容ios真机环境下Promise对象不存在finally方法
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
      (value) => P.resolve(callback()).then(() => value),
      (reason) =>
        P.resolve(callback()).then(() => {
          throw reason;
        })
    );
  };
}
App({
  // ...更多代码
});
```
