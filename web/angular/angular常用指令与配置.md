# Angular常用指令与配置
## 个人常用指令
### 创建模块时顺便生成路由文件
```bash
ng g m views/pages/demoPage --routing
```
### 创建组件时不生成测试文件
```bash
ng generate component my-component --no-spec
```
### 通过ip地址在手机端调试
```bash
ng serve --host 0.0.0.0
```
> 不需要手动打完整`ipv4`地址，达到配置在`package.json`里各电脑都可通过访问自己`ipv4`地址使用的效果
## 常用配置
### 修改全局组件开头
系统默认的是`app-`，我们通过修改`tslint.json`文件可将默认开头改为我们自己想要的：
```json
// 像这类我们创建默认开头就变成了kt
{
  "extends": "../tslint.json",
  "rules": {
    "directive-selector": [
      true,
      "attribute",
      "kt",
      "camelCase"
    ],
    "component-selector": [
      true,
      "element",
      "kt",
      "kebab-case"
    ]
  }
}

```