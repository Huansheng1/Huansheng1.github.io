# Visual Studio Code配置与技巧
## 扩展技巧
### 如何推荐别人使用一些扩展
我们可以在项目根目录的 .vscode/extensions.json 文件中配置一些推荐和不推荐使用的扩展，在扩展市场选择 Show Recommended Extensions 就可以看到我们推荐的扩展。

```json
// .vscode/extensions.json
{
    "recommendations": [
        "editorconfig.editorconfig",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "yutengjing.view-github-repository",
        "yutengjing.open-in-external-app"
    ],
    "unwantedRecommendations": [
        "hookyqr.beautify",
        "ms-vscode.vscode-typescript-tslint-plugin",
        "dbaeumer.jshint"
    ]
}
```