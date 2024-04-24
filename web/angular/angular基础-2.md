# Angular之路 - 第二部分
## angualar  与 vue 的 语法对比
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201108180857.png)
### `slot` ---> `ng-content`

> 代码对比：
1. 创建一个组件：`ng g c components/slot`
2. 修改`slot`组件代码：
```html
<!-- vue语法，in 和 of都有效果，但官网是in，不可在前面写let之类的声明关键字，且必需加上key配合diff算法使用 -->
<div>
    vue插槽测试
    <slot></slot>
</div>
<!-- angular语法 -->
<!-- src\app\components\slot\slot.component.html -->
<div>
    ng-content插槽测试
    <ng-content></ng-content>
</div>
```
3. 其他地方使用：
```html
<!-- 其他地方使用 -->
<app-slot>
    <div>测试啊</div>
</app-slot>
```
4. 注意与`vue`的不同处：
```html
<!-- 即使只有一个ng-content但是我们依旧可以在使用的地方插入多个元素 -->
<app-slot>
    <div>测试啊</div>
    <div>测试2</div>
    <div>测试3</div>
</app-slot>
```
5. 即使里面放入多个`ng-content`依旧和一个效果一致：
```html
<!-- <ng-content> 的本质只是移动元素，并不会去自动的创建传入的模板 -->
<!-- 因此，如果传入的是自定义的组件，这些组件也只会被实例化一次。 -->
<div>
    ng-content插槽测试
    <ng-content></ng-content>
    <ng-content></ng-content>
</div>
```
6. 插入顺序会保持在`ng-content`所处位置：
```html
<!-- 这里我们放入了两个，尽管和一个生效的效果一样的，但是最终结果是在第二个ng-content位置处插入，就相当于第一个不存在 -->
<div>
    ng-content插槽测试
    <ng-content></ng-content>
    ng-content插槽测试2
    <ng-content></ng-content><!-- 也就是说使用处会将中间的东西插到这里 -->
    ng-content插槽测试3
</div>
```
7. `ng-content`还可以限制只能插入啥标签，也就是说其他标签它当做看不见：
```html
<!-- slot组件代码 -->
<div>
    ng-content插槽测试
    <ng-content select="div"></ng-content>
    ng-content插槽测试2
</div>
```
```html
<!-- 使用的地方 -->
<app-slot>
    <div>测试啊</div>
    <span>测试2</span>
    <div>测试13</div>
    6666
</app-slot>
```
我们会发现最终结果为：![](https://pic.downk.cc/item/5f8eb97c1cd1bbb86be8eff4.jpg)

8. `ngProjectAs`属性又可以使不满足的标签被选中：
```html
<!-- 使用的地方 -->
<app-slot>
    <div>测试啊</div>
    <!-- 通过ngProjectAs属性我们让span标签也可插入本来只能插入div标签的地方 -->
    <span ngProjectAs="div">测试2</span>
    <div>测试13</div>
    6666
</app-slot>
```
效果：![](https://pic.downk.cc/item/5f8f99841cd1bbb86b361fbf.jpg)

> 总结：
* 我们可以发现，其用法和`vue`里的匿名插槽差不多
* 注意：官方文档貌似都搜索不到相关信息，但确实可以正常使用的
### `slot-scope` ---> `*ngTemplateOutlet`
> 作用域插槽：结构样式由外部决定，数据使用自己内部的；也就是说：你组件内部逻辑我不管，但你怎么展示的我在用的地方要决定它。

> 代码对比：
1. 我们先来初步看下它如何使用：
```html
<div>
    ng-content插槽测试
    <!-- 语法糖，这里面传递了多个值：name是TemplateRef名，context是前面使用模板接受内容属性，myContext是我们传递过去数据，其格式为：{ 属性key名: 要传递过去的数据 }，这里我们传递过去的myContext值就是：{ data: 'Angular' } -->
    <ng-container *ngTemplateOutlet="name;context:myContext"></ng-container> 
    ng-content插槽测试2
</div>
<!-- name是模板引用对象名 -->
<!-- let定义模板内部使用的数据 -->
<!-- 格式：let-模版内部变量名='传递过来的对象属性key名' -->
<ng-template #name let-val="data">
    <hr>
    hello {{val}}
    <hr>
</ng-template>
```
* `let-`形式的模板内部变量在`<template>`、`<ng-template>`、`<ng-container>` 都支持, 但原生标签是不支持的
2. 在组件的`ts`文件里增加`myContext`变量：
```ts
//   ...上面代码
  myContext = { data: 'Angular' };
//   ...下面代码
```
3. 渲染结果：![](https://pic.downk.cc/item/5f8fa74b1cd1bbb86b3bce10.jpg)
4. 如果完整写法怎么搞，也就是说不用语法糖的写法：
```html
<!-- ngTemplateOutlet -> 引用的模板对象 -->
<!-- ngTemlateOutletContext -> 传递给模板的数据 -->
<ng-container [ngTemplateOutlet]="name" [ngTemplateOutletContext]="myContext"></ng-container>
```
5. 上面代码我们都只是简单使用，没涉及到如何在外部调用，接下来我们让模板能由外部传递：
* 组件代码：
```html
<div>
    ng-content插槽测试
    <!-- <ng-container *ngTemplateOutlet="name;context:myContext"></ng-container>  -->
    <ng-container [ngTemplateOutlet]="name" [ngTemplateOutletContext]="myContext"></ng-container>
    ng-content插槽测试2
</div>

````
```ts
import { Component, ContentChild, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.css'],
})
export class SlotComponent implements OnInit {
    <!-- 通过ContentChild定义个外部可传递进来的模板引用变量 -->
  @ContentChild(TemplateRef) name:TemplateRef<any>;
  myContext = { data: 'Angular' };
  constructor() {}

  ngOnInit(): void {}
}
```
* 调用处使用：
```html
<app-slot>
    <ng-template #name let-world="data">
        <hr>
        hello {{world}}
        <hr>
    </ng-template>
</app-slot>
```
* 效果与之前一致！

6. 配合`Input()`输入装饰器也可以实现类似插入效果：
```ts
import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.css'],
})
export class SlotComponent implements OnInit {
    // 修改之前的为Input()装饰的变量
  @Input() name:TemplateRef<any>;
  // @ContentChild(TemplateRef) name:TemplateRef<any>;
  myContext = { data: 'Angular' };
  constructor() {}

  ngOnInit(): void {}
}
```
```html
<!-- 调用处代码 -->
<app-slot [name]="name"></app-slot>
<!-- 使用处就也需要进行相应修改，当然现在的表现形式不是很像插槽，反而更像将模板引用对象传递到组件内部，不过效果是一致的 -->
<ng-template #name let-world="data">
    <hr>
    hello {{world}}
    <hr>
</ng-template>
```
### `template` ---> `ng-container`
为了避免创建多余元素，比如：`if`与`for`指令不能在同一个元素下使用，因此我们往往要引入多余的元素来控制，但是，通过`ng-container`我们可以避免在渲染结果上出现多余的标签。
## 相关文章

- [`NgTemplateOutlet`](https://angular.cn/api/common/NgTemplateOutlet)
* [`Angular 向组件传递模板的几种方法`](https://gianthard.rocks/a/23)
* [`ngTemplateOutlet指令`](https://zhuanlan.zhihu.com/p/44446232)
* [Angular 中 ngTemplateOutlet 的用法以及ng-zorro源码分析](https://my.oschina.net/u/1540190/blog/3198073)