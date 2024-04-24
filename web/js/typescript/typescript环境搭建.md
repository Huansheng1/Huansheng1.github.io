# typescript环境搭建
## webpack环境搭建
### 单文件编译
1. 创建一个目录``，通过`npm init`初始化该目录作为项目
2. 本地安装`webpack`脚手架和`webpack-cli`（webpack4以后需要单独安装）：`npm install webpack webpack-cli -D`
3. 在项目根目录创建一个`webpack`配置文件：`webpack.config.js`
4. 配置初始的 `webpack`文件，以便通过`webpack`打包编译：
```js
// 导入node的path处理模块
const path = require("path")

// 导出webapck的配置对象
module.exports = {
    // 定义项目的入口文件
    entry: "./main.ts",
    // 打包后输出到哪
    output: {
        // 路径处理，当前webpack配置文件的目录下子目录dist
        path: path.resolve(__dirname, "./dist"),
        // 编译后的文件名
        filename: "bundle.js",
    },
}
```
5. 修改`package.json`文件增加个`build`指令，以便快速使用`webpack`打包：
```json
{
    "name": "ts-demo",
    "version": "1.0.0",
    "description": "对于ts文件进行一个通过webpack进行一个自动的打包编译热刷新脚手架以供学习和运行",
    "main": "index.js",
    "scripts": {
        "build": "webpack",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "webpack": "^5.72.0",
        "webpack-cli": "^4.9.2"
    }
}
```
6. 通过`npm run build`就可以快捷的运行`webpack`打包指令
7. 创建`main.ts`文件，写入一点`ts`代码，以便方便测试：
```ts
const person:{
    name?:string,
    age?:number
} = {};
person.name = 'ted';
person.age = 18;
console.log('我是'+person.name);
```
8. 通过打包指令运行，发现报错：
```bash
Module parse failed: Unexpected token (1:12)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> const person:{
|     name?:string,
|     age?:number

webpack 5.72.0 compiled with 1 error and 1 warning
``` 
9. 我们通过错误可以知道，我们还需安装一个`typescript`的`loader`插件以便`webpack`能够正确的打包编译`typescript`文件：
```bash
npm install ts-loader typescript -D
```
10. 修改配置文件，使其对于`ts文件`使用对应的`loader`进行加载：
```js
// 导入node的path处理模块
const path = require("path")

// 导出webapck的配置对象
module.exports = {
    // 定义项目的入口文件
    entry: "./main.ts",
    // 打包后输出到哪
    output: {
        // 路径处理，当前webpack配置文件的目录下子目录dist
        path: path.resolve(__dirname, "./dist"),
        // 编译后的文件名
        filename: "bundle.js",
    },
    // 插件配置
    module: {
        // 匹配规则
        rules: [
            {
                // 匹配文件名以ts结尾的ts文件
                test: /\.ts$/,
                // 指明ts通过ts-loader进行处理
                loader: "ts-loader",
            },
        ],
    },
}
```
11. 重新运行打包指令，发现依旧报错了：
```bash
ERROR in ./main.ts
[tsl] ERROR
      TS18002: The 'files' list in config file 'tsconfig.json' is empty.
ts-loader-default_e3b0c44298fc1c14

ERROR in ./main.ts
```
通过这里，我们需要知道：`ts-loader`运行需要依赖一个`tsconfig.json`配置文件，我们可以通过`tsc --init`生成对应的配置
12. 这个时候我们发现运行成功了
### 多文件编译
1. 我们新建个`uitils.ts`文件，导出一个函数：
```ts
export default {
    add(age:number):number{
        return age + 1;
    }
}
```
2. 我们在`main.ts`文件里导入这个函数：
```ts
import untils from './uitils';

const person:{
    name?:string,
    age?:number
} = {};
person.name = 'ted';
person.age = 18;
console.log('我是'+person.name+'年龄是：'+person.age);
person.age = untils.add(person.age);
console.log('我是'+person.name+'年龄是：'+person.age);

```
3. 然后我们进行打包操作，这时候我们发现，导入的地方报错了：
```bash
ERROR in ./main.ts 6:31-50
Module not found: Error: Can't resolve './uitils' in 'C:\Users\Administrator\Desktop\ts-demo'
resolve './uitils' in 'C:\Users\Administrator\Desktop\ts-demo'
  using description file: C:\Users\Administrator\Desktop\ts-demo\package.json (relative path: .)
    Field 'browser' doesn't contain a valid alias configuration
    using description file: C:\Users\Administrator\Desktop\ts-demo\package.json (relative path: ./uitils)
      no extension
        Field 'browser' doesn't contain a valid alias configuration
        C:\Users\Administrator\Desktop\ts-demo\uitils doesn't exist
      .js
        Field 'browser' doesn't contain a valid alias configuration
        C:\Users\Administrator\Desktop\ts-demo\uitils.js doesn't exist
      .json
        Field 'browser' doesn't contain a valid alias configuration
        C:\Users\Administrator\Desktop\ts-demo\uitils.json doesn't exist
      .wasm
        Field 'browser' doesn't contain a valid alias configuration
        C:\Users\Administrator\Desktop\ts-demo\uitils.wasm doesn't exist
      as directory
        C:\Users\Administrator\Desktop\ts-demo\uitils doesn't exist
```
为啥我们在`ts`里导入这个`js`模块，但是却不认识呢？其实很简单，这涉及到`webpck`的导入机制：
* 我们导入时不写文件后缀的原因是：`.ts`打包后会找不到这个文件，`.js`打包时又找不到该文件（此时是`.ts`）导致编译时会报错
* `webpack`默认导入会自动去找 无后缀名的文件、`.js`文件、`.json`文件、`.wasm`文件 以及 同名目录下的`.index.js`等文件，但是在我们这是找不到，因为我们此时是`.ts`文件

4. 因此，我们修改`webpack`的配置文件，使其增加`resolve`，扩展支持的文件后缀，以便能够识别`ts`文件:
```js
// 导入node的path处理模块
const path = require("path")

// 导出webapck的配置对象
module.exports = {
    // 定义项目的入口文件
    entry: "./main.ts",
    // 打包后输出到哪
    output: {
        // 路径处理，当前webpack配置文件的目录下子目录dist
        path: path.resolve(__dirname, "./dist"),
        // 编译后的文件名
        filename: "bundle.js",
    },
    // 配置处理参数
    resolve: {
        // 文件后缀扩展ts文件，使其打包时会去找ts后缀的文件
        extensions: [".ts"],
    },
    // 插件配置
    module: {
        // 匹配规则
        rules: [
            {
                // 匹配文件名以ts结尾的ts文件
                test: /\.ts$/,
                // 指明ts通过ts-loader进行处理
                loader: "ts-loader",
            },
        ],
    },
}
```
5. 新建一个`index.html`文件，引入打包后的文件运行，发现一切正常：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>幻生自定义网页模板</title>
    <script src="./dist/bundle.js"></script>
</head>
<body>
    <div id="app">
        
</div>
</body>
</html>
```
### 热重载
但是现在我们发现，如果修改我们的代码，每次还得重新进行运行再刷新浏览器，太麻烦了，我们希望修改保存后浏览器能够自动运行最新的代码。
#### `webpack-dev-server`本地服务
因此，我们需要引入一个`webpack-dev-server`插件启动一个本地服务：`npm install webpack-dev-server -D`

然后我们修改`package.json`文件，新增一个运行指令：
```json
{
    "name": "ts-demo",
    "version": "1.0.0",
    "description": "对于ts文件进行一个通过webpack进行一个自动的打包编译热刷新脚手架以供学习和运行",
    "main": "index.js",
    "scripts": {
        "build": "webpack",
        "serve": "webpack serve",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "ts-loader": "^9.2.8",
        "typescript": "^4.6.3",
        "webpack": "^5.72.0",
        "webpack-cli": "^4.9.2"
    }
}
```
然后我们修改`webpack`配置文件，指定端口号：
```js
// 导入node的path处理模块
const path = require("path")

// 导出webapck的配置对象
module.exports = {
    // 定义项目的入口文件
    entry: "./main.ts",
    // 打包后输出到哪
    output: {
        // 路径处理，当前webpack配置文件的目录下子目录dist
        path: path.resolve(__dirname, "./dist"),
        // 编译后的文件名
        filename: "bundle.js",
    },
    // 配置处理参数
    resolve: {
        // 文件后缀扩展ts文件，使其打包时会去找ts后缀的文件
        extensions: [".ts"],
    },
    // 插件配置
    module: {
        // 匹配规则
        rules: [
            {
                // 匹配文件名以ts结尾的ts文件
                test: /\.ts$/,
                // 指明ts通过ts-loader进行处理
                loader: "ts-loader",
            },
        ],
    },
    // 运行服务配置
    devServer: {
        // 指定端口号
        port: 9999,
    },
}
```
但是通过`npm run serve`运行我们发现会报错，原因其实是因为我们之前在`index.html`里引入了打包后的`bunde.js`以供运行，但是在`dev serve`模式下是找不到该文件的
#### `html-webpack-plugin`模版
我们通过`npm install html-webpack-plugin -D`安装该插件，然后修改`index.html`里的代码，将之前引入的写死路径删除：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>幻生自定义网页模板</title>
</head>
<body>
    <div id="app">
        
</div>
</body>
</html>
```

修改`webpack`配置，引入安装的插件并指定模块：
```js
// 导入node的path处理模块
const path = require("path")
// 导入html模版处理插件
const HtmlWebPlugin = require("html-webpack-plugin")

// 导出webapck的配置对象
module.exports = {
    mode: "development",
    // 定义项目的入口文件
    entry: "./main.ts",
    // 打包后输出到哪
    output: {
        // 路径处理，当前webpack配置文件的目录下子目录dist
        path: path.resolve(__dirname, "./dist"),
        // 编译后的文件名
        filename: "bundle.js",
    },
    // 配置处理参数
    resolve: {
        // 文件后缀扩展ts文件，使其打包时会去找ts后缀的文件
        // 如果只写ts会导致安装的`webpack-dev-server`无法正常工作，因为这会将默认的文件扩展名覆盖，导致其不认识该插件里的部分文件了
        extensions: [".ts", ".js", ".json", ".cjs", ""],
    },
    // 插件配置
    module: {
        // 匹配规则
        rules: [
            {
                // 匹配文件名以ts结尾的ts文件
                test: /\.ts$/,
                // 指明ts通过ts-loader进行处理
                loader: "ts-loader",
            },
        ],
    },
    // 运行服务配置
    devServer: {
        port: 8888,
    },
    // 导入插件
    plugins: [
        new HtmlWebPlugin({
            // 指定模版路径
            template: "./index.html",
        }),
    ],
}
```
## 代码格式化
### tslint
#### 安装`tslint`全局依赖包
命令：
```bash
npm install tslint -g
```
#### 初始化配置文件
在项目根目录下执行初始化配置命令：
```bash
tslint --init
```