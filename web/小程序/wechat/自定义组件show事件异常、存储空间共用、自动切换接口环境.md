# 自定义组件show事件异常、存储空间共用、自动切换接口环境

## 自定义组件show事件未正常触发

> 2021-06-26：

本来，想在自定义组件通过 `lifetime` 在页面 `onshow` 事件触发时获取某个数据，但是，发现在 `tabbar页面` 的组件并不会在第一次展示时触发这个 `show` 事件：

比如我们在首页和个人中心都使用了 某个 `卡片` 组件，卡片组件里需要获取用户的个人信息，但是我们会发现小程序第一次冷启动时，首页是可以正常触发 `show` 里的获取个人信息的方法，但在 `个人中心` 页面第一次通过 `tabbar` 切换是没反应的，必须切到其他页面再切回来才会有反应。

因此我暂时是在 组件的 `attached` 事件和 `show` 都触发请求，但是增加了点防抖效果，在一秒内只请求一次来临时解决。

## 不同版本小程序共用 localStorage 问题

小程序 `开发板` 、 `体验版` 、 `正式版` 会共用一个 `localStrage` ，所以存 `token` 时如果通过一个 `key` 去取，可能会出现一些奇奇怪怪的情况。

## 根据小程序版本自动切换接口地址

```js
const {
    miniProgram: {
        envVersion
    },
} = wx.getAccountInfoSync();
let env = "";
switch (envVersion) {
    // 开发版
    case "develop":
        env = `test`;
        break;
        // 体验版
    case "trial":
        env = `test`;
        break;
        // 正式版
    case "release":
        env = `prod`;
        break;
    default:
        env = `test`;
        break;
}
console.log("当前环境：版本 - ", envVersion, " 环境：", env);
```
