# 谈谈我踩过Vue的坑
> 注：本文并不意味着说`Vue`有问题哦！主要是个人操作失误导致的
## 写代码时遇到的坑
### 路由数据变化未检测到问题
场景下，我定义了一个对象属性，通过索引对数组成员对象的属性进行修改，`Vue`是检测不到的，具体可以百度
> 小声BB：其实官网也有，我以前也看到过；但是人吧，不睬一次，不会往那方面想。

**Vue数组不能监测的情况有两种**

数组方面
1. 直接通过索引修改值
```js
this.items[indexOfItem] = newValue
```
2. 通过修改数组长度
```js
this.items.length = newLength
```
解决办法：
```js
// 数组解决办法：
// Array.prototype.splice.call()
arr数组对象.splice(开始索引，删除长度，插入的值)
// 两者是一样的，没啥区别
// Vue.$set(arr,index,value)
this.$set(arr,index,value)
````

对象方面
1. 通过点方法赋值`Watch`无法监测到
> 我通过计算属性返回`store`里的数据再通过`watch`监听这个计算属性来达到间接监听`Vuex`的目的；万万没想到还有个坑。
```js
this.对象.属性 = 值
```
2. 如果在实例创建之后添加新的属性到实例上，它不会触发视图更新
解决办法：
```js
this.$set(this.对象, '属性名', 值)// 通过提供的API添加属性；后续可正常监听

// Object.assign(target, ...sources) 第一个参数是目标对象，后面可接N个源对象
// 后面的数据都会复制到前面目标对象里，最后将结果对象返回
this.对象 = Object.assign({}, this.对象, 新对象)// 通过新对象避免无法检测的问题
```
最后，也可试试`deep`深度监听属性：
```js
watch:{
 '要监听的变量名':{
      handler(curVal,oldVal){
            console.log(oldVal)//数据变动就 打印以前的值
            },
      deep:true// 重点
      }
}
```
## 编译时遇到的坑

## 优化时遇到的坑

## 网络请求遇到的坑
### 跨域问题
`axios`是不能随便配置的哦

我们之前不是写了一篇文章，最后贴出来了最终整理的封装代码么，于是，在某个项目中，我直接复制了之前的代码。

请求之前，我先测试了下，嗯，这接口是允许跨域访问的；那就不用`vue.config.js`本地代理，直接使用吧。

可是，一运行，emm，报错了？

```html
Request header field withCredentials is not allowed by Access-Control-Allow-Headers in preflight response.
```
> 中文翻译：在预发请求返回相应结果中，`Access-Control-Allow-Headers`不允许`request`请求使用带凭证的请求标头字段。

所以，结果很明显了：

* `axios`的属性 `withCredentials: true` 配置不能乱用，之前理解有误：服务器可能允许我们跨域请求，但并未设置允许我们跨域请求携带`cookies`，因此，不要将该属性设置为默认的哦。


[详细原因](https://www.jb51.net/article/137278.htm)：
* `HTTP` 请求方式有许多种，有些请求会触发 `CORS` 预检请求。“需预检的请求”会使用 `OPTIONS` 方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求。

* 对于跨域请求浏览器一般不会发送身份凭证信息。如果要发送凭证信息，需要设置 `XMLHttpRequest` 的 `withCredentials` 属性为 `true：withCredentials: true`。此时要求服务器的响应信息中携带 `Access-Control-Allow-Credentials: true`，否则响应内容将不会返回。

* 另外，响应头中也携带了 `Set-Cookie` 字段，尝试对 `Cookie` 进行修改。如果操作失败，将会抛出异常。

最后贴上后端解决跨域的常见代码：
```js
// 最简单的方法就是在被访问的服务端返回的内容上面加上Access-Control-Allow-Origin响应头, 值为*或是当前网站的域名. 使用*的话虽然方便, 但容易被别的网站乱用,总归有些不太安全; 设置为当前网站的域名的话又只能设置一个. 
// 推荐解决办法是设置一个允许的域名白名单, 判断当前请求的refer地址是否在白名单里,如果是,就设置这个地址到Access-Control-Allow-Origin中去,否则就不设置这个响应头.
response.setHeader("Access-Control-Allow-Origin", "*");
// 后台通过cookie与前端交互的,但跨域时每次请求都是独立的,都会生成不同的cookie.为了保证前端与后端能够正常交互，后端需要设置这个，允许跨域请求携带cookies
// 需要注意，如果使用，两者皆要使用，反之不行
response.setHeader("Access-Control-Allow-Credentials", "true");
// 允许所有请求方式
response.setHeader("Access-Control-Allow-Methods", "*");
// 请求头Content-Type字段内容没有在Access-Control-Allow-Headers中被设置为允许.可能也会发生错误
response.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
response.setHeader("Access-Control-Expose-Headers", "*");
// header里面包含自定义字段，浏览器是会先发一次options请求，如果请求通过，则继续发送正式的post请求，而如果不通过则返回以上错误
// 直接允许就行了
if (request.getMethod().equals("OPTIONS")) {
    HttpUtil.setResponse(response, HttpStatus.OK.value(), null);
    return;
}
```

或者 

```php
// php解决
header('Access-Control-Allow-Methods:OPTIONS, GET, POST');
header('Access-Control-Allow-Headers:x-requested-with');
header('Access-Control-Max-Age:86400');  
header('Access-Control-Allow-Origin:'.$_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Credentials:true');
header('Access-Control-Allow-Methods:GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers:x-requested-with,content-type');
header('Access-Control-Allow-Headers:Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');
```

参考文章：
* [js网络请求跨域问题汇总(携带cookie)](https://www.jianshu.com/p/552daaf2869c)

* [如何解决出现not allowed by Access-Control-Allow-Headers in preflight response.](https://www.cnblogs.com/caimuqing/p/6733405.html)

* [前端AJAX请求跨域时遇到的一些坑](https://icewing.cc/post/about-cross-origin.html)

* [前端 | 浅谈preflight request](https://www.jianshu.com/p/b55086cbd9af)
## 部署托管遇到的坑

### 多级路由刷新出现404问题

这个坑踩了一下午不知道为什么，最后排查发现是路由嵌套惹的锅

因为我使用了`history`模式，导致路由跳转会改变路径，因为本来从首页一路使用确实是正常的；

但当我们在嵌套路由页面刷新时，完蛋，页面404打不开，因为我托管在`Github`里，这时控制台会显示`refused ....xxx.icon....` - 意思就是：拒绝加载我们的资源。

为什么会这样？因为我们此时的路径是路由地址，实际服务器是没有的，刷新操作会让页面数据清除，JS文件不存在了，就向服务器请求该地址，那可不就报错了么。

最简单的解决办法：设置路由模式为`hash`

更多办法：
* [各位用cli3 遇到过 路由用history模式 二级路由刷新报错的情况吗](https://bbs.csdn.net/topics/393538425)

* [vue-route+webpack部署单页路由项目，访问刷新出现404问题](https://www.cnblogs.com/kevingrace/p/6126762.html)

* [关于react-router的HashRouter与BrowserRouter（二级路由刷新404）](https://blog.csdn.net/qq_39989929/article/details/94015657)