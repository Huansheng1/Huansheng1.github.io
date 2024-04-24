# axios学习与用法
## axios概念
Axios 是一个基于 `promise` 的 HTTP 库，可以用在浏览器和 node.js 中。  

> 特性：  
* 从浏览器中创建 XMLHttpRequests  
> 推荐阅读：[你真的会使用XMLHttpRequest吗？](https://segmentfault.com/a/1190000004322487)
* 从 node.js 创建 http 请求  
* 支持 Promise API  
* 拦截请求和响应  
* 转换请求数据和响应数据  
* 取消请求  
* 自动转换 JSON 数据  
* 客户端支持防御 XSRF  
## 基础初探
### 安装axios
**使用 npm**:
```bash
npm install axios
```
**使用 cdn**:
```js
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```
* 免费接口测试：<http://httpbin.org/>
### 简单使用Get、Post、并发请求all
**Get使用**：  
```js
// GET数据放在URL上，注意url为相对地址时如果设置过baseUrl会自动追加在其后面
// 反之则追加到当前域名的后面，比如我们本地测试：localhost:8888/xxx
axios.get('/user?ID=12345')
  // 请求成功处理方法，response是返回的服务器数据
  .then(function (response) {
    console.log(response);
  })  // 请求失败处理方法
  .catch(function (error) {
    console.log(error);
  });
// GET数据放在config配置对象的params值里
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  ....后面代码跳过

```
**Post使用**：  
```js
axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```
**返回数据格式**  

*响应结构* ：  
网络请求的响应包含以下信息
```js
{
    // data 由服务器提供的响应
    data: {},
    
    // status 来自服务器响应的 HTTP 状态码
    status: 200,

    // statusText 来自服务器响应的 HTTP 状态信息
    statusText: 'OK',
    // 服务器返回协议头
    // headers 服务器响应的头
    headers: {},
    // 显示我们请求的设置config
    // config 是为请求提供的配置信息
    config: {},

    // request 是生成当前响应的请求
    // 在 node.js 中是最后一个 ClientRequest 实例 (在重定向中)
    // 在浏览器中是 XMLHttpRequest 实例
    request: {}
}
```
*使用服务器返回数据*  
```js
axios.get('/user/12345')
    .then(function (response) {
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
    })
```
**注意：**  
* 一旦HTTP请求发起，Axios会返回一个Promise对象（fulfilled或rejected，取决于后端服务的响应请求成功还是失败）
* > 判断请求是否成功 看的 返回状态码 `response.status` ，状态码在`2xx` 范围调用then处理成功数据；
* get和post传递的参数不同：  
* > get只需要传递两个参数：url，config对象
* >>  传递data数据 为 config对象 里的 params对象![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200609182252.png)
* > post传递三个参数：url,data,config对象
* >> data数据 为 一个单独对象，不在config 里![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200609182649.png)![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200609182340.png)

**并发请求all**：  
```js
//请求一
function getUserAccount() {
  return axios.get('/user/12345');
}
//请求一
function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}
//并发请求，两个都完成才开始处理数据
axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // 两个请求现在都执行完成
    console.log(acct);//getUserAccount()返回数据
    console.log(perms);//getUserPermissions()返回数据
  }));

//也可直接放在里面使用，但是不推荐，不直观优雅
axios.all([axios.get('/user/12345'), axios.get('/user/6789')])
  .then(axios.spread(function (acct, perms) {
    // 两个请求现在都执行完成
  }));
  ```
**注意**：  
* axios.all()返回的promise对象，只有在当所有请求都被resolve时，它才会resolve。
* > 如果任何一个请求的被rejected，那么该promise对象将会立即reject出第一个被reject的promise对象的结果。
* `axios.all()返回给then/catch()参数值为数组`，所以我们需要使用`axios.spred()`将数组展开为多个数据  
* `axios.spred()`：分配响应数组的属性给单独的变量

**更多方法**：  

请求方法的别名：  
> 为方便起见，axios为所有支持的请求方法提供了别名  
* axios.request(config)
* axios.get(url[, config])
* axios.delete(url[, config])
* axios.head(url[, config])
* axios.options(url[, config])
* axios.post(url[, data[, config]])
* axios.put(url[, data[, config]])
* axios.patch(url[, data[, config]])  

注意：  
* 在使用别名方法时， url、method、data 这些属性都不必在配置中指定。
### axios Api使用配置config
我们也可不使用别名，直接给`axios`传递config对象来发送网络请求  

**语法**：  
```js
axios(url[, config])
// 发送 GET 请求（默认的方法）
axios('/user/12345');//url必传，config可自己根据实际场景传递不同的设置
```
**axios(config)**：简单获取文本数据  
```js
// 发送 POST 请求，默认处理返回数据为JSON格式的字符串
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```
**axios(config)**：简单获取字节数据  
```js
// 获取远端图片
axios({
  method:'get',
  url:'http://bit.ly/2mTM3nY',
  responseType:'stream'//重点：给config设置 返回数据格式 为字节流（二进制）
})
  .then(function(response) {
  response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))//引用fs文件处理模块
});
```
**请求配置config**：  

下面是创建请求时可以用的配置选项。url 必需，如果没有指定 method，请求将默认使用 get方法。
```js
{
    // url 是用于请求的服务器 URL
    url: '/user'

    // method 是创建请求时使用的方法
    method: 'get',    // default

    // baseURL 将自动加在 url 前面，除非 url 是一个绝对 URL
    // 它可以通过设置一个 baseURL 便于为 axios 实例的方法传递相对 URL
    baseURL: 'https://some-domain.com/api/',

    // transformRequest 允许在向服务器发送前，修改请求数据
    // 只能用在 PUT、POST 和 PATCH 这几个请求方法
    // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    // 默认情况下，Axios自动将请求和响应的格式转换成JSON，但是它也允许你覆盖默认行为，重写定义不同的转化机制。当API只接受特殊的数据格式，像XML或CSV时，这个功能就非常有用了。
    transformRequest: [function (data, headers) {
        // 对 data 进行任意转换处理
        return data;
    }],

    // transformResponse 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [function (data) {
        // 对 data 进行任意转换处理
        return data;
    }],

    // headers 是即将被发送的自定义请求头
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    
    // params 是即将与请求一起发送的 URL 参数
    // 必须是一个无格式对象 (plain object) 或 URLSearchParams 对象
    params: {
        ID: 12345
    },

    // paramsSerializer 是一个负责 params 序列化的函数
    // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
    paramsSerializer: function (params) {
        return QS.stringify(params, {arrayFormat: 'brackets'})
    },
    
    // data 是作为请求主体被发送的数据
    // 只适用于这些请求方法 PUT、POST 和 PATCH
    // 在没有设置 transformRequest 时，必须是以下类型之一：
    // - string，plain object，ArrayBuffer，ArrayBufferView，URLSearchParams
    // - 浏览器专属：FormData，File，Blob
    // - Node专属：Stream
    data: {
        firstName: 'Fred'
    },

    // timeout 指定请求超时的毫秒数(0 表示无超时时间)
    // 如果请求花费了超过 timeout 的时间，请求将被中断
    timeout: 1000,

    // withCredentials 表示跨域请求时是否需要使用凭证
    // 主要用于 cros 跨域请求 时 是否带上 cookie
    // 永远不会影响到同源请求
    // 如果在发送来自其他域的XMLHttpRequest请求之前，未设置withCredentials 为true，那么就不能为它自己的域设置cookie值。
    // 更多  - https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials
    withCredentials: false,    // default
    
    // adapter 允许自定义处理请求，以使测试更轻松
    // 返回一个 promise 并应用一个有效的响应(查阅 [response docs](#response-api))
    adapter: function (config) {
        /* ... */
    },

    // auth 表示应该使用 HTTP 基础验证，并提供凭据
    // 这将设置一个 Authorization 头，覆写掉现有的任意使用 headers 设置的自定义 Authorization 头
    auth: {
        username: 'janedoe',
        password: 's00pers3cret'
    },

    // responseType 表示服务器响应的数据类型，可以是 arraybuffer、blob、document、json、text、stream
    responseType: 'json',    // default

    // responseEncoding 表示对响应的编码
    // Note：对于 responseType 为 stream 或 客户端请求会忽略
    responseEncoding: 'utf-8',

    // Axios通过允许用户在发出请求时嵌入额外的认证信息的方式防御XSRF，这使服务器能够发现来自未授权地址的请求。
    // xsrfCookieName 是用作 xsrf token 值的 cookie 名称
    xsrfCookieName: 'XSRF-TOKEN',    // default

    // xsrfHeaderName 是 xsrf token 值的 http 头名称
    xsrfHeaderName: 'X-XSRF-TOKEN',    // default
        
    // onUploadProgress 允许为上传处理进度事件
    // 官方示例：https://github.com/axios/axios/blob/master/examples/upload/index.html
    onUploadProgress: function (progressEvent) {
        // ... ...
    },
    
    // onDownloadProgress 允许为下载处理进度事件
    // 用于显示下载进度，简单用法：Axios Progress Bar模块
    onDownloadProgress: function (progressEvent) {
        // ... ...
    },

    // maxContentLength 定义允许的响应内容的最大尺寸
    maxContentLength: 2000,
    
    // validateStatus 定义对于给定的 HTTP 响应状态码是 resolve 或 reject promise。
    // 如果 validateStatus 返回 true (或者设置为 null 或 undefined)，promise 将被 resolve，否则 promise 将被 reject
    // 这就是 默认status状态码为2xx就算成功，让then处理的原因
    validateStatus: function (status) {
        return status >= 200 && status < 300;    // default
    },

    // maxRedirects 定义在 node.js 中 follow 的最大重定向数目
    // 如果设置为 0，将不会 follow 任何重定向
    maxRedirects: 5,

    // socketPath 用于在 node.js 中定义 UNIX Socket
    // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
    // 只能指定 socketPath 或 proxy，如果两者同时指定，将使用 socketPath
    socketPath: null,

    // httpAgent 和 httpsAgent 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。
    // 允许像这样配置选项。keepAlive 默认没有启用
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),

    // proxy 定义代理服务器的主体名称和端口
    // auth 表示 HTTP 基础验证应当用于连接代理，并提供凭据
    // 这将会设置一个 Proxy-Authorization 头，覆写掉已有的通过使用 header 设置的自定义 Proxy-Authorization 头
    proxy: {
        host: '127.0.0.1',
        port: 9000,
        auth: {
            username: 'mikeymike',
            password: 'rapunz31'
        }
    },

    // cancelToken 指定用于取消请求的 cancel token
    // 取消 指定的网络请求，不管成功与否，我们会在后面再提到
    cancelToken: new CancelToken(function (cancel) {
        // ... ...
    })
}
```
注意：
* 如果前端配置了`withCredentials=true`，后段设置`Access-Control-Allow-Origin`不能为 `*`,必须明确指定为包含 `Origin` 的值。
```js
// 指定来源
header("Access-Control-Allow-Origin","前端地址";
// 允许跨域携带cookie，浏览器才会把响应结果给我们前端
header("Access-Control-Allow-Credentials", "true");
```
* 跨域请求时协议头不会自动携带`cookie`，`withCredentials`适用于一个项目在发起跨域请求时需要携带`cookie`的情况。

> [明确一下 XMLHttpRequest#withCredentials 的作用](https://gerhut.me/xmlhttprequest-withcredentials/)
### 创建axios示例：axios.create()
**语法**：  
```js
axios.create([config])
```
**示例**：  
```js
// 创建实例
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
// 发送网络请求
  instance(config)
    .then(res => {
      resolve(res)
    })
    .catch(err => {
      reject(err)
    })
```
### 设置axios默认值
全局的 axios 默认值
```js
axios.defaults.baseURL = 'https://api.example.com';//默认域名
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;//默认协议头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';//post默认内容协议头
```
自定义实例默认值
```js
// 创建实例时设置配置默认值
const instance = axios.create({
  baseURL: 'https://api.example.com'
});

// 实例创建之后可修改默认配置
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```
**配置的优先顺序**：  
* 配置会以一个优先顺序进行合并。  
* 这个顺序是：  
* ***在 lib/defaults.js 找到的库的默认值，然后是实例的 defaults 属性，最后是请求的 config 参数***。  
* 后者将优先于前者。  

这里是一个例子：
```js
// 使用由库提供的配置的默认值来创建实例
// 此时超时配置的默认值是 `0`
var instance = axios.create();

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = 2500;

// 为已知需要花费很长时间的请求覆写超时设置
instance.get('/longRequest', {
  timeout: 5000
});
```
### 拦截器：interceptors
**拦截器**  
* interceptor作用：在网络发送请求或处理响前拦截处理相关数据。  
* 针对请求参数和响应结果，主要场合：
* > loading展示  
* > 对接口常规报错  
* > 网络报错  
* > 系统超时  
* > 权限认证等做拦截处理。

**代码示例**：  
```js
// 添加请求拦截器
axios.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response;
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);
```
*注意* ：  
* 参数 是 处理成功返回 和 失败结果 的两个方法

**移除拦截器**：  
```js
const myInterceptor = axios.interceptors.request.use(function () { /* ... */ });
axios.interceptors.request.eject(myInterceptor);// eject()移除
```
注意：  
* `interceptors` 创建拦截器 返回值是number类型
* 第一个 拦截器 是 0 ，后面 的 返回值 递增
* > 测试图：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200609231255.png)![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200609231345.png)
* 所以 ，我们通过 返回值（实际标识着从零开始的拦截器序号） 来 指定删除某个拦截器

### 设置错误码范围validateStatus
1. 之前，我们在 config 里提到过，默认成功resolve的返回状态码 范围是 2xx
2. 如果，我们 感觉这个范围不是很合理的话，是可以通过修改config的参数来重设自己相应的状态码范围的

```js
axios.get('/user/12345', {
    validateStatus: function (status) {
        // 当且仅当 status 大于等于 500 时 Promise 才被 reject
        return status < 500;
    }
});
```
*简单错误捕获判断代码* ：  
```js
axios.get('/user/12345')
    .catch(function (error) {
        if (error.response) {
            // 请求已发出，且服务器的响应状态码超出了 2xx 范围
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // 请求已发出，但没有接收到任何响应
            // 在浏览器中，error.request 是 XMLHttpRequest 实例
            // 在 node.js 中，error.request 是 http.ClientRequest 实例
            console.log(error.request);
        } else {
            // 引发请求错误的错误信息
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
```
### 取消网络请求CancelToken

有些情况下，你可能不关心请求的结果，只需要取消已经提交发送的网络请求  
* 我们之前 config 里提到过，CancelToken 参数用来取消网络请求
* > `new CancelToken(function (cancel) {
        // ... ...
    })`
* > 很明显，我们需要传递的是一个CancelToken对象！


**代码示例** ：  
```js
const axios = require('axios') // 不能使用import的时候我们可以使用require
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
    cancelToken: source.token//将CancelToken.source().token [一个promise对象] 传递过去
}).catch(function (thrown) {
    if (axios.isCancel(thrown)) {//判断这是拦截取消请求 导致的错误信息
        console.log('Request canceled', thrown.message);
    } else { /* 处理错误 */ }
});

axios.post('/user/12345', {
    name: 'new name'
}, {
    cancelToken: source.token
});

// 取消请求 (message 参数是可选的)
source.cancel('Operation canceled by the user.');
```
更多：[axios中文文档](http://www.axios-js.com/zh-cn/docs/#取消)

> 我们可以简单看一下这三个是什么：  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200609235522.png)
* [使用CancelToken来取消请求](https://www.cnblogs.com/hahazexia/p/10001782.html)
* [axios 之cancelToken原理以及使用](http://www.qiutianaimeili.com/html/page/2019/03/8grudzwvfmq.html)
* [axios 之cancelToken原理以及使用](https://www.cnblogs.com/ysk123/p/11544211.html)

更多取消使用的文章：  
* [Axios源码深度剖析](https://juejin.im/post/5b0ba2d56fb9a00a1357a334#heading-28)
* [Vue踩坑日记之cancelToken](https://www.jianshu.com/p/42d1c58e785e)

### data序列化
详细了解可查看：
* [JSON：序列化与反序列化](../../article/JSON：序列化与反序列化)  
* [使用 application/x-www-form-urlencoded 格式](https://www.w3cschool.cn/jquti/jquti-7yuh3608.html)  

## 封装与使用
*为什么我们需要封装axios*：  
* 首先，我们要明白，代码开发尽量遵循一个原则：高内聚，低
* > 这样的代码，才是好代码！
* 封装axios，避免后期万一axios有变动或者更换网络请求模块需要在许多业务代码修改
* > 代码解耦有利于后期维护  
* 通过封装一个地方只做一件事，有利于我们当前只专注于我们想做的功能；后期导出，更有利于我们习惯开发的代码，方便后期使用  
### 简单实例封装**：  
> 我首先想到这种封装：  
```js
// http.js
import axios from 'axios'
// 定义http方法，参数传入：config[axios配置数据，对象{url:'路径',params:{type:'xxx',pages:'1'}}]、resolve[请求成功时处理数据的方法]、reject[请求失败后调用的方法]
export default function http (config, resolve, reject) {
  // 创建axios实例
  const instance = axios.create(config)
  // 发送网络请求
  instance(config)
    .then(res => {
      resolve(res)
    })
    .catch(err => {
      reject(err)
    })
}
```
> 上面封装代码使用：  
```js
// httpTest.js
http({
  baseURL: 'https://v1.hitokoto.cn',
  url: '/nm/summary/28391863,22640061?common=true&lyric=true&quick=true'
},
res => {
  console.log(res)
},
err => console.log(err)
)
```

这个有以下几个问题：  
* 处理方法都作为参数传递进去，一点都不优雅，这可能导致回调地狱的出现，而且`Promise`链式调用的优雅没用上，一点都不美观
* 如果重复调用，那就等于重复创建了axios对象，这样浪费内存，毫无必要
* 于是我们不如返回axios实例，可既然返回实例为什么还要在里面处理，直接promise.then和catch不好么？  

> 所以我们为什么不这样封装？  
```js
// http.js
import axios from 'axios'
// 创建axios实例，传递实例默认的初始化config，比如：默认协议头，默认baseUrl等等
const instance = axios.create({
  timeout: 5000
})
// 导出New出来的对象，避免重复使用重复创建对象！
export default instance
```
> 上面封装代码使用：  
```js
// httpTest.js
http({
  baseURL: 'https://img.alicdn.com',
  url: '/tfs/TB1aQDzJxv1gK0jSZFFXXb0sXXa-148-316.png'
}).then(res => {
  console.log(res.status)
}).catch(err => console.log(err))
```
> 但是，这样封装的话，感觉有没有种脱裤子放屁-多此一举的感觉？  
> 于是，我们决定将封装进行扩展：  

可是，我们之前只是对config大概配置有个了认知，为了方便理解我们后面的封装，先来学习下config里我们用到的配置相关知识：  
### 请求协议头
**post请求常见的数据格式（content-type）**

* `Content-Type: application/json` ：请求体中的数据会以json字符串的形式发送到后端
* > `application/json;charset=utf-8` ---> axios默认的请求头content-type类型
* > 浏览器以 requestPayload 体现
* `Content-Type: application/x-www-form-urlencoded`：请求体中的数据会以普通表单形式（键值对）发送到后端
* > 浏览器以 FormData 体现
* > 如果我们明明`api`、`methods`、`data`全部正确，但后台却无法接受到我们的请求信息，我们需要明白  --->   请求数据格式应该改成这个！
* `Content-Type: multipart/form-data`： 它会将请求体的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，也可以上传文件。
* > 上传 图片/文件 需要用到该格式

*其他* ：  
* `text/plain;charset=UTF-8`：Xmlhttprequest默认格式
* `Content-Type:application/octet-stream`：只可以上传二进制数据，通常用来上传文件，由于没有键值，所以，一次只能上传一个文件。  

更多: [post请求中的参数形式和form-data提交数据时取不到的问题](https://www.cnblogs.com/h-c-g/p/11002380.html)

但是，真的就这么麻烦？  
* 经过测试，axios比我们想象的智能得多！  
* 当我们data格式在表单键值对、JSON格式、formdata等不同格式切换的情况下，`Content-Type`自动的变为对应的不同格式！
* 这意味着：我们不需要一般格式规范的情况下并不需要手动进行相应修改！
> 当然，其实 `Content-Type`切换是有个优先级的：  
* axios默认根据发送的data格式选择合适的 `Content-Type`，但是优先级最低
* > data为`json格式数据`或者`form数据`时，一旦其他位置手动指定则默认转换无效
* > 但是，当data 为 `form-data`时，即使设置错误的比如json格式的 `Content-Type`依旧会默认使用正确的`multipart/form-data; `！
* transformRequest也需要注意，如果在config使用了，也会自动转换Content-Type!
* > 转换规则和默认转换一样，但是优先级比他大！
* > 优先级得根据所在config，`封装处优先级`（比如:http.js）肯定小于`调用处`（比如:main.js）传入的！
* > 所以如果在调用处的config里，则比封装处的config.headers还要大；反之在封装处则仅比默认优先级大。
* 当前调用传入的config.headers优先级几乎最大
* > `form-data`格式的数据例外。。。


### 请求数据
**FormData**  

官方文档：
[FormData - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)  
formdata可在new时传入表单，也可以在new之后使用append插入具体项  
但是，需要注意：  
* 创建时如果传入参数，得是个form的dom对象哦！
```html
<form id="myForm" name="myForm">
  <div>
    <label for="username">Enter name:</label>
    <input type="text" id="username" name="username">
  </div>
  <input type="submit" value="Submit!">
</form>
```
```js
let myForm = document.getElementById('myForm');
let formData = new FormData(myForm);
```
* FormData创建的对象中仅包含正常的表单控件，即具有名称的控件，而不是被禁用和选中（单选按钮和复选框）或未被选中（select中的一个或多个选项）的控件。  

*兼容性* ：  
* formdata在IE上兼容性不好（比如get方法没有）  
* form表单这种数据发送两个相同名称的字段（即键相同，key不同），后端使用request接收时，只需要以数组的形式接收。
```js
// Files
formData.append(name, file, filename);
// Blobs
formData.append(name, blob, filename);
// Strings
formData.append(name, value);
```

最后，我们可以写个完整的`multipart/form-data`代码：  
```js
const FormData = require('form-data')// node.js环境里没有FormData
const data = new FormData()
data.append('file', 'this.file')
data.append('id', 'userID')
data.append('userName', 'name')
data.append('sex', 'sex')
data.append('mobile', 'this.phone')
data.append('email', 'this.email')
data.append('qq', 'this.qq')
data.append('weChat', 'this.WeChat')
http({
  baseURL: 'https://v1.hitokoto.cn', // 不设置baseURL时默认使用当前网站做主域名：localhost:8000
  url: '/nm/summary/28391863,22640061?common=true&lyric=true&quick=true',
  method: 'post',
  // axios会默认根据发送的data格式选择合适的Content-Type，但是优先级最低，一旦其他位置指定则无效！
  data: data
  // Content-Type优先级比下面大
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  // }
  // 序列化请求数据Data，千万注意如果使用该方法会默认将header改变
  // transformRequest: [function (data) {
  //   // data = JSON.stringify(data)
  //   return data
  // }]
}
)
```
抓包数据查看下什么样：  
```
POST https://v1.hitokoto.cn/nm/summary/28391863,22640061?common=true&lyric=true&quick=true HTTP/1.1
Host: v1.hitokoto.cn
Connection: keep-alive
Content-Length: 836
Pragma: no-cache
Cache-Control: no-cache
Accept: application/json, text/plain, */*
Origin: http://localhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36
X-Custom-Header: foobar
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryqplJWG3rHSR0n0Ml
DNT: 1
Referer: http://localhost:8080/index
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9

------WebKitFormBoundaryqplJWG3rHSR0n0Ml
Content-Disposition: form-data; name="file"

this.file
------WebKitFormBoundaryqplJWG3rHSR0n0Ml
Content-Disposition: form-data; name="id"

userID
------WebKitFormBoundaryqplJWG3rHSR0n0Ml
Content-Disposition: form-data; name="userName"

name
------WebKitFormBoundaryqplJWG3rHSR0n0Ml
Content-Disposition: form-data; name="sex"

sex
------WebKitFormBoundaryqplJWG3rHSR0n0Ml
Content-Disposition: form-data; name="mobile"

this.phone
------WebKitFormBoundaryqplJWG3rHSR0n0Ml
Content-Disposition: form-data; name="email"

this.email
------WebKitFormBoundaryqplJWG3rHSR0n0Ml
Content-Disposition: form-data; name="qq"

this.qq
------WebKitFormBoundaryqplJWG3rHSR0n0Ml
Content-Disposition: form-data; name="weChat"

this.WeChat
------WebKitFormBoundaryqplJWG3rHSR0n0Ml--
```
参考：[multipart/form-data请求与文件上传的细节](https://blog.csdn.net/zshake/article/details/77985757)
### 完善封装
> 封装代码扩展：  

我们首先在 项目`src`源代码目录创建一个 `api`或者`network`文件夹，里面存放我们决定封装的多个接口请求文件：
* `env.js`：自动根据当前环境选择恰当的`baseurl`
* `http.js`：对我们的`axios`进行常见的封装与处理：`axios`实例初始化，传入延时时间，请求就加载提示弹窗 - 请求中 ，对请求数据判断 - 如果需要权限就判断协议头是否含有`token`；对返回数据进行判断，成功就取出data传回调用处，失败就取出状态码对应错误信息提示给用户
* `api.js`：导入 `http.js` ，对常用`method`方法进行封装，比如：`get`、`post`等

> 文件新建完毕，里面包含我们准备使用的三个文件：

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200722120302.png)
#### env.js封装完善
> 首先，开始完善`env.js`：  

为什么我们需要该文件？  
因为项目环境可能有`开发环境`、`测试环境`和`生产环境`。通过`node`环境变量来匹配我们预设的接口`baseURL`前缀可以到达开发时不需要来回修改代码的目的。
```js
// ./src/network/env.js
let baseURL
// 根据 process.env.NODE_ENV 区分状态，切换不同的 baseURL
switch (process.env.NODE_ENV) {
  // 注意，如果我们npm scripts里主动传 --mode 参数必须全称，默认的可用简写判断
  // 开发环境，也可简写为：dev
  case 'development':
    baseURL = 'httP://development.xuexizuoye.com/api'
    break
  // 测试环境，虽然官方没指出，但是传递过来可用
  case 'test':
    baseURL = 'httP://test.xuexizuoye.com/api'
    break
  // 生产环境，也可简写为：prod
  case 'production':
    baseURL = 'httP://production.xuexizuoye.com/api'
    break
  default :
    baseURL = 'httP://production.xuexizuoye.com/api'
    break
}
// 根据浏览器本地自动更换接口主域名
function autoChangeBaseURL () {
  const apiURL = localStorage.getItem('apiURL') // 获取浏览器本地存储localStorage中Key为apiURL那一项的值
  if (process.env.NODE_ENV === 'development' && apiURL) { // 判断当前的环境是否为开发环境，如果是，判断apiURL是否存在
    baseURL = apiURL // 将baseURL修改为开发人员在浏览器预设的接口主域名
  }
  return baseURL
}
autoChangeBaseURL()
// console.log(baseURL)
export default {
  baseURL
}
```
上面就是我们的`env.js`封装的全部代码，其中有几个小技巧：  
* 我们通过`process.env.NODE_ENV`自动切换不同的`baseURL`
* 不仅如此，对于我们预设的`baseURL`如果满足不了我们开发小哥哥的测试场景，比如多个小哥哥都要测试，而他们的接口地址不同，我们通过`autoChangeBaseURL`实现根据`localStorage`本地存储自动切换开发人员预设的接口地址
* 设置开发环境自适应接口步骤：
1. 打开我们，并打开控制台(`window`快捷键`F12`, `Mac`快捷键`option`＋`command`＋`i`);
2. 在控制台输入以下代码：
```js
// baseURL格式:后台本地的IP地址(包括端口号)，如http://hs.xuexizuoye.com/api
localStorage.setItem('apiURL','这里面写开发测试想设置的baseURL')
```
3. 刷新页面即可。

**如何自定义`mode`？**

1. 在项目根目录找到`package.json`文件，定位到`scripts`脚本设置
2. 可加入我们的`npm scripts`设置：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200722124635.png)
> 注意：默认无需设置支持的有：`development`、`production`、`test`（[官方](https://www.webpackjs.com/concepts/mode/)没写但确实支持）
3. 对于我们自定义的模式：`testApi`，直接传入`process.env.NODE_ENV`是无法识别的，我们需要在项目根目录新建个文件`env.testApi`，里面写入：`NODE_ENV = 'testApi'`：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200722125009.png)
4. `env.js`里通过`process.env.NODE_ENV`即可接收到该参数，然后我们可以进行想要的设置。

**我们还可以通过`proxy`代理来实现切换`baseURL`**：
```js
const service = axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? `/api` : '/dev',
})
```
> 详细代理配置：[vue.config.js配置](./../vue/vue.config配置.md)
#### http.js封装
```js
import axios from 'axios'
import env from './env'
import qs from 'qs'
// import store from '../store/index';
// import router from '../router'
// 根据不同的状态码，生成不同的提示信息
const showStatus = (err) => {
  console.log('showStatus接收到的错误：')
  console.log(err)
  const status = Object.prototype.hasOwnProperty.call(err, 'response') ? err.message : err.response.status
  let message = ''
  // 这一坨代码可以使用策略模式进行优化
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      // toLogin() // 401: 未登录状态，跳转登录页
      break
    case 403:
      message = '拒绝访问(403)'
      localStorage.removeItem('token')// 登录过期，请重新登录
      config.headers.Authorization = ''
      // store.commit('loginSuccess', null)
      // setTimeout(() => {
      //   toLogin()
      // }, 1000)
      break
    case 404:
      message = '请求出错(404)'
      break
    case 405:
      message = '跨域请求被禁止(405)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = status > 200 && status < 300 ? `服务器接受请求成功，由于部分原因未能正确给出结果：(${status})!` : `接口请求出错：(${status})`
  }
  // alert(`${message}，请求出错！`)// 也可使用ui组件的弹窗或者toast提示等，alert会阻塞代码不推荐
  return `${message}，请检查网络或联系网络管理员！`
}
// 错误处理
const errHandle = (error) => {
  const err = {
    msg: showStatus(error),
    online: window.navigator.online, // 判断是否有网
    errormessage: error // 原始错误代码保存一份方便调试
  }
  // if (!err.online) store.commit('goodNetwork', false)// 断网时向store设置网络状态变量为假
  // 错误抛到业务代码
  return Promise.reject(new Error(err.msg))
}
// 待请求任务队列对象
const pending = {}
// 取消请求令牌
const CancelToken = axios.CancelToken
const removePending = (key) => {
  if (pending[key]) {
    console.log('重复api：' + key + '请求被取消！')
    pending[key]('取消重复请求')// 如果不为假则说明之前添加过方法，调用取消方法将队列里请求取消
  }
  delete pending[key]// 删除队列里的元素
}
// 请求标识生成
const getHttpIdentify = (config, isReuest = false) => {
  let url = config.url
  if (isReuest) {
    url = config.baseURL + config.url// .substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + config.params) : encodeURIComponent(config.url + config.data)
}
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
// const toLogin = () => {
//   router.replace({
//     path: '/login',
//     query: {
//       redirect: router.currentRoute.fullPath
//     }
//   })
// }
// config默认配置
const config = {
  baseURL: env.baseURL,
  timeout: 6000,
  headers: {
    'x-requested-with': 'XMLHttpRequest', // xhr标识
    // 'Content-Type': 'multipart/form-data'
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    // 配置此参数为真表示跨域请求带上cookie凭证，MDN上写默认为false，但是实际上似乎默认为true（当该行不写时可测试）
    withCredentials: true, // [跨域资源共享 CORS 详解 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/04/cors.html)
    'Accept-Language': 'zh-cn,zh;q=0.5', // 浏览器支持的语言分别是简体中文和中文，优先支持简体中文。
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      // 单点登录或者其他功能的通用请求头，可一并配置
    }
  },
  validateStatus: function (status) {
    // 当返回状态码为200才判断为真
    return status === 200
  }
}
// 创建axios实例
const http = axios.create(config)
// 请求拦截器
http.interceptors.request.use((config) => {
  const qsMethods = ['post', 'put', 'patch']
  // 如果是提交数据的method则将data序列化
  if (qsMethods.indexOf && typeof (qsMethods.indexOf) === 'function' && (qsMethods.indexOf(config.method) > -1)) {
    config.data = qs.stringify(config.data)
  }
  // 拦截重复请求(即当前正在进行的相同请求)
  const requestData = getHttpIdentify(config, true) // 生产标识请求
  removePending(requestData, true)// 取消重复请求
  config.cancelToken = new CancelToken(cancel => { // 创建当前请求的取消方法
    pending[requestData] = cancel// 将该请求的取消方法加入队列对象作为标识字段的值
  })
  // 如果不是登录页面，给headers添加一个token令牌标识身份
  if (config.url.toLowerCase().indexOf('login') > -1 && config.headers.Authorization) {
    config.headers.Authorization = localStorage.getItem('token') || ''
  }
  return config
}, (error) => {
  console.log('请求前出现错误：' + error)
  return errHandle(error)
})
// 响应拦截器
http.interceptors.response.use((response) => {
  // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
  const data = response.data ? response.data : response.request.responseText || {}
  return data
}, (error) => {
  console.log('响应出现错误：' + error)
  return errHandle(error)
})
export default http
```
> 还可以增加`取消全局Loading`、`上传文件`、`上传出错``下载文件`以及`下载出错`等提示，不过暂时不需要就不搞了。
#### api.js封装
```js
import http from './http'
// 封装常用的get/post方法
export default {
  get (url, params = {}, config = {}) {
    return http.get(url, {
      params,
      ...config
    })
  },
  post (url, data = {}, config = {}) {
    return http.post(url, data, config)
  }
}
```
简单的方法就封装完毕啦，我们可以去使用了。

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200722204556.png)
在项目入口`main.js`上引入我们的常用方法`api.js`，并将包含`get`与`post`方法的实例挂载到我们`Vue`原型上，方便我们的`Vue`实例调用

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200722204743.png)
在`Vue`组件上使用我们封装的方法

#### 各接口抽离封装
你以为就上面那样就结束了？哈哈，还没呢。

我们的项目往往有许许多多的`api`请求，比如：`login`登录请求、`article`文章请求、`shop`商品请求等等，我们可以将这些不同组件需要的请求各自抽取成新的`.js`文件  
* `shop.js`含有：商品列表`shopList`、商品信息`shopInfo`、商品详情`shopDetail`等方法
#### 接口集中管理index.js封装
`api`目录下新建个`index.js`文件，里面将我们各个接口文件导入再一同导出，这样方便Vue组件导入所需的接口方法
```js
/** 
 * api接口的统一出口
 */
// 文章模块接口
import article from '@/api/article';
// 其他模块的接口……

// 导出接口
export default {    
    article,
    // ……
}
```
再修改`main.js`和`.vue`组件就可实现直接调用方法获取信息，而不需要操心太多的不相干业务。
> 当然，我们需要注意一个[细节](https://segmentfault.com/a/1190000012533993)：**箭头函数内部的`this`是词法作用域，由上下文确定，因此箭头函数在`Promise`特别常用。**

> 通过箭头函数，其`this`就与它所在的`function`的`this`一致，使得可以获取到`Vue`组件实例的数据
## 更多文档
* [Axios起步_w3cschool](https://www.w3cschool.cn/jquti/jquti-kb3a35x1.html)  
* [axios中文文档](http://www.axios-js.com/zh-cn/docs/)  
* **[axios官方文档 - npm](https://www.npmjs.com/package/axios)**  
* [axios全攻略 | 羸弱的小金鱼](https://ykloveyxk.github.io/2017/02/25/axios%E5%85%A8%E6%94%BB%E7%95%A5/#more)
* 相关文章：  
* > [Vue项目经验总结（持续更新中...）](https://juejin.im/post/5e82dca6e51d4546fd48039b#heading-3)
* > [如何使用axios发出高大上的HTTP请求](https://juejin.im/post/5e64c66e6fb9a07ccd5197e5)  
[axios详解](https://juejin.im/post/5e82b4db51882573ad5e0338)  
[Axios你可能不知道使用方式 - 掘金](https://juejin.im/post/5eaa29b6e51d454db55fa2ec)  
* > [聊聊 Vue 中 axios 的封装](https://juejin.im/post/5da90c3e6fb9a04e031c0413)  
* > [vue中Axios的封装和API接口的管理](https://juejin.im/post/5b55c118f265da0f6f1aa354)  
* > [axios怎么封装，才能提升效率？](https://juejin.im/post/5ea15045e51d4546e14f6aa5#heading-1)
* > [怎样让后台小哥哥快速对接你的前端页面](https://lindaidai.wang/2019/09/24/webNotes/advanced/JavaScript/%E6%80%8E%E6%A0%B7%E8%AE%A9%E5%90%8E%E5%8F%B0%E5%B0%8F%E5%93%A5%E5%93%A5%E5%BF%AB%E9%80%9F%E5%AF%B9%E6%8E%A5%E4%BD%A0%E7%9A%84%E5%89%8D%E7%AB%AF%E9%A1%B5%E9%9D%A2/)
* > [HTTP协议网络请求状态码，详细~](https://blog.csdn.net/u011506543/article/details/81676500)