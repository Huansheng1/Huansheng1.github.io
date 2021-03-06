<!-- 可能重复使用的链接 -->
[vuepress]: https://vuepress.vuejs.org/zh/ 'vuepress官网'
[github]: https://github.com '开源社区'
[gitee码云]: https://gitee.com '码云，国内开源社区，访问速度更快！'
# 前置条件
> 掌握基础MD语法  
> 安装node.js环境  
>> 可在cmd上输入:`node -v` 和 `npm -v`查看是否显示版本号，以确保安装成功  

> 注册[github] 或者 [gitee码云] ，以后我们将部署的html文件放置到pages静态服务里  
> 安装git客户端，我们用git同步，方便快捷。  
> 安装VSCode客户端，轻量快捷，在文本编辑器和编译器寻找到一个完美的平衡
# vuePress概述
* Vue 驱动的静态网站生成器
* 基于markdown语法生成网页
* 可自定义和扩展样式
* 可以发布至github
* 详情请看官网[vuepress]
# 安装配置
> 该教程仅针对window写作，linux系统自行将touch等window终端命令改为linux的对应命令
## 初步使用vuepress
* 全局安装vuepress：  
```bash
npm i -g vuepress
```
* 创建博客项目目录
```bash
mkdir myBlogVue
```
* npm初始化
1. 转入项目文件夹
```bash
cd myBlogVue
```
2. npm初始化,会生成一个package.json
```bash
npm init -y
```
* 创建.vuepress目录
```bash
mkdir .vuepress
```
* 创建config.js
```bash
cd .vuepress
touch config.js
```
* 创建首页README.md文件
```bash
cd ../
touch README.md
```
## 配置设置文件
### 当前目录结构
```
myBlogVue
├─ README.md
└─ package.json
└─ .vuepress
└─---└─ config.js
```
### 修改README.md
#### Vuepress提供开箱即用的 YAML front matter
```bash
---
home: true
lang: zh-CN
heroText: 菜鸡前端
heroImage: ../../assets/img/logo.png
tagline: 一点一滴都是进步
actionText: 欣赏文章 →
actionLink: /guide/
features:
- title: 个人博客
  details: 以 Markdown 为中心的项目结构，记录个人经验与踩坑解决办法。
- title: 前端技术
  details: 巩固自我，记录一点一滴，方便用时自我查阅。
- title: 实战项目
  details: 个人开发的免费开源项目步骤详细记录，编程->从博客开始。
- title: 搭建技术
  details: node.js环境下vuepress为基础，github或者码云部署搭建。
- title: 作品源码
  details: 以往作品开源在github，可通过导航前往获取我的历史项目源码。
- title: 学习目标
  details: 不断深入，每天学习，用心思考，向全栈进发！
footer: MIT Licensed | Copyright © 2020-present 幻生
---
<!-- 注：此格式是YAML front matter,一定要在md文件的顶部才会生效。 -->
<!-- 博客首页 -->
```
#### 说明：
> heroText： 网站主页居中标题  
> heroImage：网站首页图片  
> tagline： 网站居中描述  
> actionText：网站居中按钮文字  
> actionLink: 网站居中按钮跳转路径  
> features：博客特性，支持N个
>> title：该特性标题  
>> details：该特性描述  
### 配置`.vuepress/config.js`
>  一个 VuePress 网站必要的配置文件
> 采用CommonJS的模块导入导出语法
```js
const path = require('path');
module.exports = { //这个js变动时本地调试服务会自动重新 启动服务刷新网页，但是md文件改动保存是无法检测到的
        title: '幻生博客', //网站标题
        keywords: "幻生,vue,vuepress,vuepress技术博客,前端,blog,vuepress-blog,golang,script,windows,git,小程序", // 关键字
        description: '如有错误，敬请提交意见与指导，QQ：2933903535', //网站描述
        repo: 'https://github.com/Huansheng1', //设置 repo属性，VuePress 会在导航栏中添加一个 Github 仓库的链接。
        base: '/', //ase 属性的默认值是 /。设置站点根路径，如果你在访问的地址是 'www.xxxx.com/wxDocs' 那么就设置成 '/wxDocs/'  
        dest: './dist', //指定编译路径，该处为根目录下的dist文件夹，VuePress默认路径为.vuepress/dist文件夹
        port: '7777', //指定端口号
        head: [
            ['link', { rel: 'icon', href: './public/assets/img/logo.png' }], //头部引入logo图片，也可引入CSS/JS，public目录
            ['meta', { 'name': 'viewport', content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" }],
            ['meta', { name: 'referrer', content: 'never' }],
            ['script', { type: 'text/javascript', src: './public/assets/js/load.js' }],
        ],
        markdown: {
            lineNumbers: true // 是否在每个代码块的左侧显示行号。
        },
        themeConfig: {
            nav: require("./nav.js"), //引入抽离的网站nav导航栏设置，.js后缀可省略
            sidebar: 'auto', //require("./sidebar.js"), //注：sidebar: 'auto'表示自动通过md内容生成左边侧边栏
            sidebarDepth: 2, //同时提取markdown中h2 和 h3 标题，显示在侧边栏上
            lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
            searchMaxSuggestoins: 10, //搜索结果最大数量
            author: '幻生',
            serviceWorker: {
                updatePopup: {
                    message: "有新的内容.",
                    buttonText: '更新'
                }
            },
            editLinks: true,
            editLinkText: '在 GitHub 上编辑此页 ！'
        },
        configureWebpack: {
            resolve: {
                alias: { //目录别名
                    '@': path.join(__dirname, '../'), //相对于config.js文件的路径->.vuepress目录
                    'public': '@/public',
                    'assets': 'public/assets', //MD文件里可这样使用别名  ![](~assets/img/003.png)
                    'web': '@/web',
                    'project': '@/project',
                    'article': '@/article',
                    'tips': '@/tips',
                    'tools': '@/tools',
                }
            }
        }
    }
    // 自定义搜索：VuePress搭建个人技术文档网站教程 - 个人文章 - https://segmentfault.com/a/1190000017055963?utm_source=tag-newest
```
### 配置`.vuepress/nav.js`
```js
module.exports = [{
        text: '搭建指南',
        link: '/guide/' //指定导航栏文字下的链接路径，如无link则无法点击
    },
    {
        text: '前端知识',
        //link: '/web/',//有分类的情况下不推荐给上级目录页加上可点击路径
        items: [ //面试宝典导航下的子分类导航
            { text: '新手入门篇', link: '/web/learn/' }, //设置点击该导航时跳转路径，默认寻找该目录下的README.md文件
            { text: '基础提升篇', link: '/web/code/' },
            { text: '中级巩固篇', link: '/web/make/' },
        ]
    },
    {
        text: '推荐网站', //items里面可以嵌套新的导航{}，推荐最多两级导航，不然嵌套不清晰
        items: [{
                text: '在线编辑',
                items: [
                    { text: '图片压缩', link: 'https://tinypng.com/' } //外部链接
                ]
            },
            {
                text: '在线服务',
                items: [
                    { text: '阿里云', link: 'https://www.aliyun.com/' },
                    { text: '腾讯云', link: 'https://cloud.tencent.com/' }
                ]
            },
            {
                text: '博客指南',
                items: [
                    { text: '掘金', link: 'https://juejin.im/' },
                    { text: 'CSDN', link: 'https://blog.csdn.net/' }
                ]
            }
        ]
    },
    {
        text: '工具箱',
        link: '/tools/'
    },
    {
        text: 'MD相关',
        link: '/markdown/'
    }
]
```
> tips：  
> link路径  
>> 相对路径：指向README.md所在目录的相对路径，如果为文件夹而非文件，则自动寻找该目录下的README.md
>> 绝对路径：指向对应路径/网站
### 配置`./package.json`
> 配置npm管理该项目的配置文件
```js
{
    "name": "myblog-vuepress",
    "version": "1.0.0",
    "description": "幻生教你从零搭建个人网站，免费永久的博客",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "serve": "vuepress dev .",
        "build": "vuepress build ."
    },
    "keywords": [],
    "author": "huansheng",
    "license": "MIT"
}
```
> 配置完后效果：  
>>第一条命令会启动本地服务器，用于预览网站内容，第二条命令用于发布生产代码
```bash
npm run serve
npm run build
```
## 增加插件
### 新增评论系统
> ……待更新……
### 新增第三方搜索
> ……待更新……
## 发布部署
> **git基础：**[点我](git)
### 使用github-Pages托管代码
#### 前置知识
> Github创建项目仓库后随即只产生一个master分支，只需要再添加`gh-pages`分支就可以创建静态页面了。  
> 这利用了项目站点（即Project Pages）的方式。还有一种创建站点的方式叫做`User/Organization Pages`。  
> 我们这里介绍前者。  
> 首先，创建一个名为 Github用户名.github.io 的仓库。  
> 接着大家可以在这仓库里放一些静态页面，在外网访问: Github用户名.github.io,就能访问到里面的静态资源了。  
> 如果你想知道楼主如何基于github搭建自己的博客，可以看[这篇文章](http://www.cnblogs.com/MuYunyun/p/5927491.html)，这次讲的重点主要是gh-pages。
#### 为什么有了Github用户名.github.io 的仓库，我们还需要gh-pages呢？
> 大家不会只有一个项目要展示的吧，万一你和楼主一样把 Github用户名.github.io 作为博客了，那不就没地方展示项目了吗？所以就有了gh-pages这个东东。  
#### 进入主题
1. 进入dist文件夹下
```bash
cd dist
```
2. git初始化
```bash
git init
```
3. 创建并切换gh-pages分支
```bash
git checkout --orphan gh-pages
```
4. 添加文件到暂存区
```bash
git add .
```
5. 添加信息
```bash
git commit -m "init project"
```
6. 设置远程仓库地址
```bash
git remote add origin git@github.com:nqmysb/shared-library-ui.git
```
7. 推送项目到 gh-pages分支
```bash
git push origin gh-pages
```
> 此时你的github该项目会多一个gh-pages分支，点击切换分支可以看到刚刚上传的项目文件。  
> 展示地址：Github用户名.github.io/当前创建的仓库名

* **[推荐命令]** 指定的dist文件提交到gh-pages分支：`git subtree push --prefix=dist origin gh-pages`