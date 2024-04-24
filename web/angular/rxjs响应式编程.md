# Rxjs响应式编程
## 前置
### 如何在网页上调试rxjs
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/6.4.0/rxjs.umd.min.js"></script>
<button id="btn">Click</button>
<script>
    const { of, fromEvent } = rxjs;
    const { switchMap, delay } = rxjs.operators;

    fromEvent(document.getElementById('btn'), 'click').pipe(
        switchMap(e => of('some value').pipe(delay(1000)))
      )
      .subscribe(val => { console.log(val) });
</script>
```
## Rxjs初始

### `fromEvent(元素对象，事件名)

通过 `fromEvent` 可将元素事件转变为一个 `observable` 对象

``` html
<input type="text" #fromEventDemo>
<div>{{demoShow}}</div>
```

``` ts
// 声明需要的变量
@ViewChild('fromEventDemo') fromEventDemo: ElementRef;
demoShow = '';
// 在视图渲染完毕后转换
ngAfterViewInit(): void {
        // 将Input输入框的输入事件input转换为observable事件流
        // 接受两个参数，元素对象与监听事件名
        fromEvent(this.fromEventDemo.nativeElement, 'input')
            .subscribe(
                // next函数，后面两个一般也可不写
                (params: any) => {
                    this.demoShow = params.target.value;
                },
                // 错误处理函数
                error => {
                    console.log('处理异常：', error);
                },
                // complete函数，不管next和error，最后都会执行这个
                () => {
                    console.log('收尾工作');
                }
            );
    }
```

我们来解释下几个坑点：

1. 为什么要在`ngAfterViewInit`钩子函数里订阅？

> 因为，如果不在视图渲染完毕后再调用，而是在 `ngOnInit` 钩子里调用，此时的 `fromEventDemo` 变量不一定拿到了我们想要的元素对象，控制台会报 `undefined` 没有 `nativeElement` 属性

2. 为什么`fromEventDemo`对象初始化比`ngOnInit`慢？

> 这涉及到我们使用的 `ViewChild` 元数据设置不当导致的， `ViewChild` 第一个参数是 `selector` 选择器，但还有第二个参数 `options` 配置对象，让我们看一下[文档](https://angular.cn/api/core/ViewChild):

> `options` 对象有个参数 `static - 如果为true，则在运行更改检测之前解析查询结果；如果为false，则在更改检测之后解析。`

> 什么意思？意思就是，如果你 `设置引用别名` 的当前元素是静态，即 没使用 `结构型指令` 等东西改变 `元素Dom结构` ，且你想在 `ngOnInit()` 钩子函数内使用，你最好 设置 `static` 为 `true` ，反之，则为 `false` ，这时， `ViewChild` 设置的变量值没那么快初始化，就不建议在 `ngOnInit()` 里使用。

因此，如果我们想在 `ngOnInit()` 内使用该变量，其实可这样写：

``` ts
// 声明需要的变量
@ViewChild('fromEventDemo', { static: true }) fromEventDemo: ElementRef;
demoShow = '';
// 在视图渲染完毕后转换
ngOnInit(): void {
        // 代码与上面相同
    }
```

但是， `rxjs` 使用需要注意一个问题，为了避免内存泄漏，我们需要在组件销毁前取消订阅：

``` ts
    sub: Subscription;
    ngOnInit(): void {
        // 将subscribe返回的订阅对象Subscription保存，以便取消订阅
        this.sub = fromEvent(this.fromEventDemo.nativeElement,  'input')
                    .subscribe(
                        // ...代码
                        );
    }
    ngOnDestory(): void {
        // 取消订阅
        this.sub.unsubscribe();
    }
```

`rxjs` 强大之处就在于：通过管道 `pipe` 它能对事件流进行各种转换筛选等强大操作：

``` ts
this.sub = fromEvent(this.fromEventDemo.nativeElement, 'input')
            // pipe - 对事件流事件进行管道化处理
            .pipe(
                // filter筛选值不为空的事件流
                filter((params: any) => params.target.value),
                // 将事件流数据进行转换，直接给订阅者value，而不需要他们指定属性
                map((params: any) => params.target.value)
            )
            .subscribe(
                // ...代码
                        );
```

### `async` 管道符

看见上面那么一大坨，我们能不能更简单点？

答案是： 可以的，通过 `async` 管道符，我们可直接在 `html模板` 上进行 `subscribe` 订阅操作，而不再需要手动订阅取值再取消订阅！

``` html
<input type="text" #fromEventDemo>
<div>{{observable | async}}</div>
```

``` ts
// 通常在变量末尾使用$标识这是一个Observable可监听数据流
observable$: Observable<string>;

// 现在只需要这么一点代码
ngOnInit(): void {
        this.observable = fromEvent(this.fromEventDemo.nativeElement, 'input')
            .pipe(
                filter((params: any) => params.target.value),
                map((params: any) => params.target.value)
            );
    }
```

### `interval` 定时可观察对象、 `takeWhile` 操作符

为了方便我们的学习，可以通过实现一个简单的倒计时组件来熟悉它：

``` html
<div style="color:red">{{intervalTime$ | async}}</div>
```

``` ts
import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { takeWhile, map, tap } from 'rxjs/operators';

@Component({
    selector: 'app-count-down',
    templateUrl: './count-down.component.html',
    styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit {
    startTime: Date;
    fetureTime: Date;
    intervalTime$: Observable<string>;
    constructor() {
    }

    ngOnInit(): void {
        // 强烈注意，月份是从0开始的！
        this.intervalTime$ = this.computeIntervalTime(new Date(), new Date(2020, 10, 15, 19, 30));
    }

    computeIntervalTime(startTime: Date, fetureTime: Date): Observable<string> {
        // interval 内置的一个定时生成数字的observable对象，我们设置1000毫秒定时，每次产生的数字会从0开始加1
        return interval(1000)
            .pipe(
                // 显示当前倒计时，tap管道符可以不改变当前数据流来查看我们当前数据，嗯，也能改变，就是不是具体转换或者过滤，想做一些操作的意思
                tap(params => console.log(params)),
                // 先将时间转换为秒数差
                map(params => (fetureTime.getTime() - startTime.getTime()) / 1000 - params),
                // takeWhile管道符与filter不同在于 条件不满足时observable状态会变为complete完成，结束数据流
                takeWhile(params => params > 0),
                // 对需要的单位进行计算，天数结果取整，其他取余
                map((params: number) => ({
                    day: Math.floor(params / 3600 / 24),
                    hours: Math.floor(params / 3600 % 24),
                    minutes: Math.floor(params / 60 % 60),
                    seconds: Math.floor(params % 60)
                })),
                // 转换为我们想显示的字符串格式
                map(({ day, hours, minutes, seconds }) => `${day}天${hours}小时${minutes}分钟${seconds}秒`)
            );
    }
}
```

效果图：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201115162725.png)

### 一对多的可观察对象

``` ts
// Behavior比subject还强一点，如果在订阅Subject对象之前的更新，订阅者是获取不到的，但Behavior一订阅就能获取到上一次的结果
const beh$: BehaviorSubject<string> = new BehaviorSubject('初始值');
// 一对多，支持多个订阅
const sub$: Subject<string> = new Subject();
// Behavior还支持同步获取最新的一次订阅结果数据
console.log('最近的一次结果：',beh$.getValue());
```

### `switchMap` 高阶操作符
```js

```
### `combineLatest` ：[合并多个Observable创建一个Observable，其值是根据其每个输入Observable的最新值计算得出的](https://www.cnblogs.com/coppsing/p/12309875.html)。
> 与`forkJoin`不一样的在于，不是结果全部完成才合并数组返回
```js
combineLatest([Ob对象1, Ob对象2]).subscribe(result=>{
    // result:[Ob对象1请求结果,Ob对象2请求结果]
})
```

### `forkJoin` - 类似 `Promise.all`

将多个异步请求加入到一个队列，等队列里的请求全部完成后再将结果按顺序加入一个数组返回：
```js
forkJoin([Ob对象1, Ob对象2]).subscribe(result=>{

    // result:[Ob对象1请求结果,Ob对象2请求结果]

})
```
## 取消订阅
在一个组件里，我们一般会有多个`subscription`对象，为了优化性能，我一般使用两种方式：
1. 在组件里定义一个`subs`数组存放订阅对象，在组件销毁时统一取消订阅：
```ts
export class RxjsDemoComponent implements OnInit,OnDestroy {
    subs: Subscription[] = [];
    ngOnInit() {
        const sub = rxjs$.subscribe(result => {
            // ...代码
        }, err => console.log('失败：', err));
        this.subs.push(sub);
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
```
2. 在组件里定义一个`Subject`对象，所有订阅数据通过`pipe`监听该对象，如果它`终止`了，则所有监听订阅统一停止监听：
```ts
export class RxjsDemoComponent implements OnInit,OnDestroy {
    private $destory = new Subject<boolean>();
    ngOnInit() {
        rxjs$.pipe(takeUntil(this.$destory)).subscribe(result => {
            // ...代码
        }, err => console.log('失败：', err));
    }
    ngOnDestroy() {
        this.$destory.next(true);
        // 他结束则全部takeUntil了他的都取消订阅
        this.$destory.unsubscribe();
    }
}
```

## 推荐文章

* [RxJS 中文文档](https://cn.rx.js.org/)
* [Rxjs宝石图](https://rxmarbles.com/#filter)
* [响应式编程入门指南](https://hijiangtao.github.io/2020/01/13/RxJS-Introduction-and-Actions/)
* [RxJS Observable | 全栈修仙之路](http://www.semlinker.com/rxjs-observable/#Observer-Pattern)
* [使用可观察对象（Observable）来传递值](https://angular.cn/guide/observables#creating-observables)
* [rxjs简书](https://www.jianshu.com/p/1a90e39ec658)
* [用可视化来理解switchMap, concatMap, flatMap,exhaustMap](https://blog.csdn.net/weixin_34148508/article/details/88811308)