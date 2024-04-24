# angular指令小结
## 指令选择器
```ts
@Directive({
    selector: '[lazyloadSrc]',
})
```
用`[]`表示选择有`lazyloadSrc`属性的元素，因此，指令我们也可以说是自定义属性！
## angular指令
指令一般分为：
1. 组件 - 带模板的指令
2. 结构型指令 - ngIf
3. 属性型指令 - ngClass

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201108170822.png)

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201108171336.png)

此外，装饰器是可嵌套的，因此，我们通过`@HostBinding()`装饰器和`@Input()`装饰器结合可实现 直接将获取到的输入值设置当前宿主样式的效果：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201108172840.png)

通过`@HostListen()`我们可处理我们想要的监听事件：
```ts
@HostListener('click', ['$event.target'])
    clickTest(v): void {
        console.log(v);
    }
```

比如这里，我们传入了两个参数：第一个代表监听宿主的`click`点击事件、第二个代表我们装饰的方法想获取`点击事件源`数据；

于是，我们便可将当前点击元素打印出来。

注意：通过该装饰器我们不再需要在`html`里的某个元素上通过`(click)`监听点击事件。