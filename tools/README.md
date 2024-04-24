# 推荐插件与软件
## 谷歌插件
**Save All Resources**
> 功能介绍：  
>> 一键下载网页资源，支持格式化后下载，下载后保留原来网站资源文件原始目录结构，相当给力的一款插件!  

> 使用步骤：  
>> F12打开调试模式，选择对应按钮即可![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200606143342.png)

* 安装方式：[谷歌插件商店](https://chrome.google.com/webstore/detail/save-all-resources/abpdnfjocnmdomablahdcfnoggeeiedb/related)

**FeHelper(前端助手)**
> 功能介绍：  
>> JSON自动格式化、手动格式化，支持排序、解码、下载、Http请求测试等，更多功能可在配置页按需安装！  

> 使用步骤：  
>> 自己选择合适的插件安装使用![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200606144145.png)

* 安装方式：[谷歌插件商店](https://chrome.google.com/webstore/detail/fehelper%E5%89%8D%E7%AB%AF%E5%8A%A9%E6%89%8B/pkgccpejnmalmdinmhkkfafefagiiiad)、[官网](https://www.baidufe.com/fehelper)

## VSCode插件
**Angular Filers**
> 功能介绍
>> 不再需要手动敲击`ng g c components/tabbar`之类的动作，安装后鼠标右键即可快速完成

> 好处：避免了路径过深时浪费太多时间在路径名上
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201108175003.png)

**live-server**
> 功能介绍
>> 简易本地资源服务器，以真实的服务器托管的网页，而不是像直接用浏览器打开文件时是使用 file:// 协议托管的，更贴近实际生产环境，file:// 协议还会导致跨域等问题。  

> 使用步骤：  
>> VSCode打开html文件后点击GoLive按钮自动开启本地服务器并用默认浏览器打开地址![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200606143658.png)

* 安装方式：VSCode商店搜索

*prettier*
> 功能介绍
>> 前端界当前最流行的格式化工具  

> 使用步骤：  
>> 安装 prettier，然后设置 VSCode 使用 prettier 作为格式化器

> 设置：  
```json
// settings.json
"[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

* 安装方式：[VSCode商店搜索](https://prettier.io/)

*vscode-svg2*
> 功能介绍
>> SVG图片显示  

* 安装方式：[VSCode商店搜索](https://github.com/lishu/vscode-svg2)

~~*Settings Sync*~~
<details>

<summary>废弃，`vscode`新版已经支持微软帐号同步</summary>  

> 功能介绍
>> 配置信息同步到git上面，这样就不会丢失信息了，换电脑都不怕，注意一定要记得保存秘钥和gistid  
提供一个额外的方式，你可以把你的.vscode文件保存下来，然后移植到新电脑，这样也可以转移你的所有配置  

* 安装方式：VSCode商店搜索

</details>

*koroFileHeader*
> 功能介绍
>> 在vscode中用于生成文件头部注释和函数注释的插件，经过多版迭代后，插件：支持所有主流语言,灵活方便，文档齐全，食用简单！  
>> 文件头部添加注释:  
>> * 在文件开头添加注释，记录文件信息/文件的传参/出参等  
支持用户高度自定义注释选项, 适配各种需求和注释。  
保存文件的时候，自动更新最后的编辑时间和编辑人  
快捷键：window：ctrl+alt+i,mac：ctrl+cmd+i, linux: ctrl+meta+i  
在光标处添加函数注释:  

>> * 在光标处自动生成一个注释模板  
支持用户高度自定义注释选项  
快捷键：window：ctrl+alt+t,mac：ctrl+cmd+t,linux: ctrl+meta+t  
快捷键不可用很可能是被占用！    
* 安装方式：[VSCode商店搜索](https://marketplace.visualstudio.com/items?itemName=OBKoro1.korofileheader)

*GitHub Pull Requests*
> 功能介绍
>> 官方出品！  

* 安装方式：[VSCode商店搜索](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)

*HTML CSS Support*
> 功能介绍
>> 贡献者中有 VSCode 的核心开发人员所以当然推荐！  

* 安装方式：[VSCode商店搜索](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)

*Vetur*
> 功能介绍
>> Vue 文件语法高亮、片段整理、错误检查、格式化！  

* 安装方式：[VSCode商店搜索](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

*Auto Import*
> 功能介绍
>> 自动去查找、分析、然后提供代码补全。对于 TypeScript 和 TSX，可以适用！  

* 安装方式：[VSCode商店搜索](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport)

*REST Client*
> 功能介绍
>> 这个扩展允许您轻松地在代码编辑器中直接调用和 API 端点。 这样可以节省时间ーー 你可以使用这个选项，而不必在浏览器或 Postman 那里来回地切换请求！  

> 使用方法：  
>> <https://juejin.im/post/5e2067f7f265da3e405028fb#comment>  

* 安装方式：[VSCode商店搜索](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

*Image preview*
> 功能介绍
>> 悬停时显示图像预览。  

* 安装方式：VSCode商店搜索

## 软件
**快贴**
> 功能介绍：  
>> 全平台剪切板 同步工具，端对短加密，提升体验的同时保证你的信息安全!  

* 安装方式：[快贴 - 真正的云剪贴板工具](https://clipber.com/)

**Typora**
> 功能介绍  
>> 目前个人体验最好的MD软件，阅读MD文档从此舒服至极  

> 主题：[typora-theme-chineseStyle](https://github.com/luokangyuan/)  

* 安装方式：[官网](https://www.typora.io/)

**PicGo**
> 功能介绍  
>> 各网站一键上传图片并生成指定格式图片到剪切板，从此图床不愁人！  

> Typora插件也有哦！  

* 安装方式：[官网](https://github.com/Molunerfinn/PicGo)

**Iris Pro**
> 功能介绍  
>> 超级好用的护眼软件，摆脱冷色光，摆脱近视眼！  

* 安装方式：[百度](https://www.baidu.com/s?wd=Irispro)