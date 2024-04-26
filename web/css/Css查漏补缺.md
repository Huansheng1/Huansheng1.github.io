# Css复习巩固
## 如何设置一个`12px`的字体大小
> 浏览器对设置`font-size`小于`12px`的时候，显示都为`12px`，并不会再小了。

因此，当需要字体小于`12px`的时候，可以通过`transform`属性`scale`来设置：
```css
/* 当然，其实是不建议字体小于12px的，用户体验不好 */
/* 而且强行缩放后字体会变模糊 */
.font-small-by-scale{
    transform: scale(0.82);
    /* 如果缩放后导致左边留白之前的要修正，可以指定缩放的中心位置 */
    transform-origin: left;
    /* 不过还是会导致padding和margin等数据发生变化，可能需要考虑 */
}
```
## 盒模型

每一个Html元素可以看做一个盒子，盒子目前宽高度有两种计算方式，它们就分别叫做 `标准盒模型`、`IE盒模型`：

> [CSS盒模型的面试六问你能答出几个？]( https://juejin.cn/post/6988877671606272031 )

## 如何实现居中
![](https://cdnjson.com/images/2024/04/23/imagedccc397ba4f232ea.png)

## 想在移动端实现一个 1px 的直线，怎么实现？
UI设计师要求的1px是指设备的物理像素1px，而CSS里记录的像素是逻辑像素，它们之间存在一个比例关系，通常可以用 javascript 中的 window.devicePixelRatio 来获取，也可以用媒体查询的 -webkit-min-device-pixel-ratio 来获取。当然，比例多少与设备相关。

iPhone的 devicePixelRatio==2，而 border-width: 1px; 描述的是设备独立像素，所以，border被放大到物理像素2px显示，在iPhone上就显得较粗。

1. 用伪元素 或者 直接一个元素 当边框, 设置border-bottom：1px solid #000, 根据媒体查询结合transform缩放为相应尺寸。
2. 使用box-shadow模拟边框
```css
.box-1px {
  box-shadow: inset 0px -1px 1px -1px black;
}

```
3. 在移动设备上可以使用 viewport + rem 方案；根据设备的dpr（设备像素比）来设置<meta>标签中的viewport属性，进行整体缩放页面，并且调整对应viewport的rem基准值，将1像素的边框缩小。

当devicePixelRatio=2时，设置meta如下：
```css
<meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <style>
        html {
            font-size: 11px;
        }
        body {
            padding: 1rem;
        }
        .item {
            padding: 1rem;
            border-bottom: 1px solid gray;
            font-size: 1.2rem;
        }
    </style>
    <script>
        var viewport = document.querySelector("meta[name=viewport]");
        var dpr = window.devicePixelRatio || 1;
        var scale = 1 / dpr;
        viewport.setAttribute("content", "width=device-width, initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no");

        var docEl = document.documentElement;
        var fontsize = 10 * (docEl.clientWidth / 320) + "px";
        docEl.style.fontSize = fontsize;
    </script>
</head>
<body>
    <div class="item">border-bottom: 1px solid gray;</div>
    <div class="item">border-bottom: 1px solid gray;</div>
</body>
</html>
```

## Css 的 link 和 import 的区别？
> [link和@import加载CSS文件的区别](https://juejin.cn/post/7356114363881455655?searchId=20240424102254DC94D5463020506A7C64)

1. link 是 HTML 方式，@import 是 CSS 方式：
* link：是 HTML 中的一个标签，用于在文档中引入外部资源，如样式表文件。
* @import：是 CSS 中的一个规则，用于在 CSS 文件中引入外部样式表。
2. 下载方式和性能影响：
* link：最大限度支持并行下载，多个 link 标签可以同时加载多个外部资源，有利于提高页面加载速度。
* @import：由于 @import 规则必须放在样式表的顶部，并且会导致串行下载，即在主 CSS 文件加载完成后才会加载引入的外部样式表，可能会导致页面的加载速度变慢，并出现 FOUC (文档样式短暂失效) 现象。
3. 候选样式和隐藏样式：
* link：可以通过 rel="alternate stylesheet" 属性指定候选样式表，用户可以通过浏览器设置选择不同的样式。
* @import：可以使用 @import 规则对老版本浏览器隐藏样式，因为对于不支持 CSS 的浏览器来说，@import 规则是未知的。
4. 浏览器支持和兼容性：
* link：浏览器对 link 的支持早于 @import，因此更加稳定和兼容性更好。
* @import：由于一些较老的浏览器可能不支持 @import 规则，因此在需要兼容性考虑时，要谨慎使用。
5. 使用位置和规则：
* link：可以在 HTML 文件的头部或任何位置使用。
* @import：必须在样式规则之前使用，并且只能在 CSS 文件中使用。
6. @import 一般结合脚手架可以在本地直接引入 预编译CSS文件，但是 link 是没法直接使用 预编译的css的，而且脚手架往往会自动将 @import 引入自动打包为 link标签

## Bfc与浮动
> [从几种清除浮动的方法聊到BFC](https://juejin.cn/post/6956224653526302733#comment)

## 样式文件缓存问题
> 来自[brock博客](https://www.cnblogs.com/brock/p/11673173.html)，记录下备份。
### 解决方法
一、采用`<meta>`的方式效果并不是太好
```html
<meta http-equiv="Pragma" content="no-cache">

<meta http-equiv="Cache-control" content="no-cache">

<meta http-equiv="Cache" content="no-cache">
```

二、使用`css`添加版本参数，完美解决style缓存问题 

例如： 在`css`的`Url`后面加上参数`version=1.0.0`，每次提交时修改一下版本号就可以了
```html
<link rel="stylesheet" type="text/css" href="../style/css/common-red.css?version=1.0.0">
```

### 如何使用Css隐藏一个元素？
1. display: none;：元素不会被渲染
2. visibility: hidden;：隐藏元素，但元素仍然占据页面布局空间。虽然元素不可见，但它仍然存在于文档流中，并且会影响其他元素的布局。
3. opacity: 0;：使元素完全透明，但仍然占据页面布局空间。与 visibility: hidden; 不同，元素是可见的，但是完全透明。
4. position: absolute; left: -9999px;：将元素移出页面，但保留在文档流中。元素仍然占据页面布局空间，但位置被隐藏。

### 原子化 CSS 的优缺点
> [原子化 CSS 是一种将样式拆分成小而独立的类的方法，以提高样式的复用性和可维护性。最典型的代表就是 Tailwind CSS](https://juejin.cn/post/7167290166527131684)

> 优点

1. 唯一性，更改会更安全：
  * 原子类的命名唯一，不会重复，修改时只需修改类名，而不是类的样式，不会影响其他地方。
2. 复用性强，项目大小增长曲线趋缓：
  * 尽管原子类可能会将一些 CSS 大小转移到 HTML 中，但随着使用次数的增加，这种影响会逐渐减小。
3. 降低命名负担：
  * 不再需要为每个样式类命名，减少了思考命名的烦恼。
4. 便捷的响应式、暗黑模式、悬停/聚焦等状态：
  * 原子类可以轻松地应用这些状态。

> 缺点

1. 新手额外增加的记忆负担：
  * 学习和记忆原子类需要一定的时间。
2. 蓝湖的代码无法直接复制使用：
  * 蓝湖等设计工具生成的代码无法直接复制到原子类中，需要进行转换。
3. 复杂样式类名太多难以阅读和维护：
  * 当样式变得复杂时，原子类的类名可能变得冗长，不易阅读和维护。

### flex: 0 1 auto; 是什么意思？
> [阮老师的 flex 语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

flex: 0 1 auto; 是 CSS 中的一个属性，用于设置一个 flex 容器中的子元素（flex item）的弹性布局属性。这个属性是 flex-grow, flex-shrink, 和 flex-basis 这三个属性的简写。

* flex-grow: 0; 表示 flex item 的放大比例。当所有 flex item 的空间总和小于容器空间时，是否需要放大 item 来占据剩余空间。0 表示即使有剩余空间，也不放大。
* flex-shrink: 1; 表示 flex item 的缩小比例。当所有 flex item 的空间总和大于容器空间时，是否需要缩小 item 来适应容器空间。1 表示如果空间不足，该 item 将缩小。
* flex-basis: auto; 表示在分配多余空间之前，item 占据的主轴空间（main size）。auto 表示由浏览器自动计算。

所以，flex: 0 1 auto; 的意思是，当 flex 容器有剩余空间时，该 item 不会放大；当 flex 容器空间不足时，该 item 会缩小；item 的基础宽度由浏览器自动计算。希望这个答案对你有所帮助！

### less 的 & 代表什么？
& 符号被称为“父选择器占位符”。它代表了当前选择器的父级。这个特性在你想要在一个嵌套规则内引用父级选择器时非常有用。

```less
a {
  color: black;
  &:hover {
    color: red;
  }
}
// 在这个例子中，&:hover 会被编译成 a:hover。所以，当你把鼠标悬停在一个链接上时，链接的颜色会变成红色。
```

### 如何避免 css 全局污染

1. 使用 CSS 模块（CSS Modules）：CSS Modules 是一种将 CSS 类名局部化的技术，可以确保 CSS 类名在全局范围内是唯一的，从而避免全局污染。
2. 使用 BEM（Block Element Modifier）命名规则：BEM 是一种 CSS 命名方法，通过给 CSS 类名添加命名空间，可以避免全局污染。
3. 使用 CSS-in-JS 库：如 styled-components 或 emotion，这些库可以生成唯一的类名，避免全局污染。
4. 使用 Shadow DOM：Shadow DOM 可以隔离 CSS，使其不会影响到全局或其他 Shadow DOM。
5. 使用 IIFE（立即执行函数表达式）：在 CSS 预处理器（如 LESS 或 SASS）中，可以使用 IIFE 来限制 CSS 规则的作用范围。
6. 使用组件化框架的Scope属性来自动给编译后的样式添加属性选择器。

### 重绘和重排
> [【面试系列一】如何回答如何理解重排和重绘](https://juejin.cn/post/7075515261121626119)