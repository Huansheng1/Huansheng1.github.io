# nodeJs实现http服务
## 框架对比
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201024174233.png)
### 内置的`http`模块
优点：
1. 无需安装即可使用
2. 官方提供

缺点：
1. 功能比较简陋
2. 代码多时不方便管理

代码：
```js
const http = require("http")
// 创建一个服务器对象
// 请求对象request：req
// 响应对象response：res
const server = http.createServer((req, res) => {
    // 表面上request.url获取请求地址足够我们使用了，可是实际情景里我们需要对用户请求的不同地址进行不同处理
    // 如，我们通过判断用户是否是想请求登录，给他返回：登录成功 的字样，直接req.url==='/login'表面好像可以
    // 当用户请求的地址如这样：/login?return=user&&demo=test/login；我们就难以精准判断当前用户请求的地址了！（即使使用indexOf()来判断）
    // 方法一：我们可使用内置的URL对象来解析
    const urlParse = new URL(req.url, `http://${req.headers.host}`)
    // URL {
    //     href: 'http://localhost:8888/login?return=user',
    //     origin: 'http://localhost:8888',
    //     protocol: 'http:',
    //     username: '',
    //     password: '',
    //     host: 'localhost:8888',
    //     hostname: 'localhost',
    //     port: '8888',
    //     pathname: '/login',
    //     search: '?return=user',
    //     searchParams: URLSearchParams { 'return' => 'user' },
    //     hash: ''
    //   }
    console.log(urlParse)
    // 方式二：我们使用url模块来解析
    const url = require("url")
    // Url {
    //     protocol: null,
    //     slashes: null,
    //     auth: null,
    //     host: null,
    //     port: null,
    //     hostname: null,
    //     hash: null,
    //     search: '?return=user',
    //     query: 'return=user',
    //     pathname: '/login',
    //     path: '/login?return=user',
    //     href: '/login?return=user'
    //   }
    const urlParseObj = url.parse(req.url)
    console.log(urlParseObj)
    // 要获取用户请求的数据怎么办？我们可使用内置模块querystring
    const querystring = require("querystring")
    // { return: 'user', demo: 'test/login' }
    console.log(querystring.parse(urlParseObj.query))
    // 如果是Post类型的请求，我们如何获取Post的body数据呢
    // 这时候我们就要想起来，NodeJs里 所有的流都是 EventEmitter 的实例。因此我们可通过监听data数据拿到我们想要的东西

    // 默认是buffer格式的，如果我们想要直接获得某种格式，可先手动设置下
    req.setEncoding("utf8")
    req.on("data", (data) => {
        const bodyData = data
        // 由于是异步的，因此我们都暂时挪到这里来
        res.write(`请求地址（注意：该地址不包含主域名和端口号）：${req.url}；\n
    请求路径：${urlParse.pathname}；\n
    请求参数：${JSON.stringify(querystring.parse(urlParseObj.query))}；\n
    请求类型：${req.method}；\n
    请求数据：${bodyData}；\n
    请求协议头：${JSON.stringify(req.headers)}；\n
    `)
        res.end("Http 你好！")
    })
})
// 监听端口和ipv4地址
// 注意，浏览器请求网址时默认还会请求：/favicon.ico，因为如果你在上面打印的话，会打印两遍，因此不必惊讶
server.listen(8888, "0.0.0.0", () => {
    console.log("服务器启动/监听成功")
})

// 我们还可以创建多个服务器对象
// 上面的createServer实际上是下面这种方式的语法糖
const otherServer = new http.Server((req, res) => {
    // 设置状态码，设置协议头
    // res.statusCode = 200
    // res.setHeader("Content-Type", "text/plain;")

    // 一次性搞定，设置返回状态码和协议头
    // text/plain只会当成文本解析，如果想让他当网页文件解析应当如下设置
    // 这样浏览器就会解析标签了
    res.writeHead(200, {
        "Content-Type": "text/html;charset=utf8;",
    })
    res.end("<h1>这是一个h1标签</h1>")
})

// 监听端口和ipv4地址
otherServer.listen(8000, "0.0.0.0", () => {
    console.log("第二个服务器启动/监听成功")
})
```
效果：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201129124731.png)

#### 发送请求
1. `Get`请求：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201130205538.png)
2. `Post`请求：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201130205733.png)

> 注意：
* `res`参数其实与之前的`request`参数是一个对象类型
* `Post`发送请求需要通过`end`表示配置结束了才会真正发送数据
* 现在我们通常使用`axios`库发送请求而不是原生的。

#### 文件上传
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201129202412.png)
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201129202454.png)
### `express`框架
优点：
1. 最出名的`node`服务器开发框架
2. 齐全完善，功能庞大

缺点：
1. 在回调函数里难以处理异步代码
* > 比如，在回调函数里如果有 定时器等异步代码，由于 异步任务与同步任务不在一个 任务队列，这就导致 异步代码的回调函数里如果出现异常，在外部代码里是无法通过`try`、`catch`来捕获到的，错误直接抛到全局，导致`node`服务出现异常

* > 原因：异常抛出机制是通过 在当前函数调用栈 一层一层往上层抛出的，`try`、`catch`捕获只要在上层代码写了就能捕获到下面的抛出的异常，但 异步任务调用栈 相比于 同步任务是全新的调用栈（因为异步是开其他线程来实现的异步呀），这就自然没法捕获异常了。

#### 基本使用
> [Express - 基于 Node.js 平台的 web 应用开发框架 - Express 中文文档](https://www.expressjs.com.cn/)

```js
const express = require("express")

const app = express()

// 通用中间件，所有请求都能匹配到
app.use((req, res, next) => {
    console.log("通用中间件，可以进行通用的操作、拦截等……")
    // 不用next的话无法进入下一个中间件，且如果还没有res.end来标志结束http服务，那么客户端会一直请求
    next()
})

// 带路径匹配的中间件
// 代码功能类似于：app.use(express.urlencoded())
// 官方推荐传入一个参数：{extended:true}，然后该模块的方法就会使用qs模块解析而不是内置的querystring
// qs和query-string有什么区别？ - https://segmentfault.com/q/1010000012370558
app.use("/upload", (req, res, next) => {
    console.log("用户上传了某些数据！", req.headers["content-type"])
    if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
        const querystring = require("querystring")
        req.on("data", (params) => {
            req.body = querystring.parse(params.toString())
            next()
        })
    } else {
        console.log("不处理的数据")
        next()
    }
})

// 内置的Json内容解析中间件,通过该方法下一个中间件可通过res.body拿到解析后的json数据
app.use(express.json())

// 功能类似于如下代码：
// app.use((req, res, next) => {
//     if (req.headers["content-type"] === "application/json") {
//         req.on("data", (params) => {
//             req.body = JSON.parse(params.toString())
//             next()
//         })
//     }
// })

app.use((req, res, next) => {
    console.log("看看现在的数据：", req.body)
    next()
})

// 带路径和方法匹配的特殊中间件
app.get("/login", (req, res, next) => {
    console.log("提交了登录信息：")
    res.end("登录成功！")
    // res.end返回数据便代表着结束了当前请求，因此下面的返回不会执行返回给客户端
    res.end("返回2")
    next()
})

// 带路径和方法匹配的特殊中间件
app.post("/upload", (req, res, next) => {
    res.end("提交成功！")
    next()
})

// 连续的中间件
app.use(
    (req, res, next) => {
        console.log("最后的中间件捕获处理他。")
        // 下一个是第二个函数，如果next里面丢数据等于出现错误需要处理哦，因此不要往next里丢数据来传递
        next()
    },
    (req, res) => {
        console.log("捕获错误")
    }
)

app.listen(8888, () => {
    console.log("express服务器启动成功")
})
```
#### multer表单数据解析模块
上面我们介绍了，`express.json() - Json解析中间件`、`express.urlencoded() - Urlencoded解析中间件`，但是对于`form-data 表单数据`我们会发现内置的中间件是不具备的，这时我们需要引入`express`官方提供的`第三方`模块 - `multer`：

1. 首先我们安装下：`npm install multer`
2. 解析常用表单键值对：
```js
// 引入模块
const multer = require("multer")
// 创建Multer类
const upload = multer()
// 解析常见的键值对表单数据
app.use(upload.any())
```
3. `postman`测试发送表单数据：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201202212418.png)
4. 日志打印，发现运行成功：
```bash
{
  name: 'ted',
  age: '18',
  shuaiqi: '9999999999999999999999999999'
}
```
5. 获取上传文件怎么做呢？
```js
// 引入模块
const multer = require("multer")
// 创建Multer类，为了保存文件我们需要在类名配置里增加个dest，这里我们表示将文件保存到当前目录的images目录里
// 注意，这里的目录如果没有是会自动创建的
const upload = multer({
    dest: "./images",
})
// 解析常见的键值对表单数据，我们保存单个文件且表单的键名为file
app.use(upload.single("file"))
// 如果没有键名的话就传递空字符串即可
// app.use(upload.single(""))
```
6. `postman`继续测试，上传图片：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201202215018.png)
7. 在设置的目录上果然保存了图片：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201202215052.png)
8. 可以发现，保存的文件没有后缀名，而且文件名也是乱七八糟的，但是这其实也是配置的：
```js
const path = require("path")
// 引入模块
const multer = require("multer")
const storage = multer.diskStorage({
    // 设置目录地址
    destination: (req, file, cb) => {
        // 回调函数需要传递两个参数，第一个是错误，第二个是资源保存的目录地址
        // 注意，这里的目录就必须事先创建，不然会报错
        cb(null, "./images/")
    },
    // 设置文件名
    filename: (req, file, cb) => {
        // 将文件名设置为当前时间戳，再拼接文件原始文件的后缀名 - file对象里是可取到原始文件名
        cb(null, Date.now() + path.extname(file.originalname))
    },
})
// 创建Multer类，为了保存文件我们需要在类名配置里增加个dest，这里我们表示将文件保存到当前目录的images目录里
const upload = multer({
    storage,
})
// 解析常见的键值对表单数据，我们保存单个文件且表单的键名为file
app.use(upload.single("file"))
// 如果没有键名的话就传递空字符串即可
// app.use(upload.single(""))
```
9. 要想支持多个文件上传我们就需要使用`multer.array()`来处理，其他的与单文件一致：
```js
// 限定上传文件路径，处理文件格式，打印上传文件信息
app.use("/upload", upload.array("file"), (req, res, next) => {
    console.log("其实我们是可获取到上传文件信息的：", req.files)
    next()
})
```
10. 查看我们打印的文件对象数据：
```bash
其实我们是可获取到上传文件信息的： [
  {
    fieldname: 'file',
    originalname: 'c\u0019h�\u000f1.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: './images/',
    filename: '1606918150726.png',
    path: 'images\\1606918150726.png',
    size: 140732
  },
  {
    fieldname: 'file',
    originalname: 'c\u0019h�\u000f2.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: './images/',
    filename: '1606918150734.png',
    path: 'images\\1606918150734.png',
    size: 85616
  }
]
```

> [multer官方中文文档](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md)

#### morgan日志记录模块
1. 安装`express`提供的日志记录模块：`npm install morgan`
2. 编写简单例子：
```js
const express = require("express")

const fs = require("fs")

const app = express()

const morgan = require("morgan")

const writeStream = fs.createWriteStream("./log/log.text", {
    flags: "a+",
})

app.use(
    morgan("combined", {
        stream: writeStream,
    })
)

app.post("/login", (req, res, next) => {
    res.end("登录成功！")
})

app.listen(8888, () => {
    console.log("express服务器启动成功")
})
```
#### 请求参数获取
1. 示例代码：
```js
const express = require("express")

const app = express()

app.get("/search/:key", (req, res, next) => {
    res.end("动态参数params - 请求数据：" + JSON.stringify(req.params))
})

app.get("/query", (req, res, next) => {
    res.end("请求条件query - 请求数据：" + JSON.stringify(req.query))
})

app.listen(8888, () => {
    console.log("express服务器启动成功")
})
```
2. 请求测试：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201202225010.png)、![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201202225555.png)
#### 返回数据常见方法
```js
const express = require("express")

const app = express()

app.post("/register", (req, res, next) => {
    // 设置返回状态码
    res.status(201)

    // 默认返回的数据是字符串

    // 设置返回协议头告诉客户端返回数据是个json
    // res.type("application/json")
    // res.end('{"name":"ted","age":18}')

    // 等价于上面两步，直接返回JSON格式数据
    res.json({ name: "ted", age: 18 })
})

app.listen(8888, () => {
    console.log("express服务器启动成功")
})
```
#### 路由
上面我们代码都集中在`index.js`里面写入接口数据，这有一个问题，现在我们的`demo`表面看起来没啥，但如果代码多了那么这个项目的文件将会极其混乱，为此我们可利用路由机制，将同一个模块的功能接口抽离成单独的路由模块，再引入到主程序里使用，就避免了不好管理的问题：

1. 封装`users`用户操作的路由模块：
```js
const express = require("express")

const user = express.Router()
// 模拟查询用户数据
user.get("/:id", (req, res, next) => {
    res.json({
        name: "ted",
        age: 18,
    })
})
// 模拟注册用户数据
user.post("/", (req, res, next) => {
    res.status(201)
    res.json("创建用户成功")
})
// 模拟删除用户数据
user.delete("/:id", (req, res, next) => {
    res.json("删除编号为" + req.params.id + "的用户成功")
})

module.exports = user
```
2. 主程序导入并使用 用户路由模块：
```js
const express = require("express")

const app = express()
// 上面的路由模块文件
const userRouter = require("./user-router")
// 注意用法和koa有点不一样
app.use("/users", userRouter)

app.listen(8888, () => {
    console.log("express服务器启动成功")
})
```
#### 使用/部署打包完毕的静态资源
```js
const express = require("express")

const app = express()
// 支持静态目录地址或者绝对路径
app.use("/", express.static("./"))

app.listen(8888, () => {
    console.log("express服务器启动成功")
})

```
通过`express.static()`可快速搭建部署静态的资源文件，上面代码，我们启动后，访问服务器地址将会自动去`./dist`目录下寻找是否有`index.html`，有就返回，于是我们的网站就正常访问进去了：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201203205139.png)

但是我们需要注意，通过`a`标签链接的相对页面地址得带上`.html`后缀，不然会报错`404`找不到资源哦。
#### 全局错误处理中间件
```js
const express = require("express")

const app = express()
app.get("/err", (req, res, next) => {
    // 模拟通过next抛出一个错误
    next(new Error("错误信息测试"))
})
// err参数表示告诉express我们这是一个处理错误的中间件,如果前面有中间件通过next传递了错误信息这里就能捕获到
// 通常我们也是通过全局中间件来处理错误的
app.use((err, req, res, next) => {
    console.log(err)
    let statuCode = 400
    let message = "该资源暂未找到"
    switch (err.message) {
        case "错误信息测试":
            message = "我们模拟的错误信息"
            break

        default:
            break
    }
    res.json({
        errCode: statuCode,
        errMessage: message,
    })
})

app.listen(8888, () => {
    console.log("express服务器启动成功")
})
```
这里我们需要注意：
1. 错误处理中间件只能处理通过`next()`传递的错误信息，因此像上面我们通过`static()`寻找静态资源没找到时404错误是无法捕获到的
2. `next()`中间件第一个参数为`err`即代表这是一个错误处理中间件，因此不要传递非错误信息的数据，因为如果传递参数`express`便认为这个是抛出一个错误信息，将不会执行下面的正常中间件，而是让错误处理中间件处理相应数据。
#### 脚手架
1. 安装：`npm install -g express-generator`
2. 创建项目：`express express-demo`
3. 安装依赖：`npm install`
4. 启动项目：`node bin/www`
5. 访问默认端口：`localhost:3000`
### `koa`框架
优点：
1. 极简却高性能
2. 完善的洋葱模型，相比于`express`能通过`async`和`await`在中间件里支持 异步操作
3. 可扩展性强，符合现在热门的 `微内核`、`微服务` 的潮流

缺点：
1. 由于太简洁，需要依赖不少第三方的中间件，因此有时候也可以说是略带简陋

#### 基本用法
1. `index.js`主体代码：
```js
const Koa = require("koa")
// 区别一：koa模块导出的是一个类，因此我们通过new关键字来创建一个对象，
// 而express导出的是个方法，因此不需要new关键字
const app = new Koa()

// koa中间件的回调函数只有两个：context上下文和next
// Koa路由不知道app.get()这种带请求方式匹配中间件
// 也不支持app.use('/login',回调方法)这种带路径匹配的中间件
// 还不支持app.use(中间件1,中间件2,中间件3)这种连续中间件

// koa想获取Post这种类型传递过来的数据，如果不通过ctx.req.on('data',回调函数)获取的话难以处理；
// 在express里我们通过express.json()中间件全局解析，然后在后面通过request.body即可获取到
// 在koa里我们想需要这种类似功能可使用第三方模块 - npm install koa-bodyparser
const bodyParser = require("koa-bodyparser")
// 注意该模块不支持form-data格式的数据解析
app.use(bodyParser())

// 测试是否正常解析
app.use((ctx, next) => {
    // 获取解析到的body数据：{"name":"huansheng","age":18}
    console.log("获取解析到的body数据：" + JSON.stringify(ctx.request.body))
    next()
})

// 想要解析form-data，我们还需要使用另一个第三方库：koa-multer
const multer = require("koa-multer")
// 用法几乎和express的multer一致
const upload = multer()
app.use(upload.any())

// 这里需要强烈注意！！！！它放的位置和上面不一样，他放在ctx.req对象里！
app.use((ctx, next) => {
    // 获取解析到的formData数据：{"name":"ted","age":"18","shuaiqi":"9999999999999999999999999999"}
    console.log("获取解析到的formData数据：" + JSON.stringify(ctx.req.body))
    next()
})

app.use((ctx, next) => {
    // ctx里包含了ctx.request和ctx.response ，作用类似于req,res
    // 注意，其实还要ctx.req和ctx.res属性，这个是nodeJs原生属性，相比于koa上面提供的对象，信息更多，但比较复杂，一般不使用
    // ctx.request是koa提供的请求对象，比较简洁明了，ctx.req是node原生的request对象，信息更多
    // console.log(ctx.req)

    // 注意：koa里是没有ctx.params和ctx.request.params的！
    console.log(ctx.params)
    console.log(ctx.request.params)
    // 但提供了以下常见参数：
    // ctx.body（response对象里的）
    // ctx.query(request对象)
    // console.log(ctx.request, ctx.response)

    // koa里ctx.request没有.end方法
    // 当然，也可以这样做：res.response.body = "koa，你好！"
    ctx.body = "koa，你好！"

    // koa因为不是类似express.end这种方法，一次调用就关闭当前流，因此如果赋值两次，那么客户端接受到的数据是后面的那次
    ctx.body = "二次返回数据"
    next()
})

// 第三方路由：koa-router
const userRouter = require("./user-router")
// 导入并使用用户路由
app.use(userRouter.routes())
// 我们还可以通过allowedMethods方法对我们未处理的请求方式，返回koa-router给我们预设的默认错误提示而不是koa自带的not found提示
app.use(userRouter.allowedMethods())

// 区别二,express服务如果没有匹配到中间件里使用res.end中止；
// 那么客户端请求会一直等待，而koa则是直接返回404Not Found提示
app.listen(8888, () => {
    console.log("Koa服务器启动成功")
})
```
2. `user-router.index`用户路由：
```js
// 第三方热门路由模块：npm install koa-router
// 地址：https://github.com/ZijianHe/koa-router
const Router = require("koa-router")
// 可以在创建路由时直接配置该路由前缀，这里我们设置用户路由模块统一前缀
const router = new Router({
    prefix: "/users",
})
// koa-router和express很像，支持express的带路径、带方法、连续中间件等express支持但koa不支持的写法
router.get("/:id", (ctx, next) => {
    // console.log(ctx.request.params.id)
    // 效果一致，下面的是上面写法的别名

    // 注意，koa-router里ctx.query不行，会报错，两种方法：ctx.request.querystring解析后对象或者ctx.querystring可获取原生的未解析数据：
    // { test: 'demo' } test=demo
    console.log(ctx.request.query, ctx.querystring)
    ctx.body = `查询${ctx.params.id}用户信息成功，查询数据：${ctx.querystring}！`
    next()
})
router.post("/", (ctx, next) => {
    // 注意，想拿到post里的数据就得通过ctx.req来监听Node原生数据
    ctx.req.on("data", (data) => {
        ctx.body = `创建${data.toString()}用户成功！`
    })
    next()
})
router.put("/:id", (ctx, next) => {
    // 注意：koa-ctx里的ctx对象有params属性但不代表koa官方的ctx里有！
    console.log(ctx.params, ctx.request.params)
    // 这种写法也可，但推荐别名写法，更简单
    ctx.body = `更新${ctx.request.params.id}用户信息成功！`
    next()
})

module.exports = router
```
#### 响应与编码
`koa`中我们一般对响应进行如下设置：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201205165302.png)
```js
const Koa = require("koa")
const app = new Koa()

// koa里想要部署，也需要使用一个类似express的static模块：koa-static
// 1. npm install koa-static
const static = require("koa-static")

app.use(static("./images"))

// 测试是否正常解析
app.use((ctx, next) => {
    if (ctx.url === "/test") {
        // 设置返回状态码
        ctx.status = 201
        // 注意，Koa有个优点，不需要你手动设置返回编码，你给个JSON格式的对象将会自动将返回设置为JSON
        // 你可以理解为默认为express里的res.json()
        ctx.body = {
            name: "test",
            age: 18,
            address: "中国 上海市 静安区",
        }
    }
    next()
})

// 错误处理：通过ctx.app这个koa全局对象实例来进行全局处理
app.use((ctx, next) => {
    if (ctx.url === "/err") {
        // 注意，ctx是第三个参数传递过去的
        ctx.app.emit("error", new Error("错误处理测试"), ctx)
    }
})
// 参数都是上面事件触发的地方传递过来的
app.on("error", (err, ctx) => {
    ctx.status = 400
    ctx.body = err.message
})

app.listen(8888, () => {
    console.log("Koa服务器启动成功")
})
```
## RPC通信
> 全称：`remote procedure call` - 远程过程调用

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201024175237.png)
### protocol buffers
> 二进制通信的话，如果像`JSON`一样简单的将对象数据与二进制数据进行互相转化？

1. 定义协议配置文件：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201024211026.png)
2. 通过定义好的格式配置文件生成二进制对象数据：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201024210627.png)
### Http通讯
> 使用到的内置模块：`http`
### Socket通讯
> 使用到的内置模块：`net` - `TCP协议`

## 实现简单下载页服务
> 使用到的模块：
* [`koa-mount`  第三方路由模块](https://www.npmjs.com/package/koa-mount)
* [`koa-static`  返回静态文件给浏览器的模块](https://www.npmjs.com/package/koa-static)
* [`nodemon`  检测`nodeJs文件`发生变更自动重启服务的模块](https://www.npmjs.com/package/nodemon)

因此，我们需要安装它们：
```bash
npm install koa
npm install koa-mount
npm install koa-static
npm install nodemon
```
然后，我们将 极客时间 的App下载页保存到本地，再通过`koa-static`实现浏览器请求返回 我们本地`node`服务器静态资源的效果。

### 返回本地下载页
1. 初步代码：
```js
const Koa = require('koa')
const static = require('koa-static')
const mount = require('koa-mount')
const fs = require('fs')
// 创建koa实例
const app = new Koa()
// 通过mount设置路由，通过fs读取本地数据
app.use(mount('/app.index',async (ctx)=>{
  // console.log(__dirname+'/static/download.html')
  ctx.body = fs.readFileSync(__dirname+'/static/download.html','utf-8')
}))

// 监听端口
app.listen(8080)
```
2. 通过`nodemon`运行服务![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201025174937.png)，浏览器访问本地地址：`http://localhost:8080/app.index`

3. 网页效果图：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201025174917.png)
4. 发现木有，样式乱了，通过`F12`我们可知道原因为`html`请求的静态文件找不到：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201025175055.png)
5. 通过`koa-static`中间件返回浏览器静态资源正确文件：
```js
const Koa = require('koa')
const static = require('koa-static')
const mount = require('koa-mount')
const fs = require('fs')
// 创建koa实例
const app = new Koa()
// 设置请求静态文件时从哪寻找
app.use(static('./static'))
// 通过mount设置路由，通过fs读取本地数据
app.use(mount('/app.index',async (ctx)=>{
  console.log(__dirname+'/static/download.html')
  ctx.body = fs.readFileSync(__dirname+'/static/download.html','utf-8')
}))

// 监听端口
app.listen(8080)
```
6. 成功效果图：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201025175527.png)

### 为什么使用`koa-mount`中间件
因为 该中间件 第二个参数不一定是单纯的中间件函数，也可以是`koa`实例；

这就意味着，我们可将上面的下载页代码的`koa`实例 导出，再在一个总的`koa`实例里导入，即可实现 路由嵌套与复用。


让我们来改造一下之前的代码：
1. 修改上面代码，将下载页的`koa`实例导出
```js
// demo.js
const Koa = require('koa')
const static = require('koa-static')
const mount = require('koa-mount')
const fs = require('fs')
// 创建koa实例
const app = new Koa()
// 设置请求静态文件时从哪寻找
app.use(static('./static'))
// 通过mount设置路由，通过fs读取本地数据
app.use(mount('/app.index',async (ctx)=>{
  console.log(__dirname+'/static/download.html')
  ctx.body = fs.readFileSync(__dirname+'/static/download.html','utf-8')
}))

// 监听端口
// app.listen(8080)
module.exports = app
```
2. 在`app.js`文件中导入并使用：
```js
// app.js
const koa = require('koa')
const mount = require('koa-mount')
// 导入上面导出的下载页koa实例
const download = require('./demo')

const app = new koa()
// 这样就实现了路由嵌套，上面的下载页代码生效且在`/index/`路径下
app.use(mount('/index',download))

app.listen(8080)
```
3. 运行`nodemon app.js`并打开`http://localhost:8080/index/app.index`查看效果：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201025175527.png)
4. 当前代码文件：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201025180513.png)