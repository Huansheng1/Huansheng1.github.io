# JSON：序列化浅析与应用
## JSON序列化概念
### 序列化定义
**什么叫序列化**
序列化：  
* 也称 对象序列化  
* 序列化 是指 将编程语言中的 对象 类型 转换为 字节流 的过程。  
* 通俗点 将 不可存储与传输 的 对象类型 转换为 字符串 形式的数据！  
反序列化：  
* 顾名思义： 将 字符串 数据 转换为 当前语言的 对象类型  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200608210822.png)
### 为什么需要序列化
> 场景：  
* 当前运行的程序里存在几个对象：foo 和 bar，我们可以随意操作取出foo和bar对象的属性与方法，看起来很美好。  
* 可是，如果我们突然电脑没电了，我们的对象怎么办？它存在于内存里，会随着断电而消失；  
* 这时，我们自然地会想到一个方案：  
* > 如果，我们能够将 对象数据 保存到 硬盘里 该多好？  
* 没错，这就是 我们今天想了解的 序列化 - 将对象数据转换为字符串形式 的方法/过程。
序列化 广泛用于 存储 于 传输 中：
* 我们给另一个台电脑传递本机的数据，也往往离不开序列化与反序列化的过程。
### JSON概念与定义
关于 数据交换，目前来说，很难避开 JSON 这个 数据格式！  
**JSON（JavaScript Object Notation）**：  
* 一种轻量级，完全独立于语言的数据交换格式。目前被广泛应用在前后端的数据交互中。  
* 简单来说：JSON 是 JavaScript 的 子集，但是 又不等于 和 包括在 JS 里  
* JSON 与 JS 还是 有一些 不同！  
### JSON与JS对象
**JSON规则**：  
* 对于JavaScript中的五种原始类型，JSON语法支持数字、字符串、布尔值、null四种，不支持undefined；  

* NaN、Infinity和-Infinity序列化的结果是null；  

* JSON语法不支持函数；  

* 除了RegExp、Error对象，JSON语法支持其他所有对象；  

* 日期对象序列化的结果是ISO格式的字符串，但JSON.parse()依然保留它们字符串形态，并不会将其还原为日期对象；  

* JSON.stringify()只能序列化对象的可枚举的自有属性；  

**异同点**：  

|区别|Json|Javascript对象|
|:--:|:--:|:--:|
|含义|仅仅是一种数据格式|表示类的实例|
|传输|可以跨平台数据传输，速度快|不能传输|
|表现|1,键值对方式，键必须加双引号；<br>2,值类型包括：对象，数组，普通数值；不能是方法函数,不能是undefined/NaN|1,键值对方式，键不加引号；<br>2,值可以是函数、对象、字符串、数字、boolean 等|
|相互转换|Json转化为js对象：<br>1,JSON.parse(jsonstring)(不兼容ie7)<br>2,Jsobj=eval("("+jsonstring+")")(兼容所有浏览器，但不安全，会执行json里面的表达式?)<br>|Js对象转换为Json：<br>JSON.stringify(jsobj)(不兼容ie7)<br>|
  

**注意**：  
JSON 是一个 数据交换格式 ，而非 一种 数据类型！  
```js
/*这只是JS对象 */
var obj={name:"trump",age:3};
var obj={'name':'trump','age':3};
/*JSON格式的JavaScript对象 */
var obj={"name":"trump","age":3}; 
/*JSON格式的字符串 */
var str1='{"name":"trump","age":3}';
/*JSON格式的数组，是JSON的稍复杂一点的形式 */
var a=[
 {"name":"trump","age":3},
 {"name":"trump","age":3},
 {"name":"trump","age":3},
 ];
 /* 稍复杂一点的JSON格式的字符串 */
var str2='['+
 '{"name":"trump","age":3}'+
 '{"name":"trump","age":3}'+
 '{"name":"trump","age":3}'+
 ']' ;
```
更多：[JSON - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)
## JSON序列化与反序列化
### 内置函数：JSON.stringify()、JSON.parse()和eval()
**示例：**  
```js
// 定义一个JSON格式的字符串
var jsonData = `{
  "name": "trump",
  "age": "3",
  "fans": "7000000000000",
  "level": "leader"
}`
jsonData = JSON.parse(jsonData)// 将JSON形式字符串转成JSON对象
console.log(jsonData, jsonData.name)
jsonData = JSON.stringify(jsonData)// 将JSON对象解析成JSON格式的文本
console.log(jsonData)
console.log(eval('(' + jsonData + ')'))// JSON字符串转换为JSON对象，危险性太大，不推荐使用该方法 ： eval can be harmful
```
结果：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200608223042.png)
* JSON序列化：
* > JSON.stringify() -> JSON格式数据/对象 转换 JSON格式数据
* JSON反序列化：
* > JSON.parse() -> 字符串 转换 JSON对象
* > eval() -> 字符串 转换 JSON对象

**用处**：  
* 用于`localStorage`和`sessionStorage`的存储
* > value 只能存储字符串数据，通过序列化，我们可以将对象保存起来
* 判断数组对象是否相同
* > 对象类型 直接比较，比较的是 引用地址
* > 但是，我们如果先将两侧的数组序列化成字符串再进行比较，我们就可以避免这个问题：
* >> 当然，数组成员不能是function等特殊类型！
### qs模块的stringify()、parse()
**安装引用**：  
```bash
npm i qs
import qs from 'qs'
```
**qs使用**：  
代码示例：  
```js
var url = 'http://www.taobao.com/cloth?a=1&b=2&c=&d=4'
console.log(url.split('?'))
var data = url.split('?')[1]
console.log(data)
// node在Vue项目里 除非写完导出在main.js或者app.vue调用，不然直接node xxx.js里 不能使用import qs from 'qs'
// 我们只能通过require()来迂回使用qs
var a = require('qs').parse(data)
console.log(a, a.a)// qs.parse() --> 字符反序列化为对象
console.log(require('qs').stringify(a))// 序列化，注意：qs序列化的不是json格式的字符串 而是 Get形式的键值对
var info = {
  applyStaffName: '测试人员',
  startWorkTime: '2019-08-19 09:00:00',
  userPersonInformation: {
    timeToWork: '2018-03-12 18:00:00'
  },
  userTimeList: [
    { time: '2000-11-11' },
    { time2: '2020-05-23' }
  ]
}
console.log(decodeURIComponent(require('qs').stringify(info)))// 转换后为url编码模式，不方便观察
console.log('----------------------')
info.userTimeList = JSON.stringify(info.userTimeList)
console.log(decodeURIComponent(require('qs').stringify(info)))
```
结果：  
```bash
$ node test
[ 'http://www.taobao.com/cloth', 'a=1&b=2&c=&d=4' ]
a=1&b=2&c=&d=4
{ a: '1', b: '2', c: '', d: '4' } 1
a=1&b=2&c=&d=4
applyStaffName=测试人员&startWorkTime=2019-08-19 09:00:00&userPersonInformation[timeToWork]=2018-03-12 18:00:00&userTimeList[0][time]=2000-11-11&userTimeList[1][time2]=2020-05-23
----------------------
applyStaffName=测试人员&startWorkTime=2019-08-19 09:00:00&userPersonInformation[timeToWork]=2018-03-12 18:00:00&userTimeList=[{"time":"2000-11-11"},{"time2":"2020-05-23"}]
```
> 我们可以 观察出：
* > 默认序列化格式为：key=value&key=value格式
* > 如含有数组/对象等复杂格式，要想服务器接受到的数据能保持json形式，需先使用JSON.stringify()转换为字符串
* > 更多文章：<https://www.cnblogs.com/imgss/p/12020058.html>
* > QS序列化核心：<https://github.com/ljharb/qs/blob/master/test/parse.js>

**qs的用处**：  
* 后台能够直接处理的数据格式，是一种经过序列化的键值对数据。  
* 提交时数据往往是JSON格式，它以JSON原始格式存储在body中而不是以键值对的方式  
* > 后台程序可能无法直接识别JSON类型的数据  
* > 我们如果在提交前先把data转换为 key=value&key=value&key=value 的格式再提交，服务器更容易解析到我们提交的序列化data数据。  
* 当然，数据如果是通过表单提交，不管是post方式还是get，浏览器都会自动进行序列化，无需前端js再做任何处理。  
> [为什么axios里我们使用qs序列化](https://github.com/axios/axios#using-applicationx-www-form-urlencoded-format)
* `content-type: application/x-www-form-urlencoded`我们需要qs来序列化保证服务器接受数据正常
* 默认的话为`content-type: application/json`，axios会自动将JSON格式数据序列化，服务器不限制data必须urlencoded就不需要qs了
* qs.parse qs.stringify主要是用来处理url编码格式数据，JSON.parse JSON.stringify主要处理json格式
* qs自定义性更强，支持序列化多样的格式