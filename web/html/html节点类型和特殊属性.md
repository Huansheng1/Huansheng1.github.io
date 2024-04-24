# Html节点元素类型和属性

## 前提

一个结点是分为多种类型的，且每一个结点对象都含有以下三个属性：
* `nodeType`：结点类型 - 数字
* `nodeValue`：结点值 - 对象
* `nodeName`：结点名 - 字符串

因此，通过 `nodeType` 我们可以判断当前结点是哪种类型，是 `Dom` 元素结点还是啥；通过 `nodeName` 我们可判断当前结点名称是啥。

## 代码验证

1. 结构文件如下：

```html
    <div class="container">
        <div class="content" id="content" style="color:red;">
            测试
            <!-- 注释节点 -->
        </div>
    </div>
```

2. 测试`nodeName`、`nodeType`、`nodeValue`在常见节点的情况下分别代表着啥：

```js
const contentDom = document.querySelector('.content');
// 标签元素 - content: DIV 1 null
console.log('content:', contentDom.nodeName, contentDom.nodeType, contentDom.nodeValue)
// 标签元素：
// <div class="content" id="content" style="color:red;">
//     测试
// </div>
console.log('contentDom：', contentDom)
console.log('dom元素的属性列表：', contentDom.attributes);
// dom元素的属性列表： NamedNodeMap {0: class, 1: id, 2: style, length: 3}
const childOfContentDom = contentDom.attributes[0];
console.log('childOfContentDom:', childOfContentDom.nodeName, childOfContentDom.nodeType, childOfContentDom.nodeValue)
// childOfContentDom: class 2 content
console.log('childOfContentDom：', childOfContentDom, JSON.stringify(childOfContentDom), typeof childOfContentDom)
// 不是字符串哦，虽然打印看起来像：childOfContentDom： class=​"content" {} object
console.log('contentDom.children：', contentDom.childNodes)
// contentDom.children： NodeList(3) [text, comment, text] - 分别是 测试这个文本结点、注释结点、回车结点
const textOfContentDom = contentDom.childNodes[0]
console.log('文本节点：', textOfContentDom, textOfContentDom.nodeName, textOfContentDom.nodeType, textOfContentDom.nodeValue)
// 文本节点：
// "
//     测试
// " #text 3 
//     测试

const noteOfContentDom = contentDom.childNodes[1]
console.log('注释节点：', noteOfContentDom, noteOfContentDom.nodeName, noteOfContentDom.nodeType, noteOfContentDom.nodeValue)
// 注释节点： <!-- 注释节点 --> #comment 8  注释节点
```

## 总结

1. `nodeName` - 节点的名称:

* 元素节点的 `nodeName` 是标签名称
* 属性节点的 `nodeName` 是属性名称
* 文本节点的 `nodeName` 永远是 #text
* 文档节点的 `nodeName` 永远是 #document  

> 注释： `nodeName` 所包含的 XML 元素的标签名称永远是大写的

2. `nodeValue` - 结点属性：
* 对于文本节点，`nodeValue` 属性包含文本。
* 对于属性节点，`nodeValue` 属性包含属性值。
* `nodeValue` 属性对于文档节点和元素节点是不可用的。  

3. `nodeType` - 返回节点的类型：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210530172841.png)

## 参考文章

* [HTML DOM nodeType 属性 - w3cschool](https://www.w3school.com.cn/jsref/prop_node_nodetype.asp)
* [HTML DOM nodeType 属性 - 菜鸟教程](https://www.runoob.com/jsref/prop-node-nodetype.html)
* [Html Dom 的nodetype解析](https://www.cnblogs.com/sweting/archive/2009/12/06/1617839.html)
