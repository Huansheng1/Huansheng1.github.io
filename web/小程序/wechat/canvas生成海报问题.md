# canvas 生成海报问题

## 开始原因

在某个微信小程序中，我发现，部分手机点击保存按钮毫无反应。

## 分析过程

既然代码不生效，我想到的第一步当然是在触发事件看看 是否进入了按钮监听函数。

通过`console.log`可以发现，确实进入了点击事件。

仔细分析代码，初步推断，不生效的原因为：`if (that.data.canvasDrawSuccess) {...}` 中所使用的条件出现异常。

既然该变量`canvasDrawSuccess`不为真 ，那我们往上找找 为何`canvas`绘制成功的变量没有被设置成功。

```js
canvasObj.setFontSize(13);
canvasObj.setFillStyle("#353535");
for (let i = 0; i <= content.lenght; i++) {
  canvasObj.fillText(content[i - 1], positionX, positionY + 16 * i);
  canvasObj.draw(true, () => {
    that.setData({
      canvasDrawSuccess: true,
    });
  });
}
```

为什么没有进入`draw`函数的成功回调？

我的揣测是，快速调用`draw`可能有一个坑，容易导致后面的几次调用不生效，但是，`draw`好像并无失败回调。

> [CanvasContext.draw | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.draw.html)

既然如此，我将其改为：

```js
canvasObj.setFontSize(13);
canvasObj.setFillStyle("#353535");
for (let i = 0; i <= content.lenght; i++) {
  canvasObj.fillText(content[i - 1], positionX, positionY + 16 * i);
}
canvasObj.draw(true, () => {
  that.setData({
    canvasDrawSuccess: true,
  });
});
```

嗯哼，解决了，因此可以总结出：如果我们需要绘制多行文本，不要在一个时间段内频繁调用`draw`，不如先设置，最后再一起调用。

## 黑色背景 Bug 的出现

当我们在手机上保存时，会哑然发现，相册中的`活动分享图`背景为黑色，这与我们在模拟器上的白色不符。

推测为 默认背景色就是黑色，至于为何部分手机或者模拟器上为白色，暂时不确定。。。

解决办法，显式地给背景全部刷成白色即可：

```js
// 设置画布图片背景颜色为白色
canvasObj.setFillStyle("#ffffff");
canvasObj.fillRect(0, 0, canvasWidth, canvasHeight);
canvasObj.fill();
canvasObj.closePath();
```
## canvas层级问题

将canvas整体刷成白色，我们又发现了个新问题：点击保存的按钮被`canvas`覆盖了（设置`z-index`无效）

原因为：
* `canvas`作为原生组件，层级最高，具体可查看：[原生组件层级问题 | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html)
![](https://pic.downk.cc/item/5f56f8cb160a154a678c18f7.jpg)

解决办法：
1. 可将按钮改为`cover-view`和`cover-image`组件来保证优先级问题，注意，`canvas`组件需在前面，后面的`cover-view`方可覆盖前者优先级。
2. `canvas`使用新版的[`2D`组件](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html)。

### canvas图片层级问题
我们有这样的场景，在绘制完一个图片后，在该图片的上面再绘制一个`Logo`图标。

可是，我发现绘制的图标竟然不显示在画布上？

经过分析与查阅资料，其不显示的原因为：
* 层级我们是通过后面的绘制优先级比前面绘制图片的高来保证的，我们之前的代码也确实是这样做的
* 可问题就在于，经过我们代码看起来是从上到下绘制的，先绘制背景图再绘制Logo图标，但是 `canvas`的方法应是异步的，在上面的背景图还没绘制完成的时候我们又开始绘制了Logo图标
* 因此，最后层级是没法保证的，因为Logo较小，先绘制完成，其层级反而会被前者给挡住
* 解决方法：在绘制背景图的成功回调里才开始绘制Logo图片即可


## 推荐文章
* [小程序canvas绘制海报](https://developers.weixin.qq.com/community/develop/article/doc/0006a40bf88ed0fbfe9a0339651c13)