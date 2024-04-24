# buffer二进制处理
`Buffer`是`NodeJs`内置的二进制对象，其形式可以简单理解为每个成员为一个字节 - `8b，或者成为 8比特`的数组。

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201125220453.png)
## 字符串与二进制互转
```js
const text = "世界你好！"
const targetBuffer = Buffer.from(text, "utf8")
// 转换后的二进制数据，其实是0101的二进制形式，只是打印的时候会用八进制的形式展现
console.log(targetBuffer)
// 将创建出来的二进制对象转换为字符串
console.log(targetBuffer.toString("utf8"))
// 注意：编码格式都是可选参数

```
## sharp图片处理模块
> [sharp官方仓库](https://github.com/lovell/sharp)
```js
const sharp = require("sharp")
// 1. 读取当前目录文件
// 2. 将图片旋转
// 3. 将图片缩放
// 4. 导出图片
sharp("./1.png")
    .rotate(90)
    .resize(200)
    .toFile("output.jpg", (err, info) => {
        console.log(err)
    })
```
## 事件循环
> [Node.js 事件循环](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)

图示：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201125230449.png)

## Stream数据流
[![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201129124059.png)](http://nodejs.cn/api/stream.html)
### readStream读取数据流
> 参考文档：
1. [fs.ReadStream 类](http://nodejs.cn/api/fs.html#fs_class_fs_readstream)
2. [fs.createReadStream(path[, options])](http://nodejs.cn/api/fs.html#fs_fs_createreadstream_path_options)
3. [stream.Readable 类](http://nodejs.cn/api/stream.html#stream_class_stream_readable)
```js
const fs = require("fs")
const createReadStream = fs.createReadStream
// 从索引2开始读，注意，从0开始排序的哦！单位是字节
const readSteam = createReadStream("./demo-dir/fs-demo.txt", {
    encoding: "utf8",
    start: 2,
    end: 16,
})
// 文件内数据：1234567890abcdefghijklmnopqrstuvwxyz
// 结果：34567890abcdefg
// 如果是汉字的话，可能需要注意编码与字节的关系
readSteam.on("data", (data) => {
    console.log(data)
})
// 检测是否开启了数据流
readSteam.on("open", (fd) => {
    // 开启了readSteam数据流 3
    console.log("开启了readSteam数据流", fd)
})
// 检测是否关闭了数据流
readSteam.on("close", () => {
    // 关闭了readSteam数据流的读取
    console.log("关闭了readSteam数据流的读取")
})

// highWaterMark表示一次读取几个字节
const readSteamNew = createReadStream("./demo-dir/fs-demo.txt", {
    encoding: "utf8",
    start: 2,
    end: 16,
    highWaterMark: 3,
})
// 结果：（每三秒延时一下）
// 345
// 678
// 90a
// bcd
// efg
readSteamNew.on("data", (data) => {
    console.log(data)
    // 暂停当前读取流
    readSteamNew.pause()
    // 3秒后又重新恢复读取
    setTimeout(() => {
        readSteamNew.resume()
    }, 3000)
})
```
### writeStream写入数据流
```js
const fs = require("fs")
// const createReadStream = fs.createReadStream
// 导入 创建写入数据流 的方法
const createWriteStream = fs.createWriteStream
// 创建写入数据流
const writeStream = createWriteStream("output.txt", {
    encoding: "utf8",
    flags: "a+",
    start: 4,
})
// 写入文本，支持写入任何类型
writeStream.write("测试写入\n", (err) => err && console.log(err))
writeStream.write("再次写入\n", (err) => err && console.log(err))
// 写入并关闭
writeStream.end("写入完成！")
// 这步等于：
// 1. writeStream.write('写入完成！')
// 2. writeStream.close()
```
注意：
* 在`window`系统上，`a+`模式好像没有生效，并没有在我们指定的索引为`4`的字节处开始插入数据，依旧是追加在最后，若是想要插在我们指定位置，暂时只能使用`r+`，不过如果文件不存在`r+`会抛出异常。


### pipe转换
```js
const fs = require("fs")
const createReadStream = fs.createReadStream
const createWriteStream = fs.createWriteStream
const readSteam = createReadStream("./demo-dir/fs-demo.txt", {
    encoding: "utf8",
})
// 注，使用pipe不能再配置encoding
// 这时的参数对象只有一个可选：
// options <Object> 管道选项。
// end <boolean> 当读取器结束时终止写入器。默认值: true。
const writeStream = createWriteStream("target.txt")
writeStream.on("close", () => {
    console.log("写入流关闭!")
})
// 将readStream里的数据给谁处理
readSteam.pipe(writeStream)
// 关闭写入数据流，读取数据流会自动关闭,而写入流本来是不会自动关闭的
// 默认情况下，当来源可读流触发 'end' 事件时，目标可写流也会调用 stream.end() 结束写入。
// 也就是说，通过pipe我们读取流自动关闭的同时会将写入流也跟随关闭
// 若要禁用这种默认行为， end 选项应设为 false，这样目标流就会保持打开
```