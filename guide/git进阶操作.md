# `git` 进阶操作

## 基础命令回顾

1. `git log`：`commit`提交历史
2. `git status`：查看当前文件是否有没提交的

## 修改上次 `commit` 信息

场景：

> 我们在某次 `git commit -m '提交信息'` 里说明信息单词拼写错误想修改这次描述信息时

步骤：

1. 敲击命令：

``` bash
# 用来修改前一次提交的 commit message
git commit --amend 
```

2. 此时终端会使用`vi`编辑器让我们可在它上面对上次提交信息进行编辑

## 将之前提交操作进行合并或者修改

场景：

> 我们对一个简单 `bug` 修改 `commit` 了多次后不想让别人看见这奇葩操作，想将之前的多次操作合并成一次

步骤：

1. 敲击命令：

``` bash
# 交互式的进行之前多次提交的修改
# 这里指编辑前两次操作：可合并/修改/删除这两次操作及其相关信息
git rebase -i HEAD~2
```

2. 终端修改，按下`i`进入插入模式，可以插入字母，按`x`可删除一个字，按`Esc`可退出当前模式，如果想要退出`vi`编辑界面，需要按`:q`即可（还有，如果想删除后面的可以按`100dd`代表删除后面100行数据，`u`撤销）

![](https://pic.downk.cc/item/5f87dc521cd1bbb86bda4b8b.jpg)![](https://pic.downk.cc/item/5f881bb21cd1bbb86b06879f.jpg)

3. 将想要合并的`commit`记录前面改为`s`，想要保留的不变，按`:wq`退出后，`git add .`保存修改，`git rebase --continue`继续变基操作
4. `git push -f`强制推送到远程分支即可

## 指针回退上一次提交

场景：

> 我们想撤回到某次提交之前

步骤：

1. 敲击命令：

``` bash
git reset HEAD~1
```

2. 此时，指针指向上一次，因此，`git log`会显示为最近一次的提交之前的历史，最新一次提交历史被隐藏（即取消最新一次的提交）
3. 注意：`git status`你会发现：本地文件还是最新提交时的文件，仅仅是`git`的`working tree`回溯到了上一次（即 取消`git`历史里的最新提交，但本地文件依旧是最新提交时文件; 因此我们如果反悔可重新提交）
4. `git reset HEAD~1 --hard`：可实现将本地文件也回溯删除掉
5. 回溯后如果知道之前的最新版本编号，可通过`git reset xxxx版本编号`重新指回来

## 分支继承最新 `master` 代码

> 场景：通常我们想让比较老的分支继承最新 `master` 的代码来避免冲突，一般都是通过 `git merge master` 将主分支代码合并到当前分支来，但是当我们再将该分支合并到主分支时就会显得非常怪异

步骤：

1. 拉取最新主分支代码到当前分支，并将记录看起来像是分支从现在的主分支开出来的

``` bash
git pull origin master --rebase
```

2. 处理本地的冲突
3. 添加到暂存区，使得最新代码处于`git`版本管理下

``` bash
git add .
```

4. 确认完成`rebase`变基操作

``` bash
git rebase --continue
```

## 储存当前修改

> 有时候我们在一个老分支修改了另一个新分支的内容时，想切回去，却发现已经无法直接切了

1. 将当前所有改动添加到暂存区，`git add .`，以便我们的`git`能追踪到全部更改，如果不这样做，新建的文件是无法在下一步追踪到的
2. `git stash`将当前全部修改储存起来，`git switch xxx-`切到其他分支
3. `git stash pop`将刚刚暂存的变动弹出来，如果有多个储存记录则可以用`git stash list`查看哦

## 项目一半的过程中修改了 `.gitignore` 文件却无效问题

> 如果我们项目做到一半时，突然要将一个文件夹加入到 忽略配置里，你会发现不生效，因为 忽略配置 只能忽略未加入到追踪的文件

1. 清除之前的缓存，来取消追踪：`git rm -r --cached .`
2. 将所有文件添加到暂存区：`git add .`，此时就不会将配置文件里的东西一起加入
3. 随便写个`commit`提交上去：`git commit -m 'update .gitignore'`，再 `git push -f`即可

## 发布版本
* 发布小版本：
```bash
# 切到某个分支
git switch 1.3.x
# 升级小版本
npm version patch
# 将本地标签tag推送到origin远程仓库
git push --follow-tag
```
* 删除某个版本：
```bash
# 查看tag列表
git tag
# 输出：
# v1.3.3
# v1.0.1
# v1.1.2
# v1.4.6
```
* 撤回某个版本tag:
```bash
# 删除本地的1.4.8版本tag
git tag -d v1.4.8
# 将变更记录推送到服务器
git push origin :refs/tags/v1.4.8
# 重置当前git记录
git reset HEAD~1
# 取消全部变更，当然你可以上一步直接使用 --hard，只是我们为了看一下哪些变更不需要，确保一下
git checkout .
# 推送到当前远程分支
git push -f
```
* 发布大版本 - 1.4.x为例：
```bash
# 创建新tag分支
git branch 1.4.x
# 推送到远程告诉仓库创建了一个分支
git push origin 1.4.x:1.4.x
# 进行本地与远程分支的关联
git branch --set-upstream-to=origin/1.4.x 1.4.x

# 后续步骤和打上小标签一样
```

## commit提交错了分支，需要将错误分支的提交commit记录提取到正确分支
假设，我们想给`1888`分支提交几个`commit`，但是，突然发现我们之前是在`1666`分支上干的，`commit`提交记录已经进了`1666`分支：
```bash
# 切到正确分支
git switch 1888
# 将错误分支的commit提取到当前分支
git cherry-pick commit哈希值1 commit哈希值2 commit哈希值3
# 支持批量提取多个哦，用空格隔开
```
