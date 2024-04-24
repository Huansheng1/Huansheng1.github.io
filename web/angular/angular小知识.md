# Angular小知识
## 服务：组件级注入与模块注入
> `组件级注入`为`非单例模式`，不同组件的服务实例是不一样的；而 `模块注入`为`单例模式`，不同组件里使用的服务依旧为同一个实例。
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031115847.png)![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031115905.png)

详解：  
1. ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031104751.png)  
 根据官方文档，服务注入机制我们可理解为类似于原型链，当前组件如果使用`依赖注入`的服务，会从下而上一层一层模块中寻找使用是否已经有了注入的服务实例，那么，模块注入时根模块注入我们明白了下面的子模块都能找到服务，因此使用一个服务实例，那么在不同组件当前的模块中注入的服务是否为一个呢？

2. ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031105306.png)
这就是为什么 `模块注入时不管是在根模块注入还是在不同模块`进行注入，依旧`为同一实例`；因为默认的加载方式是`急性加载`，如果我们想要某个服务只在指定模块中使用则可通过将该模块`惰性加载`方式来避免这一问题。


> 在服务装饰器`providedIn`声明给那个模块使用可让 `Angular`明白该服务可不可以被`摇掉`，在模块装饰器`provides`或者组件装饰器`provides`声明则无法被摇。

详解：  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031105919.png)

## 组件封装模式修改
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031110605.png)

通过该设置，组件的`class`类名不再会进行特殊处理来使得只在组件内生效，不然如果开启的话你需要特别注意`class`名是否合理，因为其会污染全局样式！


![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031111250.png)  
此外，如果试过在变量里加上`style`样式你会发现依旧是无法生效的，但这个出现原理与上面的原理不同，上面的是对`class`选择器进行处理，避免全局样式污染，而屏蔽变量内样式的原因是因为为了防止`xss`攻击，我们通过`domSanitizer`对其进行转换即可解决该问题：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031110947.png)

当然，如果你这样做了，你需要确保你这个变量确实安全。

最后，我们来提一下`::deep`模式：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031111645.png)

通过`::ng-deep`我们可使得该选择器避免被局部化处理，也就是说该`class`选择器最终编译出来的不再会是额外加上`属性选择器`处理后的局部样式，而是变为了一个全局样式，可是在这里我们只是想让父组件的样式能够影响子组件，而不是变成全局样式，污染兄弟组件；

因此，我们可通过`:host`限制宿主元素，这里就表示在该选择器加上父元素属性选择器，来使得该样式只在父组件的组件树（父组件自身与其子孙元素），从而避免影响兄弟组件样式的问题！

## 组件封装与双向绑定
表单自带的双向绑定与变化时监听事件：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031113229.png)

由于我很少遇见这种写法，待定。。。

## 生命周期、`View`、`Content`
1. `constructor`构造函数执行时`@Input`输入属性还没有值，初始化方法应该在`ngOnInit`钩子函数里调用![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031115041.png)
2. `View`指的是通过`#`直接调用子组件，而`Content`仅仅只是`ng-content`内容：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201031114446.png)

> 以上内容，记录自[Angular』初学者必踩的十个坑](https://www.bilibili.com/video/BV1sZ4y1x7pP?from=search&seid=8078396507219473471)，用于我个人笔记，不支持商业用途。

## 组件改造为带视图的指令
> 适用于将某个弹出层：弹窗、提示之类的，改为指令，以便直接使用

0. 以一个现成的 组件为例：`component-directive-demo`
1. 改造`Component`装饰器：
```ts
@Component({
    // 将组件选择器改为了属性选择器
    selector: '[component-directive-demo]',
    templateUrl: './component-directive-demo.component.html',
    styleUrls: ['./component-directive-demo.component.scss'],
    providers: [
        HelperPipe
    ]
})
```
2. 改造`html`文件：
```html
<!-- xxx原来布局代码 -->

<!-- 增加一行插槽 -->
<ng-content></ng-content>
```

由此，我们可以发现：组件真的是带视图的指令

## 宿主事件监听
`Angular`里面的宿主事件监听有两种：
1. 通过`Renderer2`的`listen`方法：
```ts
    // 监听某个dom元素的html事件：不支持组件的自定义事件、绑定的指令的事件
    this.rd2.listen(this.el?.nativeElement, 'error', func);
```
2. 通过`HostListener`监听：
```ts
    // 还可以监听某个第三方插件的状态变更事件
    @HostListener('某个指令的自定义事件', ['$event']) listenTestEvent = (result) => {
        // 处理代码
    }
```
之前我试图用`rd2`监听某个指令的事件，结果发现不行，所以建议能用`HostListener`最好不要用别的。
## 开发模式和生产模式自定义`Input`的注意事项
```ts
// 因为某个指令，需要传入 lazyLoad 属性来输入数据；我想在另一个指令里 检测某个元素上是否存在该指令
// 经过观察 元素，我发现 当给某个组件传入 [lazyLoad]="xxx"时，元素上会有 ng-reflect-驼峰表示法 的方式存在某个属性
// 结果就这样写了
if (!this.el.nativeElement?.attributes.hasOwnProperty('ng-reflect-lazy-image')){
    // 如果存在某个懒加载指令
}
// 但是随后发现，生产环境上相关代码不生效；
// 定位发现 生产打包环境 没有 ng-reflect-驼峰表示法 模式的属性！
```
不要试图使用`hasOwnProperty`来检测`html`标签上某个指令是否存在，因为该属性只在本地开发`ng serve`上出现，`ng build --prod`后运行是没有的！