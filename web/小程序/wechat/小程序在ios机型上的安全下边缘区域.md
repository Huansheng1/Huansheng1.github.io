# 小程序在ios机型上的页面在全面屏下边缘被遮挡问题

## 起因

在 `ios` 全面屏设备下，由于引入了全面屏手势，在屏幕下边缘有一块区域是用于 小白条 之类的提供，其不参与显示东西；  
但是，在小程序里，也许是自定义tabar的原因，页面底部会被小白条挡住一部分，这时候我们需要对其进行特殊处理

## 解决

好在苹果给我们提供了一个特殊的 `css` 变量用于解决该问题： `safe-area-inset-bottom` 下安全区域能在苹果里生效，从而利用它解决页面底部被遮挡问题，至于安卓无需担心，因为不识别这个css就不会生效：

```css
page {
    /* 136是我自定义tabbar高度，constant避免老版机型不识别env */
    padding-bottom: calc(136rpx + constant(safe-area-inset-bottom));
    /* 适合新机型 */
    padding-bottom: calc(136rpx + env(safe-area-inset-bottom));
}
```

另外，如果在 `js` 里我们也可以获取：

```js
// 屏幕高度
const screenHeight = wx.getSystemInfoSync().screenHeight;
// 除去下边缘的安全区域的高度
const safeAreaHeight = wx.getSystemInfoSync().safeArea.bottom;
// 如果高度一样就没有小白条
if (screenHeight === safeAreaHeight) {
    viewHeight = screenHeight - 30;
} else {
    viewHeight = safeAreaHeight - 30;
}
```

但是上面代码可以简化下：

```js
const safeAreaHeight = wx.getSystemInfoSync().safeArea.bottom;
// 功能和上面等同
viewHeight = safeAreaHeight - 30;
```
