# HTML面试知识

> [主要内容源自「2021」前端面试题之HTML篇](https://www.yuque.com/cuggz/interview/gme0bw)

## 常见知识

### src与href的区别

```html
<head>
    <!-- 注意：必须要用rel标识这个引用是样式表，不然不生效的 -->
    <link href="./sty1.css" rel="stylesheet" />
    <style>
        @import url(./sty2.css);
    </style>
</head>
```

* `src`：将其指向的资源下载并应用到文档中，比如 `JavaScript` 脚本，`img` 图片；这是一个替换操作，将资源替换到当前标签里，因此，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片也如此。这也是为什么建议把 `js` 脚本放在底部而不是头部的原因。

* `href`：超文本资源引用 - 向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的联系；所以，其是并行下载资源并且不会停止对当前文档的处理。

> 注意点一： `CSS` 建议使用 `link` 方式加载 `CSS` ，而不是使用 `@import` 方式。

原因有三：
1. `@import` 只支持 `CSS`，`link`支持不限于 `CSS`的导入
2. `link` 是 `XHTML` 标签，无兼容问题；`@import` 则是在 `CSS2.1` 提出的，低版本的浏览器不支持。
3. `link` 引用 `CSS` 时，在页面载入时同时加载；`@import` 需要页面完全载入以后再加载。

> 注意点二： `CSS` 的 `@import` 方式推荐采用 `@import url(style.css)` 的形式，因为其字符最少且兼容性最好。

### 对HTML语义化的理解

通俗点：[正确的标签做正确的事](https://www.yuque.com/cuggz/interview/gme0bw#2526e56666786604b36e9d839b72bcff)

* 让搜索引擎更容易理解内容，有利于SEO
* 让机器更容易理解内容，方便听力障碍者访问，或者支持有些自带的生成目录功能
* 让开发者更容易理解阅读

### DOCTYPE(⽂档类型) 的作⽤

#### `DOCTYPE` ：标准通用标记语言的文档类型， `WEB` 网页历史上有 `html` 或 `xhtml` 两种，但是我们可以细分下：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/00ba097c8aaa83498e12f58a9b6fe813_cdeb5081-4ec6-4a5d-9c3b-3cc226e061b3-700991.jpg)

1. `HTML4.x`（再远古的`WEB`文档规范就不提了）：上一个HTML标准HTML 4.01发布于1999年12月24日，严重阻碍了当时互联网的发展；由于其对流媒体和网络游戏的支持度几乎没有，导致当时`flash`这个浏览器插件火爆一时，被`adobe`这个商业公司攫取了大量利益，而此时微软推出的`IE`由于系统捆绑，占据了大量的市场，为了打破这一困境 - 规范混乱，支持功能匮乏且被其他公司垄断，`Opera, Mozilla和Chrome, Safari`等浏览器厂商就表示我不和`W3C`玩了，一起成立了`WHATWG`来制定新一代的`WEB`规范 - `HTML5`，因此，此时`W3C`组织（之前制定`HTML`规范的机构）里的大浏览器公司就微软还在那，`W3C`这时还在更新从`HTML4`分离出来的`XHTML`规范；但是后来`W3C`发现浏览器厂商如果都支持`HTML5`规范的话，那么开发者都会选择投入他们的怀抱，不得已，迫于开发者和市场表现，`W3C`和`WHATWG`重新合作，一起商讨`HTML5`草案并提出；然而，在2012年，W3C和WHATWG再度分道扬镳。而两者的分歧在于WHATWG 集中于演进“living”标准，而 W3C 坚持使用传统的数字编号系统定义静态的“snapshots”。 WHATWG希望构建互联网的最后一个标准，即一个随着互联网发展不断更新的HTML5标准。他们认为W3C的HTML5标准一旦制定完成，即便出现错误也无法修正。而且他们认为W3C的标准制定模式太过复杂，每一代标准的制定时间过长，不符合互联网的发展速度。

> 提示：因此如果 `WHATWG` 和 `W3C` 规范不一致，那估计还是以 `WHATWG` 规范为准，尽管 `W3C` 组织从历史上来看是 `HTML` 官方组织，但是如果浏览器厂商大部分不支持，你觉得作为开发者以谁为准不是很明显么？

2. `HTML5`（现在的主流现代版本）：狭义上，HTML5是HTML的第五个版本，广义上，HTML5是HTML5、CSS3、Javascript 2.0的统称。`HTML5`里没有`XHTML`这个分支了。

* XHTML 1就是HTML 4.01的XML化，是一种不向前兼容的格式。

* HTML 4.01 中的 doctype 需要对 DTD 进行引用，因为 HTML 4.01 基于 SGML。

* SGML规定了在文档中嵌入描述标记的标准格式，指定了描述文档结构的标准方法，目前在WEB上使用的HTML格式便是使用固定标签集的一种 SGML文档（HTML5例外，其不基于SGML）。

#### `Document Type Declaration` ：简称： `DTD` ，一种标准通用标记语言的文档类型声明，它的目的是告诉浏览器的解析器按照哪种规范的渲染模式来进行对当前文档的渲染：

标准格式：

```html
<!DOCTYPE　html 　PUBLIC　"引用的字符串"　--公共标识符-->
```

在 `HTML4. X` 版本，文档类型分为三种（ `XHTML` 同理）：
* 过渡型`Transitiona`：很不严格的文档类型定义；可包含 W3C 所期望移入样式表的呈现属性和元素。如果您的读者使用了不支持层叠样式表（CSS）的浏览器以至于您不得不使用 HTML 的呈现特性时，请使用此类型

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML4.01 Transitiona//EN""http://www.w3.org/TR/html4/loose.dtd">
```

* 严格型`Strict`：严格的文档类型定义，不允许使用任何表现层的标示和属性；如果您需要干净的标记，与层叠样式表（CSS）配合使用，免于表现层的混乱，请使用此类型。

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

* 框架型`Frameset`：针对于框架的，当页面上有框架的时候就要使用这个文档类型定义；应当被用于带有框架的文档。除 frameset 元素取代了 body 元素之外，Frameset DTD 等同于 Transitional DTD

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
```

在 `HTML5` 里就很简单了，没有多种类型：

```html
<!-- HTML5 不基于 SGML ，因此不需要对 DTD 进⾏引⽤，但是需要 doctype 来规范浏览器的⾏为
⽽ HTML4.01 基于 SGML ,所以需要对 DTD 进⾏引⽤，才能告知浏览器⽂档所使⽤的⽂档类型 -->
<!DOCTYPE HTML>
```

所以文档类型的声明很简单，就是定义了浏览器最好用哪种 `HTML` 规范解析当前文档？没错，但要完整理解，我们还要知道 **浏览器的解析模式也是有种类的！**

浏览器渲染页面有两种模式（ `JavaScript` 通过 `document.compatMode` 获取）：
1. `CSS1Compat：标准模式（Strick mode）`，浏览器使用W3C的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
2. `BackCompat：怪异模式、混杂模式、兼容模式(Quick mode 或 Standards mode)`，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示。混杂模式通常模拟老式浏览器的行为，以防止老站点无法工作。

```html
<!-- 包含过渡DTD和URI的DOCTYPE也导致页面以标准模式呈现，但是有过渡DTD而没有URI会导致页面以混杂模式呈现。 -->
DOCTYPE未声明或者格式不正确时：浏览器以怪异模式渲染
DOCTYPE声明：浏览器大多以标准模式渲染
```

因此，简而言之， `DTD` 就是告诉浏览器以标准模式渲染，这才是它的真正作用。

```html
<!-- document.compatMode输出： -->
标准模式：CSS1Compat
怪异模式：BackCompat
```

[贴上不错的总结](https://github.com/haizlin/fe-interview/issues/967)：  
1. Doctype的作用 
    文档类型声明，作用是防止浏览器在渲染html文档时，切换到我们称之为怪异模式（兼容模式）的渲染模式。

2. Doctype文档类型的种类  
   （1）在 HTML 4.01和XML  中有三种<! DOCTYPE> 声明

       Strict是不包括展示性和废弃的属性 以及框架集framset
       transitional 包括展示性和废弃属性 不包含框架集
       framset 在transitional 基础上包括框架集

   （2）在 HTML5 中只有一种：

       <!DOCTYPE html>
       在 HTML5中，DOCTYPE 唯一的作用是启用标准模式。更早期的 HTML 标准会附加其他意义，但没有任何浏览器会将 DOCTYPE 用于怪异模式和标准模式之间互换以外的用途。

3. 注意：  
   （1）位置必须放在文档顶端，任何放在 DOCTYPE 前面的东西，比如批注或 XML 声明，会令 IE9 或更早期的浏览器触发怪异模式。  
   （2）DOCTYPE不是HTML标签，它是一个它是浏览器模式渲染的指令，更没有结束标签。  
   （3）<! DOCTYPE> 声明对大小写不敏感。  

> 推荐阅读：

1. [HTML 5终于定稿，八年后我们再一次谈谈怎么改变世界](https://www.36kr.com/p/1641949675521)
2. [HTML5标准制定完成：浏览器大战能消停吗？](https://www.techug.com/post/html5-browsers.html)
3. [文档类型声明](https://developer.mozilla.org/zh-CN/docs/Glossary/Doctype)

### script标签中defer和async的区别

1. 不加属性的脚本同步记载并执行，因此其会阻塞下面其他`HTML`元素和`CSS`样式的解析渲染
2. `async`属性指示浏览器异步加载`JavaScript`文件，因此其只支持外链`JS`文件；`async`属性告诉浏览器先把文件下载下来，在“时机成熟”的时候再执行。异步脚本一定会在页面的[`load`事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/load_event)前执行，但可能会在[`DOMContentLoaded`事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/DOMContentLoaded_event)触发之前或之后执行。而且更加需要注意的是，标记为`async`的脚本并不保证按照指定他们的先后顺序执行。所以，确保各个异步脚本互不依赖非常重要。
3. `defer`属性与`async`属性类似，其机制是 在触发 `DOMContentLoaded` 事件前执行，且会按照引入顺序前后执行。

#### 代码测试

```html
<head>
    <script src="./js2.js" async></script>
    <script src="./js1.js" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded……1');
            console.log('DOMContentLoaded……2');
            console.log('DOMContentLoaded……3');
            console.log('DOMContentLoaded……4');
        });
        window.addEventListener('load', function() {
            console.log('load……1');
            console.log('load……2');
            console.log('load……3');
            console.log('load……4');
        });
    </script>
</head>

<body>
    <script>
        console.log('测试……');
    </script>
</body>
```

1. 360极速浏览极速模式、谷歌浏览器、Edge浏览器：

```bash
测试……
defer……脚本运行1……
defer……脚本运行2……
defer……脚本运行3……
defer……脚本运行4……
DOMContentLoaded……1
DOMContentLoaded……2
DOMContentLoaded……3
DOMContentLoaded……4
async……脚本运行1……
async……脚本运行2……
async……脚本运行3……
async……脚本运行4……
load……1
load……2
load……3
load……4
```

2. 火狐浏览器：

```bash
async……脚本运行1……
async……脚本运行2……
async……脚本运行3……
async……脚本运行4……
测试……
defer……脚本运行1……
defer……脚本运行2……
defer……脚本运行3……
defer……脚本运行4……
DOMContentLoaded……1
DOMContentLoaded……2
DOMContentLoaded……3
DOMContentLoaded……4
load……1
load……2
load……3
load……4
```

3. 360浏览器兼容模式 - IE模式：

```bash
测试……
async……脚本运行1……
async……脚本运行2……
async……脚本运行3……
async……脚本运行4……
defer……脚本运行1……
defer……脚本运行2……
defer……脚本运行3……
defer……脚本运行4……
DOMContentLoaded……1
DOMContentLoaded……2
DOMContentLoaded……3
DOMContentLoaded……4
load……1
load……2
load……3
load……4
```

### HTML5有哪些更新

[新增的大致有：](https://www.yuque.com/cuggz/interview/gme0bw#453ac52513620bb5a305d352e2bceb08)  
（1）新增语义化标签：nav、header、footer、aside、section、article  
（2）音频、视频标签：audio、video  
（3）数据存储：localStorage、sessionStorage  
（4）canvas（画布）、Geolocation（地理定位）、websocket（通信协议）  
（5）input标签新增属性：placeholder、autocomplete、autofocus、required  
（6）history API：go、forward、back、pushstate  

移除的元素有：  
• 纯表现的元素：basefont，big，center，font, s，strike，tt，u; 
• 对可用性产生负面影响的元素：frame，frameset，noframes；  

### img的srcset属性的作⽤？

> 用处：根据屏幕密度设置显示对应不同尺寸的图片。srcset属性用于设置不同屏幕密度下，img 会自动加载不同的图片。

缩放比例拥有两种单位：
1. `x`：像素密度描述符，它指定应将像素密度作为相应图像资源显示的条件。屏幕像素密度一般有`1x`,`2x`,`3x`,`4x`四种：

```html
<!-- 根据当前设备是几倍屏展示对应图片 -->
<!-- 格式：2x或2.0x。 -->
<img src="/static/flamingo-fallback.jpg" srcset="
    /static/flamingo-4x.png 4x,
    /static/flamingo-3x.png 3x,
    /static/flamingo-2x.png 2x,
    /static/flamingo-1x.png 1x ">
```

2. `w`：宽度描述符，指定的宽度必须是非零的正整数，并且必须与引用图像的固有宽度匹配：

```html
<img src="https://cloud4.gogoing.site/files/2020-08-21/bbc63bf5-6f56-4d0a-a996-72fff804725c.png" sizes="(max-width: 376px) 375px, (max-width: 769px) 768px, 1024px" srcset="
    https://cloud3.gogoing.site/files/2020-08-21/bbc63bf5-6f56-4d0a-a996-72fff804725c.png 375w,
    https://cloud2.gogoing.site/files/2020-08-21/69d2679d-eefe-434a-8755-7f8b09166bf3.png 768w,
    https://cloud1.gogoing.site/files/2020-08-21/291087d7-beda-402f-9c28-b23e71beb32e.png 1024w">
```

`sizes` 用来表示尺寸临界点，类似媒体查询，格式为： `sizes="[media query] [value], [media query] [value] ... etc"`

毕竟宽度不像几倍屏幕，不是固定的比如一倍屏、二倍屏等，我们也很难对不同无尽的宽度给出对应的图片，因此，通过划分为几个档次的方式，对某个区间的宽度固定展示一种尺寸的图片，即可适应几乎绝大部分场景。

分析下上面的代码：
1. `sizes`规定了 小于`376px`时按`375px`算，小于`769px`时按`768px`算，其他的按`1024px`宽度尺寸算
2. `srcset`设置了`375`宽度（单位其实就是px，只不过用`w`代表宽度）对应的图片地址，其他的同理。

![https://zhuanlan.zhihu.com/p/197567126](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210614113203.png)

> 注意：

1. `SVG`矢量图片在大小尺寸屏幕上都不失真，因此不需要这样做，也是更好的选择。
2. 通过鼠标滚轮缩放放大可以模拟不同密度的屏幕效果；`JavaScript` 通过 `window.devicePixelRatio` 可查看当前设备缩放比例。

### 块级元素和内联元素分别有哪些，标签、元素、Dom对象又各是啥？

#### 标签、元素、DOM节点的区别

**标签**： `Tag` ，指的是 `HTML` 这门标记语言的最小基本单位，偏向于语言规范和编程开发的一个概念，是一个标记：

> 标签根据是否有闭合分为 单标签 和 双标签；

**元素**： `Element` ，指的是网页对象的基本单位，标签与内容的完整结合称为 元素；

> 元素是网页的一部分，在 XML 和 HTML 中，一个元素可以包含一个数据项，或是一块文本，或是一张照片，亦或是什么也不包含。 一个典型的元素包括一个具有一些属性的开始标签，中间的文本内容和一个结束标签。如果什么都不包含，就是一个 空元素。

> [元素和标签不是同一种概念。源代码中的标签用来标识元素的开始或结束，而元素是文档对象模型（DOM）中的一部分，文档对象模型会被浏览器渲染、展示为页面。](https://developer.mozilla.org/zh-CN/docs/Glossary/Element)

> [对应标签的单双分类，元素也有差不多的概念，其分为 `常规元素` 和 `空元素` ](https://developer.mozilla.org/zh-CN/docs/Glossary/Empty_element)。

* 常规元素：开始标签、结束标签与内容相结合，便是一个完整的常规元素 - ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/fe3728df58a8b96cdc2d302b685014b9_element.png)

* 空元素：一个不能存在子节点（例如内嵌的元素或者元素内的文本）的 `element`：

> •  常见的有： `<br>、<hr>、<img>、<input>、<link>、<meta>` ；  
> •  鲜见的有： `<area>、<base>、<col>、<colgroup>、<command>、<embed>、<keygen>、<param>、<source>、<track>、<wbr>` 。

**DOM节点**： `HTML` 文档在浏览器里，为了与 `JavaScript` 之类的脚本语言结合使用，于是设计了 `HTML和XML文档的编程接口` ，其提供了对文档的结构化的表述，并定义了一种方式可以使从程序中对该结构进行访问，从而改变文档的结构，样式和内容。DOM 将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。

简而言之， `DOM对象` 是 `HTML` 文档面向编程语言设计的一个对象，将 `HTML` 通过一种结构化的表述，使得编程语言可以操作修改文档类型，达到操作当前网页结构的效果。

现在我们一般将 `DOM对象` 默认就是指面向 `JavaScript` 语言的，但其实 `DOM` 标准与 `JavaScript` 规范是分离的，它不限于 `JavaScript` 这一种语言，其他语言也有支持它的实现，比如：Python。

在 `DOM对象` 里，节点（Node）是节点树中的单个点。包括文档本身、元素、文本以及注释都属于是节点；也就是说 元素在 `DOM` 对象里印射为了一个节点，但是其不等同于节点，节点范围某种形式上来讲范围更大一点。

> 更多：[DOM模型用一个逻辑树来表示一个文档，树的每个分支的终点都是一个节点(node)，每个节点都包含着对象(objects)。DOM的方法(methods)让你可以用特定方式操作这个树，用这些方法你可以改变文档的结构、样式或者内容。节点可以关联上事件处理器，一旦某一事件被触发了，那些事件处理器就会被执行。](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)

#### 元素分类

从界面展现形式来讲，[可分为 块级元素和内联元素](https://mubu.com/doc/8_mc-BV7V_)：  
* 块级元素在页面中以块的形式展现 —— 相对于其前面的内容它会出现在新的一行，其后的内容也会被挤到下一行展现。块级元素通常用于展示页面上结构化的内容，例如段落、列表、导航菜单、页脚等等。一个以block形式展现的块级元素不会被嵌套进内联元素中，但可以嵌套在其它块级元素中。  
* [内联元素通常出现在块级元素中并环绕文档内容的一小部分，而不是一整个段落或者一组内容。内联元素不会导致文本换行：它通常出现在一堆文字之间例如超链接元素<a>或者强调元素<em>和 <strong>。](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Block-level_elements)

> [ `HTML5` 重新划分了元素类别](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Content_categories)，但是更加复杂，现在大部分人也还是用 块级元素 和 内敛元素（行内元素） 分类（行内块我们归于 行内元素，暂时不区分）。

从元素格式来看的话，就分为 常规元素与空元素，上面已经说过了，就不再提了。

常见块级元素：
* div、h1-h6、p、hr、audio、video、canvas、ul、ol、li、form、table、pre
常见行内元素：
* span、img、button、br、i、a、sub、sup、input、label、select、textarea

### web worker 是啥？

首先，[因为 `JavaScript` 一直是单线程的](.././js/promise简单入门.md)，随着设备性能的发展和网页需求的扩大，单线程终究是带来了一定的不便， `Html5` 为了解决单线程在处理 `计算密集型或高延迟的任务` 时阻塞主线程的问题，便引入了 `Web Worker` 为 `JavaScript` 创造多线程环境，允许主线程创建 `Worker` 线程，将一些任务分配给后者运行。[在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)

Worker 线程一旦新建成功，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断。这样有利于随时响应主线程的通信。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭。

`Web Worker` 规范中定义了两类工作线程，分别是 `专用线程Dedicated Worker` 和 `共享线程 Shared Worker` ，其中，Dedicated Worker只能为一个页面所使用，而Shared Worker则可以被多个页面所共享。
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210614234733.png)

基本用法：

## 偏门知识

## 参考

* [前端面试题-url、href、src](https://zhuanlan.zhihu.com/p/35571428)
* [JS脚本加载中，defer和async的区别](https://zhuanlan.zhihu.com/p/30898865)
* [响应式图片srcset属性解析](https://zhuanlan.zhihu.com/p/197567126)
