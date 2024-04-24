# SFC单文件组件开发
## 前置
### Vscode插件推荐
* `Vetur`
* `Volar`(官方有基于此开发计划，但是暂不推荐使用)
* `Vue 3 Snippets` 或者 `Vue VSCode Snippets`
```bash
Vue 3 Snippets插件 输入`<vue`或者`VueInit`会有提示可以自动生成模板片段
Vue VSCode Snippets插件 输入`vbase`即可
```
### 脚手架安装
```bash
# 安装
npm install -g @vue/cli
# 查看是否安装完成
vue --version
```
## 创建项目
打开`git bash`，在命令行通过脚手架创建项目：`vue create vue-three`：
1. 让我们确认是否通过 淘宝镜像 快速安装，我们输入 `Y`
2. 让我们选择一个预设方案，我们通过上下箭头选择 `Vue3`：
```
* 默认的 `Vue2版本`
* `Vue3`版本
* 手动选择特性
```
3. 让我们选择一种包管理工具，我们这选择`PNPM`：
```
> Use Yarn
  Use PNPM
  Use NPM
```

4. 耐心等待安装完成后，通过`cd vue-three && pnpm run serve`启用服务。