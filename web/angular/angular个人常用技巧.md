# Angular 个人常用技巧

## 监听浏览器宽度变化

### HostListener方式

> 生命周期函数没有适用这个需求的代码哦

``` ts
@HostListener('window:resize') onResize() {
		this.checkClientWidth();
}
checkClientWidth() {
		if (document.body.clientWidth > 992) {
		  this.isPhone = false;
		} else {
		  this.isPhone = true;
		}
}
```

### Rxjs方式

``` ts
checkClientWidth() {
		if (document.body.clientWidth > 992) {
		  this.isPhone = false;
		} else {
		  this.isPhone = true;
		}
}
// 还支持防抖哦，这里我们防抖使用100ms
fromEvent(window, 'resize').pipe(debounceTime(100)).pipe(map(this.checkClientWidth)).subscribe(() => {
    // 检测到的更新操作。。。
});
```

## 脏值检测

在 `Angular` 里通过注入服务再在 `subcribe` 订阅赋值时，界面检测不到数据的更新，因此我们需要手动告诉 `Angular` 这里发生了数据变动，快来更新视图

[我推断原因是 `Angular` 采用的 `zone.js` 检测，只对异步事件（如：键盘输入、 `Xhr` 请求、定时器等异步任务）进行检测，却没有对订阅进行检测 - 个人猜测，暂未证实。](https://angular.cn/api/core/ChangeDetectorRef)

`Angular` 默认的检测策略是一有变更就检测整个 `Angular` 视图组件树，在超大型项目这种检测就比较浪费性能，因此我们可修改检测策略为 `OnPush` 策略（该策略不对监听异步事件自动进行视图检测），这样就需要和 `markForCheck` 搭配使用。

``` ts
@Component({
//   ...其他代码
// 修改检测变更策略为OnPush策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// 先在构造函数注入
private changeDetectorRef: ChangeDetectorRef,

// 在数据更新后下面执行：
// 检测当前组件变更 - 如果组件销毁过快会在控制台报错
this.changeDetectorRef.detectChanges();
// 标记有数据更改了 - markForCheck会对在整个应用范围内都进行Change，感觉更影响性能，不推荐使用
this.changeDetectorRef.markForCheck();
```

## 阻止冒泡和默认行为

方式一：

``` html
<!-- 阻止冒泡 -->
<!-- $event.stopPropagation(); -->
<!-- 阻止默认行为 -->
<!-- $event.preventDefault(); -->
<!-- handleClick是点击触发事件，与本次讨论重点无关 -->
<button (click)="$event.stopPropagation();$event.preventDefault();handleClick($event)">阻止冒泡和默认行为</button>
```

方式二：

``` html
<button class="btn btn-primary" (click)="handleClick($event)">阻止冒泡和默认行为</button>
```

``` ts
handleClick(event) {
        event.stopPropagation();
        event.preventDefault();
        console.log('点击了。');
    }
```

方式三：

``` ts
// 监听当前组件的： 全部click事件，装饰器装饰的方法参数为$event事件
    @HostListener('click', ['$event'])
    reset(event) {
        // 将该组件全部click进行阻止冒泡处理和阻止默认行为
        event.stopPropagation();
        event.preventDefault();
    }
```
## 去除前后输入空格
1. 自定义去除输入框前后输入数据空格的指令：
```js
import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[HsInputTrim]',
})
export class InputTrimDirective {
    constructor(private control: NgControl) { }
    @HostListener('change', ['$event']) trimSpace(event) {
        // NgControl来触发ngModel更新，如果直接通过rd2或者原生方式修改无法触发ngModel更新导致表单校验会出问题
        this.control.control.setValue(event.target.value.trim());
    }
}
```
2. 在`input`上使用，输入内容完毕后会自动去除前后空格，校验也能正常运行：
```html
<input ktInputTrim type="text" class="form-control" [(ngModel)]="email" id="email" name="email" placeholder="如：xxxxxx@xx.com" maxlength="1024" #emailInput="ngModel" email>
```
## 路由问题
### history路由在开发环境刷新时报错
当我们从`hash`模式的旧式风格切换到`history`新版路由风格时，我们会发现 出现了以下几个问题:
* 如果在二级路由直接刷新或者在地址栏回车进入，会出现重定向失败，404的页面。
* 引用 CSS、脚本和图片文件时使用的相对 URL 可能出现了问题(没有基准路径自动带上了当前路由路径)

路由器默认使用 `“HTML 5 pushState”` 风格，所以你必须用一个 `<base href>` 来配置该策略（`Strategy`）。

这时我们可以通过配置 基准路径 来解决：
* 在`index.html`的`head`标签里添加`base`元素：
```html
<base href="/">
```

当然，如果你无法修改`index.html`你就可能需要通过其他方式来补救：[![WkBVET.png](https://z3.ax1x.com/2021/07/13/WkBVET.png)](https://imgtu.com/i/WkBVET)（极端情况）  

参考链接：
1. [angular中文官网- `<base href> 元素`](https://angular.cn/guide/router#base-href-1)
2. [w3cschool- `<base href> 元素`](https://www.w3cschool.cn/angulerten/angulerten-4a2v3808.html)
## 推荐文章：
1. [Angular运行性能（Runtime Performance）优化指南](https://zhuanlan.zhihu.com/p/37553497)
2. [`ExpressionChangedAfterItHasBeenCheckedError`错误分析](https://segmentfault.com/a/1190000020886310#)
3. [[Angular Directive] 输入框禁止为空字符串与自动去除空格指令](https://blog.csdn.net/t894690230/article/details/79209896)