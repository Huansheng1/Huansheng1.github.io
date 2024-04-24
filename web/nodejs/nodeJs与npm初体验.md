# node初体验
## 安装配置nodeJS
### Node.js概念
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121132818.png)  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121132919.png)  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121133002.png)  
> 官方解释：  
* Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 Node.js使用了一个事件驱动、非阻塞式I/O的模型（ Node.js的特性），使其轻量级又高效。 Node.js 的包管理器 npm 是全球最大的开源库生态系统。  

* Node 内部采用 Google Chrome 的 V8 引擎，作为 JavaScript 语言解释器；  
* 通过自行开发的 libuv 库，调用操作系统资源。  
> 非官方解释：
* Node.js：是 JavaScript 语言在服务器端的运行环境（平台）。  
> 运行环境（平台）的含义：
* 首先，JavaScript 语言通过 Node 在服务器运行，在这个意义上，Node 有点像 JavaScript 虚拟机。  
* 其次，Node 提供大量工具库，使得 JavaScript 语言能与操作系统互动（比如读写文件、新建子进程），在这个意义上， Node 又是 JavaScript 的工具库。  
> 总结：
* Node.js 是一个 JavaScript 的运行环境（平台），不是一门语言，也不是 JavaScript 的框架。  
* 与PHP、JSP、Python、Perl、Ruby的“既是语言，也是平台”不同，Node.js的使用JavaScript进行编程，运行在 Chrome 的 V8 引擎上。  
* 与PHP、JSP等相比（PHP、JSP、.net都需要运行在服务器程序上，Apache、Naginx、Tomcat、IIS。 ），Node.js跳过了Apache、Naginx、IIS等HTTP服务器，它自己不用建设在任何服务器软件之上。   
* Node.js的许多设计理念与经典架构（LAMP = Linux + Apache + MySQL + PHP）有着很大的不同，可以提供强大的伸缩能力。Node.js没有web容器。  

### nodeJs安装配置 
* Node.js 安装包及源码下载地址为：<https://nodejs.org/en/download/>  
* 注意，我们建议使用偶数版（V4、V6等)，不要用奇数版（比如V5），因为奇数版不稳定。  
* 下一步N次即可，检测node是否安装：  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200605211642.png)  

* 其实并不推荐直接采用 Node.js.msi 安装包进行安装，原因如下：  
* > 不方便 node 的更新，以前版本安装的很多全局的工具包需要重新安装；  
* > 无法回滚到之前的版本；  
* > 无法在多个版本之间切换（很多时候我们要使用特定版本）。  
* > 因此，如果想效果更好，可以谷歌` NVM `的方式来安装 Node.js。  
### npm配置
> 输入 "npm -v" 来测试npm是否成功安装  

> ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200605211821.png)  

> 如果有人以前安装过了老版本npm，Window 系统使用以下命令升级：  
> `npm install npm -g`  

> 国内npm下载比较慢，我们切换淘宝镜像：  
> `npm install -g mirror-config-china --registry=http://registry.npm.taobao.org`  

> 查看当前镜像地址：`npm config get registry`  
### npm模块
> 版本号  
* 使用NPM下载和发布代码时都会接触到版本号。NPM使用语义版本号来管理代码，这里简单介绍一下。  

* 语义版本号分为X.Y.Z三位，分别代表主版本号、次版本号和补丁版本号。当代码变更时，版本号按以下原则更新：  
* 1. 如果只是修复bug，需要更新Z位。  
* 2. 如果是新增了功能，但是向下兼容，需要更新Y位。  
* 3. 如果有大变动，向下不兼容，需要更新X位。  

* 版本号有了这个保证后，在申明第三方包依赖时，除了可依赖于一个固定版本号外，还可依赖于某个范围的版本号。例如"argv": "0.0.x"表示依赖于0.0.x系列的最新版argv。  
### npm常见命令
* `npm init --yes`  
项目的初始化。执行完成后，会生成package.json文件。  
> * 简写：'npm init -y'  
* `npm install [package]`  
只在当前工程下安装 package。  
> * 简写：'npm i [package]'  
* `npm install -g [package]`  
在全局环境下安装 package。  
> * 简写：'npm i -g [package]'  
* `npm install --save-dev [package]`  
在当前工程环境下安装 package - 仅在开发时依赖。  
> * 简写：'npm i -D [package]'  
* `npm install --save [package]`  
在当前工程环境下安装 package - 生产时依赖。  
> * 简写：'npm i -S [package]'  

* `npm run [script]`  
运行package中的"scripts" 对象中的指令  

* `npm uninstall [package]`  
卸载某个模块 package。  

* `npm update [package]`  
更新某个模块 package。  
* > 使用`npm update <package>`可以把当前目录下node_modules子目录里边的对应模块更新至最新版本。  
使用`npm update <package> -g`可以把全局安装的对应命令行程序更新至最新版。

* `npm cache clear`  
清空NPM本地缓存，用于对付使用相同版本号发布新版本代码的人。  

* `npm -h``
显示Npm的帮助信息：查看所有命令  
* > `npm help <command>`  
查看某条命令的详细帮助，例如npm help install

#### NodeJs版本更新
> window系统升级node只能从node[官网](https://nodejs.org/zh-cn/download/)下载window安装包覆盖安装！

第一步，先安装管理版本的模块 `n` ：
* `npm install -g n`  
> 如出错可强制安装：`npm i -g n --force`

第二步，再安装稳定版：
* `n stable`
> 如出错可尝试：`n --stable`

第三步，查看版本是否更新成功：
* `node -V`
#### npm更新
更新`npm`自己：
* `npm install -g npm`

更新其他的全局模块，比如：[`Vue Cli`](https://blog.csdn.net/qq_39953537/article/details/102759821)也是如此：
* `npm install -g @vue/cli`

更新包模块还可以通过`npm-check`来做到：
1. 安装检测模块: `npm install -g npm-check`
2. 更新全局模块：` npm-check -u -g --f`，更新后记得重启`cmd`
3. 更多：[`npm更新包(全局单个，项目单个，全局所有，项目生产环境，项目开发环境)`](https://www.cnblogs.com/stronggirlyao/p/9772237.html)
#### npm安装命令 效果差别  
* npm install：本地安装  
* > (1)将安装包放在 ./node_modules 下（运行 npm 命令时所在的目录），如果没有 node_modules 目录，会在当前执行 npm 命令的目录下生成 node_modules 目录。
* > (2)可以通过 require() 来引入本地安装的包。
npm install -g：全局安装
* > (1) 将安装包放在 /usr/local 下或者你 node 的安装目录。
* > (2)可以直接在命令行里使用。
* npm install --save：生产时依赖
* > (1)会把msbuild包安装到node_modules目录中
* > (2)会在package.json的dependencies属性下添加msbuild
* > (3)之后运行npm install命令时，会自动安装msbuild到node_modules目录中
* > (4)之后运行npm install --production或者注明NODE_ENV变量值为production时，会自动安装msbuild到node_modules目录中
* npm install --save-dev：开发时依赖
* > (1)会把msbuild包安装到node_modules目录中
* > (2)会在package.json的devDependencies属性下添加msbuild
* > (3)之后运行npm install命令时，会自动安装msbuild到node_modules目录中
* > (4)之后运行npm install --production或者注明NODE_ENV变量值为production时，不会自动安装msbuild到node_modules目录中
* npm前两者不会修改package.json，而后两者会将依赖添加进package.json
### node执行js
* 执行某个Js文件：  
`node xxx.js`  
### node简单使用
> **简单Http服务**  
> 在 Node.js 上建一个 http 服务器：  
* 新建一个文件 server01.js，然后在里面输入如下代码：  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200605214136.png)
* 在浏览器端输入http://localhost:8080/，每请求一次，服务器的控制台就会打印 有人来访问我了。  

* 上面的 js 代码跑起来，产生的问题是，无论我们在浏览器端输入http://localhost:8080/1.html，还是输入http://localhost:8080/2.jpg，浏览器上显示的都是不变的。  
* 不过这是代码问题，我们以后需要使用再进行拓展……  