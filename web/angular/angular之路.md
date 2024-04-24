# angular 之路

> 别的不多说，每次换电脑，上来就是切换成国内镜像，不科学上网下载实在太慢： `npm config set registry http://registry.npm.taobao.org/`

## 安装配置

1. 安装 `Angular CLI`

   > `npm install -g @angular/cli`

2. 测试命令是否正常：`ng v` 或者 `ng --version` 都可以

成功：

![image.png](https://i.loli.net/2020/08/20/IX9kUOtwj6eErgc.png)

注意：

* 如果显示命令不存在，则尝试卸载重新安装

``` bash
# 卸载已安装脚手架
npm uninstall -g @angular/cli
# 清除缓存
npm cache clean
# 强制再安装一次
npm install -g --force @angular/cli
```

* 如果还不行，则应该是环境变量配置的问题
* 因为在我这台电脑上的账号是`foo`，则其`ng.cmd`文件所在路径应该为`C:\Users\foo\AppData\Roaming\npm`
* 将其加入到环境变量的`path`上即可
* 如果该路径找不到，则直接在电脑里搜索`ng.cmd`找到对应目录即可

3. 如何创建和启动新项目：

``` bash
# 创建新项目
ng new my-first-project
# 进入新项目目录
cd my-first-project
# 启动新项目
ng serve
# 默认地址是http://localhost:4200/

# 打包构建
ng build --prod
```

> 也可使用 `npm start` 来启动服务，追加后缀可指定端口： `npm start --port 8888`

> 自动打开浏览器可加后缀： `-o`

> 脚手架创建新项目，在自动生成好项目骨架之后，会立即自动使用 `npm` 来安装所依赖的 `Node` 模块；因此，如果你使用的是 `cnpm` ，则需要 Ctrl+C 终止掉，然后自己进入项目的根目录，使用 `cnpm` 来进行安装。

> 更多后缀：[Angular CLI 终极指南](https://segmentfault.com/a/1190000009771946)

## 创建指令

1. 自动创建组件：

``` bash
ng generate component MyComponent
# 缩写创建组件
ng g c xxx
```

* 指定在`header`目录下创建：`ng generate component header/MyHeader`
* 命令可方便快捷地直接在`src/app/`下创建对应的组件目录与文件，而不需要像`vue`一样手动创建：

![image.png](https://i.loli.net/2020/08/20/oyRniueVxXCth1a.png)

2. 自动创建指令：`ng g d MyDirective`
3. 自动创建服务：`ng g s MyService`
4. 自动创建模块：`ng g m MyModule`

## angualar 项目目录结构

> [模块、组件和服务都是使用装饰器的类，这装饰器会标出它们的类型并提供元数据，以告知 Angular 该如何使用它们。](https://angular.cn/guide/architecture#introduction-to-angular-concepts)

### NgModule - 模块

* 每个 Angular 应用都有一个根模块，通常命名为 `AppModule`。根模块提供了用来启动应用的引导机制。
* `NgModule` 为其中的组件提供了一个编译上下文环境。根模块总会有一个根组件，并在引导期间创建它。
* 模块里最少有一个组件，那些属于这个 `NgModule` 的组件会共享同一个编译上下文环境。
* 应该类似于 包 机制。
* 我将 模块 理解为 该项目的最小独立功能单元

示例：

``` js
// app.module.ts
// 导入模块的原因
// 当你想要在浏览器中运行应用时
import {
    BrowserModule
} from "@angular/platform-browser";
// Angular核心模块
import {
    NgModule
} from "@angular/core";
// 双向绑定需要导入该项
import {
    FormsModule
} from "@angular/forms";
// Angular路由模块
import {
    AppRoutingModule
} from "./app-routing.module";
// 根组件
import {
    AppComponent
} from "./app.component";

@NgModule({
    // 属于本 NgModule 的组件、指令、管道。
    declarations: [AppComponent],
    // 导入哪些模块使用
    imports: [BrowserModule, AppRoutingModule, FormsModule],
    // 配置项目所需要的的服务
    providers: [],
    // 应用的主视图，称为根组件。
    // 它是应用中所有其它视图的宿主。只有根模块才应该设置这个 bootstrap 属性。
    bootstrap: [AppComponent],
})
// 将本模块的哪些东西导出给其他模块使用
// 根模块不需要导出任何东西，其他模块才需要
export class AppModule {}

// 更多信息：https://angular.cn/guide/architecture-modules
```

### 组件

* 组件分为 模板 html、样式 css、行为 ts 文件
* 我将 组件 理解为 渲染视图（界面）的最小单元

示例：

``` js
// app.component.ts
// 从 @angular/core 库中导入 Angular 的 Component 装饰器
import {
    Component
} from '@angular/core';

// @Component 装饰器需要传入元数据参数
@Component({
    // 组件名
    selector: 'app-root',
    // 组件模版文件路径
    templateUrl: './app.component.html',
    // 组件样式文件路径
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    inputText = '';
    title = '6666';
    flag = false;
    obj = {
        a: 666
    };
    message = ['Hello Vue.js!', 'Hello!', ' Vue.js!', 'e.js!'];
    url = 'https://i.loli.net/2020/08/21/TC1EcVAZUMwsujN.png';
    time = new Date();
    // 方法声明
    public changeShow(e: any): void {
        console.log(e.target.value);
        this.flag = !this.flag;
    }
    public onEnter(): void {
        // console.log(this.box.offsetHeight);
    }
    consoleInput() {
        console.log(this.inputText);
    }
}
// public声明公共的，可被其他模块import 导入使用
```

### 服务

* 模块之间 共同的方法与数据共享，通过 依赖注入 使用

  > 与视图耦合度不高，可复用或者功能较独立的东西，我觉得抽离到服务里再使用比较合适

> 常用于 `api` 请求

## angualar 的 api 与 vue 的 api 对比

### 数据存放

`Vue` 存放在 `vue` 实例对象的 `data` 里，而 `Angular` 则存放在 当前 html 同名的 `.ts` 文件 `export class AppComponent {}` 内部

代码对比：

``` js
// vue数据存放
new Vue({
    el: '#app',
    data: {
        flag： false,
        message: ['Hello Vue.js!', 'Hello!', ' Vue.js!', 'e.js!']
    }
})
// angular数据存放
export class AppComponent {
    flag = false;
    message = ['Hello Vue.js!', 'Hello!', ' Vue.js!', 'e.js!'];
}
```

> 为了方便我们刚开始学习，通过[stackblitz](https://angular.cn/generated/live-examples/getting-started-v0/stackblitz.html)在线创建运行 `Angualar` 项目有助于我们加深对 `api` 的理解。

### `v-for` ---> `*ngFor`

> 代码对比：

``` html
<!-- vue语法，in 和 of都有效果，但官网是in，不可在前面写let之类的声明关键字，且必需加上key配合diff算法使用 -->
<div v-for="(item,index) in arrData">
    <div :key="index">{{item}}</div>
</div>
<!-- angular语法 -->
<div *ngFor="let item of products">
    <div>{{ item }}</div>
    <!-- <div>{{ item.name }}</div> -->
</div>
```

> 注意：

* `*ngFor` 类似于`for...of...`，实际是 `ngForOf`的缩写，因此里面只能用 `of`。
* 经测试，不用`let`，用`const`、`var`依旧报错。
* 想使用索引的话：

``` html
<!-- 效果等于let i = index -->
<!-- 还支持显示长度：count as length -->
<div *ngFor="let item of message; index as i">
    <div>{{ i }}----{{ item }}</div>
</div>
```

* 此外需要注意，在`angular`里是想像`vue`一样使用`diff`算法来避免重复渲染相同元素必须使用`trackBy`来完成。

![](https://pic.downk.cc/item/5f88054d1cd1bbb86bfbbca2.jpg)![](https://pic.downk.cc/item/5f8810861cd1bbb86b01d0e9.jpg)

更多：

* [NgForOf 手册](https://angular.cn/api/common/NgForOf)
* [\*ngFor 解析](https://www.jianshu.com/p/432819f64a7e)

### `v-if` ---> `*ngIf`

> 代码对比：

``` html
<!-- vue语法 -->
<div v-if="flag">
    <div>我显示</div>
</div>
<!-- angular语法 -->
<div *ngIf="flag">
    <div>我显示</div>
</div>
```

** `v-if/else` ---> `*ngIf/else` **

> 代码对比：

``` html
<!-- vue语法 -->
<div id="app">
    <p v-if="flag">{{ message }}</p>
    <p v-else>我显示了</p>
</div>
<!-- angular语法 -->
<div *ngIf="flag; else elseBlock">
    <div>我显示</div>
</div>
<ng-template #elseBlock>
    <p>现在为假</p>
</ng-template>
```

* `elseBlock` 是固定的，不能改哦；`else`必须在`ng-template`上，没有语法糖简写，其属于`BrowserModule`。

* `ngSwitch`：![](https://pic.downk.cc/item/5f61c79c160a154a6771203e.jpg)
* > 注意：`*ngIf`和`*ngFor`指令都是结构型指令（以`*`开头），而`[ngSwitch]`则是属性型指令

* 和`vue`一样，`*ngIf`和`*ngFor`是有优先级冲突的，不能同时写在一个标签上。

* 非语法糖的完整写法：![](https://pic.downk.cc/item/5f8800181cd1bbb86bf78259.jpg)

### `v-show` ---> `[hidden]`

> 代码对比：

``` html
<!-- vue语法 -->
<div v-show="flag">
    <div>我显示</div>
</div>
<!-- angular语法 -->
<div [hidden]="flag">
    <div>我显示</div>
</div>
```

### `computed` ---> `get`

> 代码对比：

``` html
<!-- vue语法、angular语法 -->
<div>
    {{totalPrice}}
</div>
```

``` js
computed: {
    totalPrice() {
        return 1 + 2 + 3
    }
}
```

``` ts
// 其实是ES6语法，在类方法前面加个get即可！
// 当然，由于get调用时无法保证angular内变量初始化完成，因为如果里面使用变量最好先对变量进行下判断
get totalPrice():number {
  return 1 + 2 + 3
}
```

### `v-bind` 或者 `:` ---> `[]`

> 代码对比：

``` html
<!-- url: 'https://i.loli.net/2020/08/21/TC1EcVAZUMwsujN' -->
<!-- vue语法 -->
<div id="app">
    <img :src="url + '.png'" />
</div>
<!-- angular语法 -->
<img [src]="url + '.png'" />
```

少见写法：

``` html
<!-- 等于[href]="'https://baidu.com'" -->
<a bind-href="'https://baidu.com'">百度</a>
<!-- 部分由两个词组成的属性动态绑定时也要改为驼峰形式，不然会报错，需要注意，如我们这里的colspan属性 -->
<td [cloSpan]="cloSpan">注意属性</td>
<!-- 在HTML5中添加了data-*的方式来自定义属性，所谓data-*实际上上就是data-前缀加上自定义的属性名，使用这样的结构可以进行数据存放。 -->
<!-- 假设存在一个value变量 -->
<!-- 我们发现，当我们想绑定一个自定义属性（非HTML标签自带属性）需要在前面加上`attr.`，不然遇见`-`将会报错 -->
<span [attr.data-title]="value">自定义属性</span>
```

注意：

1. `vue`中 模板差值语法`{{}}` 适合用于双标签之间，自定义指令比如`v-bind`、`v-if`是不支持模板差值的，会当做普通字符串或者变量名处理
2. `angular`属性内是可以使用 模板插值语法的，因此，上述的 属性绑定变量也可以这样写：`<img src="{{url + '.png'}}" />`
3. 带方括号 或者 模板插值 时，等号内必须是一个变量、对象或表达式，不能是普通字符串；如果非要是字符串数据，请用 单引号包裹起来：`[src]="'https://x.xx.com/xxx.jpg'"`
4. `angular`中动态绑定样式：

``` html
<!-- 普通写法 -->
<div [class]="flag ? 'test' : ''">
    <!-- ... -->
</div>
<!-- 单个样式快速写法 -->
<!-- [class.样式名]="判断表达式" 是在应用单个class时的常用技巧 -->
<div [class.test]="flag">
    <!-- ... -->
</div>
```

* 对象形式绑定样式：![](https://pic.downk.cc/item/5f61c8d6160a154a67716525.jpg)

* > `[ngClass]="{classname1:true,className2:true}"`：适合用来设置元素的多个 `css` 类属性，如果只设置一个 `css` 类，应该使用模板绑定语法中 `class` 类绑定

* 配合循环更改样式：![](https://pic.downk.cc/item/5f61c963160a154a67717dd0.jpg)
* 动态设置行内样式：![](https://pic.downk.cc/item/5f62fd53160a154a67c74de4.jpg)

* > `[ngStyle]="{'font-style': 'italic','font-weight': 'bold','font-size': '24px'}"`：用来设置元素的多个内联样式，如果只设置一个内联样式，应该使用模板绑定语法中的样式绑定![](https://pic.downk.cc/item/5f85518d1cd1bbb86ba1cf33.jpg)

### `v-html` ---> `[innerHtml]`

> 代码对比：

``` html
<!-- vue语法 -->
<div id="app">
    <div v-html="message">测试</p>
    </div>
    <script>
        new Vue({
            el: '#app',
            data: {
                message: '<h1>innerHtml测试效果啊</h1>'
            }
        })
    </script>
    <!-- angular语法 -->
    <!-- html文件 -->
    <div [innerHtml]="content"></div>
    <!-- Js文件 -->
    export class HeaderComponent implements OnInit {
    content:string = '<h1>innerHtml测试效果啊</h1>';
    constructor() {}
    ngOnInit(): void {}
    }
```

效果：

* ![](https://pic.downk.cc/item/5f61ba9c160a154a676e12d1.jpg)
* ![](https://pic.downk.cc/item/5f61bab9160a154a676e1b7c.jpg)

### `v-on` 或者 `@` ---> `()`

> 代码对比：

``` html
<!-- vue语法 -->
<button @click="changeShow($event)">点我切换状态</button>
<div v-if="flag">我显示</div>
<div v-else>我隐藏</div>
<!-- angular语法 -->
<button (click)="changeShow($event)" #box (keyup.enter)="onEnter(box)">
    点我切换
</button>
<div *ngIf="flag; else elseBlock">
    <div>我显示</div>
</div>
<ng-template #elseBlock>
    <div>现在为假</div>
</ng-template>
```

少见写法：

``` html
<!-- 等于(click)="test()" -->
<button on-click="test()"></button>
```

注意：

1. `$event`对象为 DOM 事件对象，一般使用 `event.target.value` 来获取当前元素的值。
2. `typescript` 与 `javascript` 写法上的区别：

``` js
// vue中这样写合适
changeShow(e) {
    console.log(e);
    this.flag = !this.flag;
}
// angular中
// 推荐typescript写法，这里类型指的是键盘事件，如果鼠标的话是MouseEvent
public changeShow(e: KeyboardEvent): void {
    // 注意：不是所有的event.target都有value，因此如果我们直接打印是会报错的
    // 通过类型断言，我们显式地告诉TS这一定是一个输入事件，你不用操心并且报错了
    console.log((event.target as HTMLInputElement).value);
    this.flag = !this.flag;
}
```

3. [angular 绑定事件与监听输入](https://angular.cn/guide/user-input)

常用事件：

* `keyup`：按键弹起事件
* `key.enter`：回车事件
* `blur`：失去焦点事件
4. 阻止事件冒泡：![](https://pic.downk.cc/item/5f8557d91cd1bbb86ba5c4d1.jpg)

### `v-modal` ---> `ngModal`

作用：一般用于将表单元素（ `input` ）的 `value` 值双向绑定到某个变量上

> 代码对比：

``` html
<!-- vue语法 ref="box" -->
<input type="text" name="" id="" v-model="inputText" />
<div>{{ inputText }}</div>
<!-- angular语法 #box -->
<input type="text" name="" id="" [(ngModel)]="inputText" />
<div>{{ inputText }}</div>
```

> 其实 `[(ngModel)]` 是语法糖，完整写法是：

``` html
<input type="text" [ngModel]="username" (ngModelChange)="username = $event">
```

``` js
// vue语法获取虚拟Dom对象 .$refs.box
data: {
    inputText: "";
}
// angular语法 传入直接使用即可
inputText = "";
```

少见写法：

``` html
<!-- 等于[(ngModel)]="'繁华声遁入空门折煞了世人'" -->
<input type="text" bindon-ngModel="'繁华声遁入空门折煞了世人'" />
```

注意：

* `angular`的双向绑定指令无法直接使用，必须先导入对应的模块；
* 在`app.module.ts`中导入`FormsModule`：

``` js
// 双向绑定需要导入该项
import {
    FormsModule
} from "@angular/forms";
```

* 将要使用的模块加入到列表里：

``` js
// 导入哪些模块使用
imports: [BrowserModule, AppRoutingModule, FormsModule];
```

#### 非表单双绑 `[()]`

> `[]` 为动态绑定变量、 `()` 为监听输入；两者结合不就实现了双向绑定？

``` html
<div class="header">{{ title }}</div>
```

``` ts
// 组件Ts文件
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() title = '头部组件';
  // 注意，双绑变量区别`@Output()`用`Change`,因为是变量名 相同名是会报错
  @Output() titleChange = new EventEmitter<string>();
  constructor() {}
  ngOnInit(): void {}
}
```

``` html
<!-- 使用方式 -->
<app-header [(title)]="title"></app-header>
<button on-click="title=title+' + 1'">点我</button>
```

> `Vue` 里面的 `.sync` 与这个差不多。

### `ref` ---> `#`

> 代码对比：

``` html
<!-- vue语法 ref="box" -->
<button @click="changeShow($refs.box)">点我切换状态</button>
<div ref="box">
    <div v-if="flag">我显示</div>
    <div v-else style="width: 250px; height: 250px;">我隐藏</div>
</div>
<!-- angular语法 #box -->
<button (click)="changeShow($event)" (keyup.enter)="onEnter(box)">
    点我切换
</button>
<div [class.test]="flag" #box>
    <div *ngIf="flag; else elseBlock">
        <div>我显示</div>
    </div>
    <ng-template #elseBlock>
        <div>现在为假</div>
    </ng-template>
</div>
```

``` js
// vue语法获取虚拟Dom对象 .$refs.box
changeShow(v) {
    this.flag = !this.flag
    console.log(v.offsetHeight)
}
// angular语法 传入直接使用即可
public onEnter(v: any): void {
    console.log(v);
    console.log(v.offsetHeight)
}
```

少见写法：

``` html
<!-- 等于#testDiv -->
<div ref-testDiv>测试ref-指令</div>
<button on-click="test(testDiv)">点我</button>
```

注意：

1. `vue`可不给相应方法传入数据，直接在方法里通过`this.$refs.box`直接获得虚拟`Dom`对象
2. `angular`不传入的话，经测试通过`this`获取好像是不行的？

> 其实 `angular` 也是可以不传入直接获取元素 Dom 对象或者组件对象的

这里，我们需要使用[ `ViewChild` ](https://angular.cn/api/core/ViewChild)属性装饰器：

1. 给想要获取的元素/组件 做个`#`标记：

``` html
<div [class.test]="flag" #box>
    <div *ngIf="flag; else elseBlock">
        <div>我显示</div>
    </div>
    <ng-template #elseBlock>
        <div>现在为假</div>
    </ng-template>
</div>
```

2. 给`ts`文件导入装饰器并使用

``` ts
// 从 @angular/core 库中导入 Angular 的 Component 装饰器
import { Component, ViewChild } from "@angular/core";

export class AppComponent {
  // 通过box获取到标记的Dom对象将赋值给变量 myBox ，该变量类型为any
//   其实完整写法应该是@ViewChild('引用别名', { static: true })，第二个参数代表我们引用元素的类型，static:true表示是一个静态元素，如果我们引用元素本身标签上有*ngFor这种结构型指令则需要改为false
  @ViewChild("box") myBox: ElementRef;

  public onEnter(): void {
    // 注意，Dom对象需要用 .nativeElement 属性
    console.log(this.myBox.nativeElement.innerText);
    console.log(this.myBox.nativeElement.offsetHeight);
    // 获取Dom元素的文本内容
    console.log(this.myBox.nativeElement.textContent);
    // 操作Dom修改样式
    this.mybox.nativeElement.style.width = "200px";
    this.mybox.nativeElement.style.height = "200px";
    this.mybox.nativeElement.style.background = "pink";
  }
}
```

调用组件方法同理：

``` ts
// header.component.ts
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  public console(): void {
    console.log("调用组件方法");
  }
  constructor() {}
  ngOnInit(): void {}
}
```

``` html
<app-header #header></app-header>
```

``` ts
export class AppComponent {
// 如果非要打印，最好在ngAfterViewInit钩子里打印
  @ViewChild("header") myHeader: HeaderComponent;
//   也支持不用别名，直接使用组件名,如下也可
// @ViewChild(HeaderComponent) myHeaderCpn: HeaderComponent;

  // 方法声明
  public onEnter(): void {
    this.myHeader.console();
  }
}
```

注意： 

1. 此外还支持引用`TemplateRef`模版：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201107115254.png)

2. `@ViewChild()`对于多个同样的只会取第一个，因此我们需要知道`@ViewChildren()`可多个引入元素：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201107115452.png)

3. `Angular`不推荐我们直接通过`nativeElement`来直接修改元素，推荐使用`Renderer2`来进行操作`Dom元素`。

``` ts
constructor(private rd2: Renderer2) { }
ngAfterViewInit() {
        // 不推荐
        this.aboutElement.nativeElement.style.color = 'red';
        // 推荐Renderer2的方式，更安全，能有效防御xss攻击
        // 接受三个参数：元素对象、样式名、样式值
        this.rd2.setStyle(this.aboutElement.nativeElement, 'color', 'blue');
    }
```

### `props` ---> `@input装饰器`

_父组件向子组件传值常规用法：_

> 代码对比：

``` html
<!-- 注意，angular组件使用了ng的指令 ng g c xxx组件 创建的，自动在app.module.ts里引入了 header和home，因此不需要我们手动引入 -->

<!-- vue语法  -->
<!-- header.vue里html代码 -->
<p>{{ title }}</p>
<!-- home.vue里html代码 -->
<app-header :title="title"></app-header>
<hr />
<p>主页的内容！</p>

<!-- angular语法  -->

<!-- header.components.html里代码 -->
<p>{{ title }}</p>
<!-- home.components.html代码 -->
<app-header [title]="title"></app-header>
<hr />
<p>主页的内容！</p>
```

``` ts
// vue语法

// header.vue里javaScript代码
props: {
  title: {
    type: String,
    default: ''
  }
}

// angular语法

// header.component.ts 子组件接受并使用
// 先引入Input装饰器
import { Component, OnInit, Input } from '@angular/core'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() title: any // 用title变量存储起来
  constructor() {}
  ngOnInit(): void {}
}

// home.component.ts  父组件准备传入的变量
import { Component, OnInit } from '@angular/core'
import { HeaderComponent } from './../header/header.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public title: string = '父组件title变量'
  constructor() {}

  ngOnInit(): void {}
}
```

_父组件向子组件传值进阶用法：_

> `angular` 代码：

``` html
<!-- angular语法  -->

<!-- header.components.html里代码 -->
<p>{{ title }} --- {{ info }}</p>

<!-- home.components.html代码 -->
<!-- 分别传递了 title变量、固定字符串和父组件自己 -->
<app-header [title]="title" [info]="'你猜我传了啥'" [parent]="this"></app-header>
<hr />
<p>主页的内容！</p>
```

``` ts
// angular语法

// header.component.ts 子组件接受并使用
// 先引入Input装饰器
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @Input() title: any;
  @Input() info: string;
  @Input() parent: any;

  constructor() {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    console.log(this.info);
    this.parent.say();
  }
}

// home.component.ts  父组件准备传入的变量
import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "./../header/header.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  public title: string = "父组件title变量";
  public say(): void {
    console.log("父组件方法执行---say！");
  }
  constructor() {}

  ngOnInit(): void {}
}
```

注意事项：

1. `@Input() defineProperty: any;` -> 输入属性（用来获取父级传递过来的数据），父级向该组件传递数据时的属性就是我们定义的`defineProperty`名
2. 可以通过`set`和`get`来实现`vue`里的`watch`（小程序的`observers`）效果：

``` ts
// 引入 Input 接口
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child-component',
  templateUrl: './child-component.component.html',
  styleUrls: ['./child-component.component.scss']
})
export class ChildComponentComponent {

  // 获取父组件的数据
  // 使用 setter 对父组件的数据进行深加工
  @Input()
  set parentTitle(title: string) {
    this._title = (title && title.trim()) || '父组件的 title 属性值为空';
  }
  get parentTitle(): string {
    return this._title;
  }

  constructor() { }
}
```

### `$emit` ---> `@Output装饰器` 、 `EventEmitter`

> 使用 上面的 `ViewChild` 虽然可以做到 父组件调用执行子组件的方法，但是，这是主动调用，通过 事件触发机制，我们可以被动地由子组件触发

> **注意：子组件往外界发送的事件，父组件使用时其触发事件名不能与子组件相同，不然父组件事件不会生效**

> 代码对比：

``` html
<!-- angular语法 事件触发 -->

<!-- header.component.html代码 -->
<button (click)="handleClick()">子组件按钮</button>
<!-- home.component.html代码 -->
<app-header (headerClick)="handleClick($event)"></app-header>
<hr />
<p>主页的内容！</p>
```

``` js
// angular语法

// header.component.ts
import {
    Component,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    // 通过EventEmitter()创建一个自定义事件，再通过@Output()装饰器向外暴露这个自定义事件（事件广播）
    // 如果不需要传递参数，即emit()不传参数应该使用new EventEmitter<void>();
    @Output() headerClick: any = new EventEmitter < string > ();
    public handleClick(): void {
        console.log('子组件按钮被点击');
        this.headerClick.emit('子组件传递给父组件的内容');
    }
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
}
// home.components.ts
import {
    Component,
    OnInit
} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    public handleClick(event): void {
        console.log('父组件方法执行---', event);
    }
    constructor() {}

    ngOnInit(): void {}
}
```

`Vue代码` ：

``` html
<!-- Header.vue -->
<template>
    <div>
        <button @click="handlerClick">点我</button>
    </div>
</template>

<script>
    export default {
        name: "Header",
        props: {
            msg: String,
        },
        methods: {
            handlerClick() {
                this.$emit("headerClick", "子组件传递给父组件的方法");
            },
        },
    };
</script>
<style scoped></style>
```

``` html
<!-- Home.vue -->
<template>
    <div class="root">
        <header @headerClick="handerClick"></header>
        <hr />
        <p>主页的内容！</p>
    </div>
</template>

<script>
    import Header from "./Header";
    export default {
        name: "HelloWorld",
        props: {
            msg: String,
        },
        components: {
            Header,
        },
        methods: {
            handerClick(value) {
                console.log("父组件方法执行---", value);
            },
        },
    };
</script>
<style scoped></style>
```

### 兄弟之间的通信

通过创建服务，不同组件引入公共服务，[共享一个服务的方式来进行数据交互](https://juejin.im/post/6844904071007043591)。

### 过滤器 ---> 管道

> 代码对比：

``` html
<!-- vue语法 自定义的过滤器方法 -->
<p>{{ time | formateDate }}</p>
<!-- angular语法 内置管道 -->
<div>{{ time | date:'medium' }}</div>
<!-- 通过json管道符转换能避免展示的是[object object]信息 -->
<div>{{ jsonData | json }}</div>
```

``` js
// vue语法
filters: {
    formateDate(time) {
        return time + '-- 证明格式化过了'
    }
}
// angular语法 传入直接使用即可
time = new Date();
```

注意：

1. `vue`过滤器处理方法需要定义，而`angular`管道则内置了不少方法；更多请查看：[内置管道 Api 文档](https://angular.cn/api?type=pipe)
2. [angular 自定义管道格式方法](https://blog.csdn.net/hbiao68/article/details/84563018)
3. 管道运算符的优先级比三元运算符（ ?: ）高，且管道符支持串联。

常见的管道函数：

|管道|代码|作用|
|:-:|:-:|:-:|
| `JsonPipe` | `<p>{{products | json}}</p>` |将一个值转换成 json 字符串|
| `DatePipe` | `<p>{{date | date:'yyyy-MM-dd HH:mm:ss'}}</p>` |根据区域设置规则格式化日期值|
| `UpperCasePipe` | `<p>{{data | uppercase}}</p>` |把文本转换成全大写形式|
| `LowerCasePipe` | `<p>{{data | lowercase}}</p>` |把文本转换成全小写形式|

### 自定义指令 ---> 指令

* vue：[自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)

* angular：[指令](https://angular.cn/guide/architecture-components#directives)、[详细自定义指令](https://angular.cn/guide/attribute-directives#write-the-directive-code)

[大概步骤](https://angular.cn/guide/attribute-directives#write-the-directive-code)：

1. 终端输入：`ng generate directive highlight` - 创建 自定义指令的文件，脚手架自动生成的文件有：

* > `src/app/highlight.directive.ts`
* > `src/app/highlight.directive.spec.ts`
* > 在根模块 AppModule 中声明这个指令类

2. `src/app/highlight.directive.ts`代码：

``` js
// 导入 Angular 的 @Directive 装饰器 、还从 Angular 的 core 库中导入了一个 ElementRef 符号。
import {
    Directive,
    ElementRef
} from "@angular/core";
// 在选择器名字前面添加前缀，以确保它们不会与标准 HTML 属性冲突。 它同时减少了与第三方指令名字发生冲突的危险。
// 叫myHighlight也是可以的
@Directive({
    selector: "[appHighlight]",
})
export class HighlightDirective {
    constructor(el: ElementRef) {
        // ElementRef 通过其 nativeElement 属性给你了直接访问宿主 DOM 元素的能力。
        el.nativeElement.style.backgroundColor = "yellow";
    }
}
```

3. 使用自定义属性指令：

``` html
<!-- src/app/app.component.html -->
<p appHighlight>Highlight me!</p>
```

### 安全导航运算符(？)

vue 好像没有该功能，一般通过 `v-if` 或者 `xxx&&xxx.xx` 之类的方法间接达到类似效果

angular 代码：

``` html
<div>{{ obj?.a }}</div>
```

``` js
obj = {
    a: 666,
};
```

作用：

* 对在属性路径中出现 `null` 和 `undefined` 值进行保护；避免空指针错误导致视图渲染失败。
* 使用安全导航运算符 `?`，当 `Angular` 表达式遇到第一个空值时，它将停止对表达式的求值，并渲染出无错误的视图。（也就是空白符）

注意事项：

1. 前者`obj为例`，必须要是“正常”对象类型，数组什么的都不行
2. 后面只可以是`.属性名`，不可用`[]`
3. 主要是 处理 `null` 和 `undefined` 值；对于空对象或者属性不存在时渲染还是会报错的

### 非空运算符（!）

非空断言运算符用来告诉编译器对特定的属性不做严格的空值校验；

当属性值为 `null` 或者 `undefined` 时，不抛错误。

``` html
<!-- 不针对 `obj.name` 进行校验 -->
<span>{{obj!.name}}</span>
```

## 生命周期

* [vue 文档](https://cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)
* [angular 文档](https://angular.cn/guide/lifecycle-hooks)

生命周期示意图：

![https://www.jianshu.com/p/a2f1d54097f8](https://pic.downk.cc/item/5f646af6160a154a673ad776.jpg)

> `tips：`

* 绿色表示 指令与组件共用的生命周期钩子
* 蓝色表示 组件特有的生命周期钩子

> 指令生命周期钩子的作用及调用顺序：

1. `ngOnChanges` - 当数据绑定输入属性的值发生变化时调用（父子组件传值）

* > 父组件向子组件传的值或者值变化时会触发。

2. `ngOnInit` - 在第一次 ngOnChanges 后调用，初始化组件时会调用一次，一般是用来在构造函数之后执行组件复杂的初始化逻辑

* > **大致等于 `vue`的`created`钩子，一般用于请求数据。**

3. `ngDoCheck` - 自定义的方法，用于检测和处理值的改变

* > 数据改变后触发，可用于检测之前的操作是否如期运行。

4. `ngAfterContentInit` - 在组件内容初始化之后调用

* > 组件初始化完成后

5. `ngAfterContentChecked` - 组件每次检查内容时调用

* > 类似于上面的`ngDoCheck`相对于 数据变化 的意义，在 组件内容发生改变完成后才运行，可看作 检查阶段

6. `ngAfterViewInit` - 组件相应的视图初始化之后调用

* > **视图全部渲染完成，大致等于 `vue`的 `mouted`钩子，如果涉及到元素则在这调用。**

7. `ngAfterViewChecked` - 组件每次检查视图时调用

* > 视图发生变化时调用，在组件的生命周期中会调用多次

8. `ngOnDestroy` - 指令销毁前调用

* > 一般用来在组件销毁前执行某些操作

注意事件：

* `constructor`多用于 简单数据初始化、依赖注入，会在所有生命周期钩子之前先被调用

更多：

* [angular 生命周期 - 当然，结合上面的官方文档食用更佳！](https://www.jianshu.com/p/a2f1d54097f8)
* [Angular 生命周期完全指南](https://www.zcfy.cc/article/the-a-to-z-guide-to-angular-lifecycle)

## RxJS - 异步解决方案

之前我所知道的异步解决方案：

1. 回调函数`CallBackFunction`
2. `promise`
3. `async`和`await`

`angular` 提供一种新的异步解决方案（用法类似于 `promise` ，但更强大）

### **基础用法**：

1. 创建公共的服务（为了顺带学习下服务的使用与注入）：`ng g s service/service`
2. `service.service.ts`文件定义个异步方法

``` ts
import { Injectable } from "@angular/core";
// 引入rxjs的Observable
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  // 模拟异步返回数据
  public getRxjsData(): any {
    // 返回Observable实例
    return new Observable((oberver) => {
      // 定时器模拟异步操作
      setTimeout(() => {
        // 类似于resolve将成功的数据传递出去
        oberver.next("定时器运行完毕");
        // oberver.error('错误结果');// 类似于reject
      }, 3000);
    });
  }
  constructor() {}
}
```

3. `header.component.ts`文件引入并注入服务，获取异步返回的值：

``` ts
import { Component } from "@angular/core";
// 引入服务
import { ServiceService } from "../../service/service.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  public handleClick(): void {
    // 调用服务类里的异步方法
    // subscribe类似于promise的then方法
    this.serviceService.getRxjsData().subscribe((res) => {
      console.log("header组件接收到的数据：", res);
    });
  }
  // 依赖注入服务
  constructor(private serviceService: ServiceService) {}
}
```

### 强大之处

#### ** `unsubscribe` 取消订阅**

> 理解：异步操作依旧会执行，但是订阅会被取消，也就是说，我们之前设置 `subscribe` 不再执行。

``` html
<button (click)="handleClick()">子组件按钮</button>
<button (click)="cancleClick()">取消异步执行</button>
```

``` ts
import { Component } from "@angular/core";
// 引入服务
import { ServiceService } from "../../service/service.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  public rxjs: any;
  public handleClick(): void {
    console.log("子组件按钮被点击");
    this.rxjs = this.serviceService.getRxjsData().subscribe((res) => {
      console.log("header组件接收到的数据：", res);
    });
  }
  public cancleClick(): void {
    console.log("取消按钮被点击");
    // 取消订阅
    this.rxjs.unsubscribe();
  }
  constructor(private serviceService: ServiceService) {}
}
```

效果：点击取消按钮后不再进入之前设置的订阅回调事件里

#### ** `next` 多次传值**

`Promise` 我们知道：状态一旦更改就不可改变，因此，每个 `Promise` 对象只会 `resolve` 一个值，但 `Rxjs` 不一样，其 `next` 可一直传递出去。

通过一个 `subcribe` 订阅可以一直接收到发射过来的数据。

因此，其实 `Rxjs` 与 `Promise` 还是不一样的，它更像是个 `事件监听与订阅` 的机制。

代码示例：

1. 修改`service/service`内的异步方法，改为定时器来实现多次发射：

``` ts
import { Injectable } from "@angular/core";
// 引入rxjs的Observable
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  // 模拟异步返回数据
  public getRxjsData(): any {
    let count = 0;
    // 返回Observable实例
    return new Observable((oberver) => {
      // 定时器模拟异步操作
      setInterval(() => {
        console.log("异步操作执行了");
        // 类似于resolve将成功的数据传递出去
        oberver.next("定时器运行完毕：" + count);
        // oberver.error('错误结果');
        count++;
      }, 3000);
    });
  }
  constructor() {}
}
```

2. 其他代码不变，查看效果：

   ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919123601.png)

#### 管道和工具方法

> 查看官网中文文档：
> [RxJS 库](https://angular.cn/guide/rx-library)

## HttpClientModule - 网络请求

> 中文网：[Angular - 使用 HTTP 与后端服务进行通信](https://angular.cn/guide/http)

简单使用步骤：

1. `app.module.ts`引入`HttpClientModule`模块：

``` ts
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
// 1. 引入HttpClientModule模块
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./components/home/home.component";

@NgModule({
  declarations: [AppComponent, HeaderComponent, HomeComponent],
  // 2. 声明模块
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

2. 组件使用`HttpClient`请求数据：

``` ts
import { Component, OnInit } from "@angular/core";
// 3. 组件内引入HttpClient服务
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  // 4. 依赖注入服务
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // 5. 请求数据
    this.http.get("http://a.itying.com/api/productlist").subscribe((res) => {
      console.log(res);
    });
  }
}
```

3. 携带参数的话：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201115171109.png)

``` ts
// 此时get请求地址将会自动转换为http://a.itying.com/api/productlist?name=test&id=666
this.http.get('http://a.itying.com/api/productlist',
            {
                params: { name: 'test', id: '666' },
                // 默认监听的是body内容，如果想查看更多信息，比如返回协议头，则需要指定为response类型
                observe: 'response',
            })
            .subscribe((res) => {
                console.log(res);
            });
```

**Post 使用：**

1. 组件需要多引入个 `HttpHeaders`：

``` ts
import { HttpClient, HttpHeaders } from "@angular/common/http";
```

2. 主要代码：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919141149.png)

**JsonP 跨域请求**：

1. ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919141803.png)
2. 组件内使用主要代码：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919143119.png)

## axios - 前端最流行请求模块

`Angular` 使用：

1. 通常我们都在使用`axios`前会进行一层封装，于是我们先创建一个公共服务，方便其他组件使用：

``` bash
ng g s service/http
```

2. 创建完服务后，安装`axios`：

``` bash
npm install axios --S
```

3. 在`http.service.ts`内使用，用于与之前我的`axios封装`文章一致用法：

``` ts
import axios from "axios";
// ...更多代码请参考之前的封装文章。
```
