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