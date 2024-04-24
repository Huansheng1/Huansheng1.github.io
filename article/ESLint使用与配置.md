# ESLint使用与配置
## ESLint安装与配置
Eslint插件：根据工程目录的`.eslintrc.js`配置文件在编辑器中显示一些错误提示，后面的自动格式化`Prettier`根据这里的错误提示进行格式化操作。
### VSCode安装插件
商店搜索安装插件：  
* `ESLint`![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200606164953.png)  
* `Prettier - Code formatter`  
* `EditorConfig`  
### Vue项目安装ESLint模块
创建项目时：  
> Linter / Formatter：Javascript语法检查模块  
* 选择这个模块  

选择ES语法规则![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200605224905.png)
> 选择 ESLint + Standard config  
> * 如果需要自动格式化，则选择 Eslint+Prettier  

选择ES语法检查时机![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200605225020.png)
* 1. 保存文件时检查  
* 2. Git提交时检查  
* > *注意* : 多选选项  
* >> 如果想要使用 git commit触发lint操作功能，  
这里可以通过空格来选择两个选项，  
* >> 如果之前创建忘记选了，后续开发突然想加上，输入命令：`vue add eslint`  

选择 模块配置文件选择放在何处  
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200605225155.png)
* 1. 放在相应的配置文件里  
* 2. 放在package.json里  
* > 我们选择 1. 放在相应的 配置文件 里  

这时，我们可以看见 项目目录有变动的文件：  
* .eslintrc.js  
* package.json  
* > 格式化整个项目代码：`npm run lint`![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200606165930.png)  
* >> 本命令依赖于 vue-cli-service  
如果项目中缺少这个依赖就会报错  
这个时候我们只要添加这个依赖即可  
`npm i @vue/cli-service -D`  

### VSCode配置ESLint插件
> Mac 用户按住 `shift + command + p`唤醒搜索栏;Win 用户按`F1`或者`Ctrl + shift + p`  
输入`open settings json`  
>> 这里因为我`F1`快捷键给了*Snipaste*截图、`Ctrl+Shift+P`给了*PicGo*上传图片，因此将PicGo快捷键改为`Ctrl+Shift+C`，避免热键冲突  

用户设置setting.json修改配置：  
```json
{
  "python.pythonPath": "J:\\Djangoworkspace\\myproject\\evnv\\Scripts\\python.exe", //Django配置，删掉。
  "workbench.iconTheme": "vscode-icons",
  "sync.autoUpload": false,
  "sync.gist": "这里是我VSCode自动同步插件填写的github的token，不用管删掉，只Copy下面ESLint的部分就行", 
  "workbench.settings.useSplitJSON": true,
  "python.linting.flake8Enabled": true,
  "python.linting.flake8Args": ["--max-line-length=128"],
  "editor.renderWhitespace": "all",
  "editor.suggestSelection": "first",
  "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
  "python.jediEnabled": false,
  "explorer.confirmDelete": false,
  "vsicons.dontShowNewVersionMessage": true,
  //eslint等格式化插件配置设置开始
  "prettier.singleQuote": true, // 使用单引号包含字符串
  "prettier.semi": false, // 不添加行尾分号
  "editor.fontSize": 14, //编辑器字体大小
  "editor.tabSize": 2, //table多少个空格
  "editor.formatOnSave": false, // 每次保存是否自动格式化，关闭->使用Alt+Shift+F格式化，建议vue项目关闭此项
  "editor.defaultFormatter": "esbenp.prettier-vscode", //默认格式化使用prettier来格式化
  "prettier.eslintIntegration": true,
  "eslint.enable": true, //是否开启vscode的eslint
  "eslint.autoFixOnSave": true, //eslint自动保存格式化
  "eslint.run": "onType", //指定vscode的eslint所处理的文件的后缀
  "eslint.validate": ["javascript", "javascriptreact", "vue", "html"],
  "editor.codeActionsOnSave": {// 在保存时用eslint规则进行修复
    "source.fixAll": true
  },
  "eslint.alwaysShowStatus": true,
  //eslint插件设置结束
  "[jsonc]": {
    "editor.defaultFormatter": "HookyQR.beautify"
  },
  "files.associations": {
    "*.html": "html"
  },
  "liveServer.settings.donotShowInfoMsg": true,
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe", //没安装git就删掉这行
  "workbench.editorAssociations": [
    {
      "viewType": "default",
      "filenamePattern": "*.sh"
    }
  ]
}

```
### VSCode插件提示安装
项目根目录创建`.vscode/extensions.json`
```json
{
    // 其他人接受该项目时，输入@recommended即可看到我们提示用户安装对应的插件
    "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode", "editorconfig.editorconfig"],
    "unwantedRecommendations": []
  }
  ```
## 格式化配置
### ESLint忽略项目文件配置`.eslintignore`
> 项目根目录创建`.eslintignore`
```
build/*.js
src/assets
public
dist
```
* 忽略文件的配置,比如我们打包后的文件dist/**,我们当然是不希望格式化的
### Prettier配置项目
> 项目根目录创建`.prettierrc.js`
```js
// .prettierrc.js
module.exports = {
  singleQuote: true, // 使用单引号包含字符串
  trailingComma: "es5", // 末尾属性添加,
  tabWidth: 2, // tab 为2个空格长度
  semi: false, // 不添加行尾分号
  bracketSpacing: true,//对象属性添加空格
  htmlWhitespaceSensitivity: "ignore",//优化html闭合标签不换行的问题
  printWidth: 120, // 单行长度
};
```
> 如果之前没选择Prettier，可以手动安装：`npm i -D prettier eslint-config-prettier eslint-plugin-prettier`  
> 现在的`eslintrc.js`文件内容：  
```js
// eslintrc.js
module.exports = {
  "parser":  '@typescript-eslint/parser', //定义ESLint的解析器
  "extends": ['plugin:@typescript-eslint/recommended','plugin:prettier/recommended','prettier/@typescript-eslint'], //定义文件继承的子规范，后两个就是这次安装好新增的
  "plugins": ['@typescript-eslint','prettier'], //定义了该eslint文件所依赖的插件
    "env": {
        "browser": true,
        "es6": true
    },
    "rules": {
      "prettier/prettier": 1, //  eslint-plugin-prettier 使用prettier作为eslint规则，新增的
      "semi": ["error", "never"] // 禁止使用分号
    }
};
```
> 可增加使用prettier格式化命令：  
```js
/ package.json
"scripts": {
	"lint": "eslint --ext .tsx,.ts,.js --fix ./src",
	 "fix": "prettier --write  ./src"//增加这条
}
```
### EditorConfig配置项目代码风格
> 项目根目录配置 `.editorconfig`  
```
root = true

[*.{js,jsx,ts,tsx,vue}]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
max_line_length = 120

[*.md]
trim_trailing_whitespace = false
```
>> 该文件对本项目的代码风格做了一个统一规定！  
