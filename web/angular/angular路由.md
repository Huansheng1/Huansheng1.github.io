# angular 路由

> [Angular - 应用内导航：路由到视图](https://angular.cn/guide/router)

## 简单配置使用路由表

由于我之前创建项目的时候，选择了 不需要路由 的选项，因此，我们当前项目是没有 路由的，因此，我们得手动安装和导入使用。

1. 控制台通过`npm`下载 `@angular/router`：

```bash
npm install @angular/router --S
```

2. 创建`router`模块：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919152928.png)

```bash
ng g m router
```

3. 创建我们可能使用到的组件，这里就不再赘述，之前已经使用过很多次了。
4. 修改`router.module.ts`文件为可用的路由模块文件：

```ts
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

// 导入路由表类型和路由模块
import { Routes, RouterModule } from '@angular/router'
// 导入路由表内要使用的组件
import { HomeComponent } from '../components/home/home.component'
import { UserComponent } from '../components/user/user.component'
import { AboutComponent } from '../components/about/about.component'
import { ErrorComponent } from '../components/error/error.component'
// 定义静态路由表
// 不支持vue中的懒加载写法：()=>import('../components/home/home.component')
const routes: Routes = [
  // 如果地址匹配的是/home，那么路由视图展现HomeComponents内容
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  // 如果路由地址为空，则默认跳转到home地址，注意，pathMatch必须设置，一般设为full
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // 如果上面全部不匹配则默认展现ErrorComponent视图，注意，因为angularJs用的*，后面的angular就采用的**来表示地址通配符
  {
    path: '**',
    component: ErrorComponent,
  },
]

@NgModule({
  declarations: [],
  // 导入模块并使用路由表
  // 默认是history，如果想要哈希模式则可如下开启哈希（按道理history模式在路由地址里刷新会404，但我测试却没问题，很奇怪）
  imports: [CommonModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRouterModule {}
```

5. `app.component.html`显示路由：

```html
<div>非路由视图的内容</div>
<hr />
<!-- 路由视图占位符 -->
<router-outlet></router-outlet>
```

6. `app.module.ts`：

```ts
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
// 引入HttpClientModule模块
import { HttpClientModule } from '@angular/common/http'
// 引入我们创建的路由模块
import { AppRouterModule } from './router/router.module'
// 脚手架自动引入的组件
import { AppComponent } from './app.component'
import { HeaderComponent } from './components/header/header.component'
import { HomeComponent } from './components/home/home.component'
import { UserComponent } from './components/user/user.component'
import { AboutComponent } from './components/about/about.component'
import { ErrorComponent } from './components/error/error.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    UserComponent,
    AboutComponent,
    ErrorComponent,
  ],
  // 声明模块
  imports: [BrowserModule, HttpClientModule, AppRouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## routerLink 点击元素跳转路由

> 重点：`routLink`属性和`routerActive`属性

导航栏制作：

1. `header.component.html`：

```html
<!-- 注意，这里我测试了，router-link写法是无效的。。。。 -->
<div class="header">
  <a routerLink="/home">主页</a>
  <a routerLink="/user">用户</a>
  <a routerLink="/about">关于</a>
  <a routerLink="/404">错误</a>
</div>
```

- 安装了插件的快捷提示：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919164554.png)

2. `app.component.html`：

```html
<app-header></app-header>
<hr />
<!-- 路由视图占位符 -->
<router-outlet></router-outlet>
```

效果展示：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919164245.png)

3. 路由活跃时类名：

```html
<!-- header.component.html -->
<div class="header">
  <a routerLinkActive="active" routerLink="/home">主页</a>
  <a routerLinkActive="active" routerLink="/user">用户</a>
  <a routerLinkActive="active" routerLink="/about">关于</a>
  <a routerLinkActive="active" routerLink="/404">错误</a>
</div>
```

4. `header.component.css`样式调整：

```css
.header {
  display: flex;
  justify-content: space-evenly;
  background-color: #000;
  width: 100%;
}
.header a {
  padding: 12px 24px;
  color: #fff;
  background-color: #000;
  border: 1px solid #fff;
  margin: 8px 30px;
}
/* 注意样式优先级问题，不加!important上面的样式优先级比下面的大 */
.active {
  color: red !important;
}
```
效果展示：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919165340.png)

## 动态路由与JS跳转
### Hmtl跳转
#### Get传值
地址栏表现形式：`https://hs.xuexizuoye.com?key=1&value=huansheng`

使用步骤：
1. 创建一个新的组件，用来接受`Get`形式的参数，控制台输入：
```bash
ng g c components/news
```
2. 配置`news.component.html`文件：
```html
<p>news works!</p>
<hr />
<div>新闻：</div>
<hr />
<!-- 使用管道来序列化展现当前接受到路由传值数据 -->
<div style="background-color: #000; color: #fff">
  {{ queryParamsData | json }}
</div>
```
3. `news.component.ts`代码：
```ts
import { Component, OnInit } from '@angular/core';
// 引入服务
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
  // private只能在NewsComponent里使用，protected也只能在当前类与子类里使用，html都无法使用
  public queryParamsData: any;
  // 依赖注入
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    console.log(this.route);
    // 注意，this.route.queryParams返回的对象是异步的Rxjs对象
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      this.queryParamsData = res;
    });
  }
}
```
4. `home.component.html`代码：
```html
<p>主页的内容！</p>
<p>主页的内容！</p>
<p>主页的内容！</p>
<p>主页的内容！</p>
<p>主页的内容！</p>
<hr />
<ul>
  <!-- 注意，queryParams的值必须是个对象类型的，如果格式不对，路由接受到的数据将会是个空对象 -->
  <a *ngFor="let item of [1,2,3,4,5,6,7,8]; let i = index" routerLink="/news" [queryParams]="{'name':item,'index':i}">{{ item }}个新闻啊</a>
</ul>
```
5. 配置路由表：
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 导入路由表类型和路由模块
import { Routes, RouterModule } from '@angular/router';
// 导入路由表内要使用的组件
import { HomeComponent } from '../components/home/home.component';
import { NewsComponent } from '../components/news/news.component';
// 定义静态路由表
// 不支持vue中的懒加载写法：()=>import('../components/home/home.component')
const routes: Routes = [
  // 如果地址匹配的是/home，那么路由视图展现HomeComponents内容
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'news',
    component: NewsComponent,
  },
  // 如果路由地址为空，则默认跳转到home地址，注意，pathMatch必须设置，一般设为full
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // 如果上面全部不匹配则默认展现ErrorComponent视图，注意，因为angularJs用的*，后面的angular就采用的**来表示地址通配符
  {
    path: '**',
    component: ErrorComponent,
  },
];

@NgModule({
  declarations: [],
  // 导入模块并使用路由表
  // 默认是history，如果想要哈希模式则可如下开启哈希（按道理history模式在路由地址里刷新会404，但我测试却没问题，很奇怪）
  imports: [CommonModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRouterModule {}
```
效果展示：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919174234.png)
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919174210.png)
#### 动态传值
地址栏表现形式：`https://hs.xuexizuoye.com/666`

使用步骤：
1. 修改路由表：
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 导入路由表类型和路由模块
import { Routes, RouterModule } from '@angular/router';
// 导入路由表内要使用的组件
import { HomeComponent } from '../components/home/home.component';
import { NewsComponent } from '../components/news/news.component';
// 定义静态路由表
// 不支持vue中的懒加载写法：()=>import('../components/home/home.component')
const routes: Routes = [
  // 如果地址匹配的是/home，那么路由视图展现HomeComponents内容
  {
    path: 'home',
    component: HomeComponent,
  },
  // 动态路由，这个userId就决定了params的键名
  {
    path: 'news/:userId',
    component: NewsComponent,
  },
  // 如果路由地址为空，则默认跳转到home地址，注意，pathMatch必须设置，一般设为full
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // 如果上面全部不匹配则默认展现ErrorComponent视图，注意，因为angularJs用的*，后面的angular就采用的**来表示地址通配符
  {
    path: '**',
    component: ErrorComponent,
  },
];

@NgModule({
  declarations: [],
  // 导入模块并使用路由表
  // 默认是history，如果想要哈希模式则可如下开启哈希（按道理history模式在路由地址里刷新会404，但我测试却没问题，很奇怪）
  imports: [CommonModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRouterModule {}
```
2. `news.component.ts`代码：
```ts
import { Component, OnInit } from '@angular/core';
// 引入服务
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
  // private只能在NewsComponent里使用，protected也只能在当前类与子类里使用，html都无法使用
  public queryParamsData: any;
  // 依赖注入
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    console.log(this.route);
    // 注意，动态传值的参数是params对象
    this.route.params.subscribe((res) => {
      console.log(res);
      this.queryParamsData = res;
    });
  }
}
```
3. `home.component.html`代码：
```html
<p>主页的内容！</p>
<p>主页的内容！</p>
<p>主页的内容！</p>
<p>主页的内容！</p>
<p>主页的内容！</p>
<hr />
<ul>
  <!-- 注意，routerLink这里可传入第二个参数哦 -->
  <a *ngFor="let item of [1,2,3,4,5,6,7,8]; let i = index" [routerLink]="['/news',i]">{{ item }}个新闻啊</a>
</ul>
```
效果：
* 地址：`http://localhost:4200/#/news/7`
* 效果图：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919175258.png)
### Js跳转

上面的一般用于导航栏或者按钮跳转，而`javascript`切换路由 常用于 某个条件触发后自动跳转，如：当前用户权限不足跳转登录页、注册页等等。

#### 动态传值
1. `home.component.html`代码：
```html
<p>主页的内容！</p>
<p>主页的内容！</p>
<p>主页的内容！</p>
<p>主页的内容！</p>
<p>主页的内容！</p>
<hr />
<ul>
  <button *ngFor="let item of [1,2,3,4,5,6,7,8]; let i = index" (click)="handlerClick(item)">{{ item }}个新闻按钮</button>
</ul>
```
2. `home.component.ts`代码：
```ts
import { Component, OnInit } from '@angular/core';
// 注意，引入了路由服务
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public handlerClick(i): void {
    this.route.navigate(['/news', i]);
  }
  // 依赖注入
  constructor(private route: Router) {}
}

```
3. 其他保存和之前一致

效果图：
* ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919180757.png)
* 跳转地址：http://localhost:4200/#/news/6
* ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919180718.png)

#### Get传值

1. 配置引入`NavigationExtras`服务：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919181420.png)
```ts
import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public handlerClick(i): void {
    let queryParams: NavigationExtras = {
      queryParams: {
        userId: i,
        more: 'test',
      },
    };
    this.route.navigate(['/news'], queryParams);
  }
  // 依赖注入
  constructor(private route: Router) {}
}
```
2. 将路由配置表的动态路由还原：
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 导入路由表类型和路由模块
import { Routes, RouterModule } from '@angular/router';
// 导入路由表内要使用的组件
import { HomeComponent } from '../components/home/home.component';
import { NewsComponent } from '../components/news/news.component';
// 定义静态路由表
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'news',
    component: NewsComponent,
  },
  // 如果路由地址为空，则默认跳转到home地址，注意，pathMatch必须设置，一般设为full
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRouterModule {}
```
3. `news.component.ts`代码：
```ts
import { Component, OnInit } from '@angular/core';
// 引入服务
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
  public queryParamsData: any;
  // 依赖注入
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    console.log(this.route);
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      this.queryParamsData = res;
    });
  }
}
```
效果展示：
* 准备点击：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919182147.png)
* 跳转地址：http://localhost:4200/#/news?userId=3&more=test
* 效果图：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919182130.png)

## 路由嵌套/父子路由
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919184425.png)
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200919184447.png)
与`vue`类似，通过 配置路由表的`children`属性与`<router-outlet>`标签实现，不再赘述，请参考文档：[Angular - 子路由组件](https://angular.cn/guide/router#a-crisis-center-with-child-routes)

## 模块懒加载
> [Angular - 惰性加载特性模块](https://angular.cn/guide/lazy-loading-ngmodules)

之前，我们曾提到过，在静态路由表里试图通过`箭头函数配合import()`实现 组件懒加载，结果不行；

经过官方寻找，最后我们可以知道：`angular`模块块思想比较重要，因此，`Angular`懒加载的单位是 模块！

如果我们需要对大型项目进行懒加载处理，可如下做法：

1. 将 组件抽离到 单独的模块
* 创建模块时，由于我们是为了路由懒加载，因此建议加上参数创建 带路由的模块：`ng g m modules/demo --routing`
2. 对模块进行懒惰加载操作

