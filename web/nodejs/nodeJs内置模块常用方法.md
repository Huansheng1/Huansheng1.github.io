# NodeJs常用内置模块
> [Node.js API 文档](http://nodejs.cn/api/)
## Path路径模块
### resolve路径处理
```js
const path = require('path');
console.log(path.resolve('./../ douban-cloud','test.txt'));

// 输出结果：
// C:\Users\Administrator\Desktop\web\code\ douban-cloud\test.txt
```
优点：
1. 支持根据相对路径自动完善成绝对路径
2. 根据当前系统自动使用合适的路径符号，我们例子里在`window10`系统上就自动将路径改为了`\`符号

### join路径拼接
```js
const path = require('path');
pathName = '/demo';
fileName = './bar.js';

console.log(path.join(pathName,fileName));

console.log(path.resolve(pathName,fileName));

// 输出结果：
// \demo\bar.js

// C:\demo\bar.js
```
看见区别没有？
1. `join`单纯只是处理路径与目录的拼接，不会特意给我们做额外的判断 - 是否是`/`开头的绝对路径、`./`、`../`开头的相对路径
2. `resolve`会对目录开头的字符进行判断，最后会给我们返回绝对路径，而不只是路径拼接结果

### 文件、路径信息
```js
const path = require('path');
const filePath = path.resolve('./../ douban-cloud','test.txt');
console.log(filePath);
// 获取文件目录名
console.log(path.dirname(filePath));
// 获取文件名
console.log(path.basename(filePath));
// 获取文件扩展名
console.log(path.extname(filePath));

// 输出结果：
// C:\Users\Administrator\Desktop\web\code\ douban-cloud\test.txt
// C:\Users\Administrator\Desktop\web\code\ douban-cloud
// test.txt
// .txt
```
## fs文件系统模块
### stat文件信息读取
```js
const fs = require("fs")
fileName = "./fs-demo.txt"
// 同步读取文件信息
console.log(fs.statSync(fileName))
// 异步回调方式读取文件信息
fs.stat(fileName, (err, statInof) => {
    if (err) {
        console.log("出错了：", err)
        return
    }
    console.log(statInof)
})
// 异步Promise的方式读取文件信息
fs.promises
    .stat(fileName)
    .then((statInof) => console.log(statInof))
    .catch((err) => console.log("出错了：", err))
// 输出结果：
// Stats {
//     dev: 2117099865,
//     mode: 33206,
//     nlink: 1,
//     uid: 0,
//     gid: 0,
//     rdev: 0,
//     blksize: 4096,
//     ino: 13510798882128034,
//     size: 21,
//     blocks: 0,
//     atimeMs: 1605976652960.1448,
//     mtimeMs: 1605976651954.1394,
//     ctimeMs: 1605976651954.1394,
//     birthtimeMs: 1605976645380.3206,
//     atime: 2020-11-21T16:37:32.960Z,
//     mtime: 2020-11-21T16:37:31.954Z,
//     ctime: 2020-11-21T16:37:31.954Z,
//     birthtime: 2020-11-21T16:37:25.380Z
//   }
```
注意：
* 在`node`里面，回调函数的第一个参数默认是错误信息哦！
### fd文件描述符
```js
const fs = require("fs")
fileName = "./fs-demo.txt"
// fd是打开的当前文件句柄（描述符），通过该描述符可以操作打开的文件
const fd = fs.openSync(fileName)
// 同步读取文件信息,与路径相比，区别就是方法名前面多了f
console.log(fs.fstatSync(fd))
// 异步回调方式读取文件信息
fs.fstat(fd, (err, statInof) => {
    if (err) {
        console.log("出错了：", err)
        return
    }
    console.log(statInof)
    // 始终关闭文件描述符！
    // 大多数操作系统限制在任何给定时间内可能打开的文件描述符的数量，因此当操作完成时关闭描述符至关重要。
    //  如果不这样做将导致内存泄漏，最终导致应用程序崩溃。
    fs.close(fd, (err) => {
        if (err) throw err
    })
})

// 异步Promise的方式读取文件信息，注意这里就有点特殊，Promise操作不再是方法前面加上f代表使用fd文件描述符操作

// 与基于回调的 API（如 fs.fstat()、 fs.fchown()、 fs.fchmod() 等）不同，基于 promise 的 API 不使用数字文件描述符。
// 而是，基于 promise 的 API 使用 FileHandle 类，以帮助避免在解决或拒绝 Promise 后意外泄漏未关闭的文件描述符。
let filehandle = null
fs.promises
    .open(fileName)
    .then((filehandle) => {
        console.log(filehandle)
        filehandle = filehandle
        filehandle
            .stat()
            .then((statInof) => console.log(statInof))
            .catch((err) => console.log("出错了：", err))
            .finally(() => filehandle.close())
    })
    .catch((err) => console.log(err))

// stat对象也有方法哦！
const stat = fs.statSync(fileName)
console.log(stat.isDirectory())
console.log(stat.isFile())
```
### writeFile写入文件
```js
const fs = require("fs")
fileName = "./fs-demo.txt"
// 同步写入
fs.writeFileSync(fileName, "我写入了同步！", { flag: "a+" })
// 异步回调方式写入文件
// 文件路径，写入内容， 模式设置为追加，错误回调处理
fs.writeFile(fileName, "我写入了异步！", { flag: "a+" }, (err) => {
    if (err) {
        console.log("出错了：", err)
        return
    }
})
// 异步Promise形式
// 注意打开时就需要指定模式打开，不然会报错 [Error: EPERM: operation not permitted, write]
let filehandle = null
fs.promises
    .open(fileName, "a+")
    .then((filehandle) => {
        filehandle = filehandle
        filehandle
            .writeFile("异步Promise写入了！")
            .catch((err) => console.log("出错了：", err))
            .finally(() => filehandle.close())
    })
    .catch((err) => console.log(err))
```
[更多内容](http://nodejs.cn/api/fs.html#fs_using_fs_writefile_with_file_descriptors)

[写入模式选项](http://nodejs.cn/api/fs.html#fs_file_system_flags)
### readFile读取文件
```js
const fs = require("fs")
fileName = "./fs-demo.txt"
// 同步读取，注意，如果不指定utf-8，他默认返回的数据是buffer格式的
console.log(fs.readFileSync(fileName, { encoding: "utf-8" }))
// 异步回调方式写入文件
// 文件路径，写入内容， 模式设置为追加，错误回调处理
fs.readFile(fileName, { encoding: "utf8" }, (err, data) => {
    if (err) {
        console.log("出错了：", err)
        return
    }
    console.log(data)
})
// 异步Promise形式
let filehandle = null
fs.promises
    .open(fileName)
    .then((filehandle) => {
        filehandle = filehandle
        filehandle
            .readFile({ encoding: "utf8" })
            .then((statInof) => console.log(statInof))
            .catch((err) => console.log("出错了：", err))
            .finally(() => filehandle.close())
    })
    .catch((err) => console.log(err))
```
如果乱码的话，需要指定该文件的编码格式，如果对编码不是很了解，可以看一看：[详解字符编码](https://www.jianshu.com/p/899e749be47c)

### readdir读取目录内容
```js
const fs = require("fs")
dirName = "./"
// 同步读取目录
const pathArr = fs.readdirSync(dirName)
console.log(pathArr)
// 异步读取
fs.readdir(dirName, (err, files) => {
    if (err) {
        console.log("err:", err)
        return
    }
    console.log(files)
})
// 异步Promise读取
fs.promises
    .readdir(dirName)
    .then((files) => console.log(files))
    .catch((err) => console.log("err:", err))

// 结果：
// [ 'demo-dir', 'index.js' ]
```
### 遍历读取目录下所有文件（包括子文件夹）
```js
const fs = require("fs")
const path = require("path")
dirName = "./"
// 先判断目录是否存在
if (fs.existsSync(dirName)) {
    // 异步读取,为了判断是否是目录，我们传入了配置withFileTypes
    getFiles(dirName)
} else {
    console.log("读取的目录不存在！")
}

function getFiles(dirName) {
    // 设置withFileTypes类型后，返回的数据不再是字符串而是一个Dirent对象
    fs.readdir(dirName, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log("err:", err)
            return
        }
        files.forEach((file) => {
            if (file.isDirectory()) {
                // 将最开始路径与遍历出来的子目录处理成一个完整路径
                const tempDirPath = path.resolve(dirName, file.name)
                // 如果是目录则递归调用自身
                getFiles(tempDirPath)
            } else {
                console.log(path.join(dirName, file.name))
            }
        })
    })
}
```
## events事件触发器模块
### 简单示范
```js
const EventEmitter = require("events")
const event = new EventEmitter()
// 监听自定义事件并获取传递过来的参数
event.on("myEvent", (v) => {
    // 接收到第一个参数：你能接受到嘛？
    console.log(v)
})
event.on("myEvent", (...args) => {
    // 通过可变参数获取全部数据：[ '你能接受到嘛？', '我再来个参数，', '我还来！' ]
    console.log(args)
})
// addListener其实就是on的别名
event.addListener("myEvent", (v) => {
    console.log(v)
})
// 定时触发事件出去
setInterval(() => {
    event.emit("myEvent", "你能接受到嘛？", "我再来个参数，", "我还来！")
}, 3000)
```