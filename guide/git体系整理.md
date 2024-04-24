# Git体系整理

## 基础

### 概念

`git` 是一个 `分布式版本管理系统` ，是为了更好地管理Linux内核开发而创立的。

 其 `版本记录数据库` 在本地和远程服务器都有保存，因此没网时你依旧可正常的进行操作（除了推送到远程仓库之类的操作不行外）：

 ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516130554.png)

 ### 本地操作 - 单人开发，不涉及远程仓库

所以，让我们来完成一个将普通文件夹变成纳入 `git` 管理的项目的完整流程：

01. 初始化版本库：将 一个目录初始化为`git`管理的版本库 - `git init`，这时候，你可以看到`.git`隐藏文件夹

02. 然后，我们可用`git config -l`来查看`git`管理的相关配置

03. 新项目的话，我们需要先配置下 名称 和 联系邮箱：`git config user.name "幻生"`、`git config user.email "2933903535@qq.com"`，这样的话，别人可以看见是谁提交的代码便于联系以及追踪。

> 注意： `git config` 会显示有 `config` 配置有哪些指令可用，通过 `git config --unset 配置属性` 可以删除某个属性

04. 接着我们需要了解一个概念：`git`管理体系里有 `工作区WorkingTree` 和 `版本库` 两个概念，`工作区`就是初始化的项目目录，而 `版本库` 是已经纳入到`git`版本管理 里的资料，其又分为 `暂存区index/Cache`、`仓库Repository`。

05. 通过 `git status`我们可查看当前 `git`工作区内的文件状态，`Untracked files`标识的是 工作区内还未纳入版本库的文件列表：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516131522.png)

06. 通过`git add .`可以将当前目录下的所有文件加入到 `暂存区`：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516131748.png)

> 注意：如果是想确保本 `工作区` 的所有变更都加入到暂存区，需要使用 `git add -A` ，因为 `git add .` 只是将当前终端目录及以内的变更加入追踪。

07. 通过`git commit -m '提交到本地仓库的本次提交说明'`来提交到本地仓库，此时的工作区会很干净：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516131936.png)

08. 如果我们修改了一下之前已经提交的文件，你可以看见相关提示：

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516132800.png)， `git` 的好处体现出来了，我们可以明确地看到什么文件被修改了，且通过 `git diff 某个文件路径` 来查看最近一次该文件的修改内容：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516133025.png)

09. 通过`git log 要查看的文件`可查看追溯是由谁在什么时候提交的修改记录：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516142405.png)

> `git log` 可查看本项目的提交修改记录：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516142439.png)  

此外，我们还可以通过 `git reflog` 来查看提交记录的简要信息：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516142742.png)

10. 如果我们想要舍弃最近的全部修改，重置到上一次提交记录，可以这样做：`git reset --hard HEAD^`：
* 当前提交记录：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516150350.png)
* 回退到上一次提交记录：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516151026.png)
* `git reset --hard HEAD^`意思是 指向上一次记录，等同与 `git reset --hard HEAD~1`

> 注意，除了 `--hard` 外，还有 `--soft` 模式和 `--mixed` 模式， `--soft` 模式是 `HEAD指针` 指向某一个次，但硬盘数据不变，啥意思呢？就是 `log` 的 `commit` 记录跳回某一次，但文件数据不变，等于你将 `git commit -m ` 这个添加到仓库的操作撤回，但是 `已修改的文件` 和 `git add .` 不变，所以你通过 `git status` 和打开更改的文件发现没啥变化； `--mixed` 是默认模式，其更进一步，等于将 `git add .` 操作也撤回，直接回到了 工作区最开始的情况，这两种可用于 修改合并 `commit` 记录的情况，而 `--hard` 则更像是 舍弃操作。

11. 如果要恢复之前重置的内容，可以通过`git reset --hard hash标识`来跳回某一个提交记录：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516151429.png)

12. 开发中，我们总会有些文件不想要纳入版本管理，但是在本地又确实有用，比如：`配置文件`、`临时文件`、`本地测试文件`、`依赖文件`等，这时候我们可以给相关文件添加忽略配置：
* 通过`touch .gitignore`创建`git`的忽略配置文件
* 为了模拟我们需要忽略的文件，我手动创建了个`nodemodules`目录和`配置文件.env`文件，这时通过`git status`查看会发现，其算在了工作空间 内：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516152802.png)
* 配置`.gitignore`文件，将`nodemodules`目录和`.env`格式的文件进行忽略，不纳入`git`管理：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516153009.png)

``` bash
# 当前的配置

# 忽略nodemodules目录和其内文件
nodemodules/
# 忽略.env结尾的文件格式
*.env
```

### 多人开发 - 远程仓库，团队协同开发

多人开发的话，肯定是需要一个远程的版本库的，这样不同电脑上本地版本库都连接上同一个远程版本库（仓库）就可以实现代码的贡献以达到协同开发的效果：

01. 创建一个远程版本库 - `git init --bare`，你会发现 我们在`remote`目录下执行该命令时会创建一些文件，这些文件其实在我们之前执行`git init`时是存在`.git`目录里的，这也是它和工作区的区别：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516184716.png)

> 注意：这里我们在本地 `remote` 目录里模拟创建一个 `远程仓库` ，实际上我们一般是在 `github` 、 `gitee` 、 `gitlab` 之类的远程仓库网站上创建的。

02. 我们之前在`git-demo`目录初始化过并且往本地仓库提交了些数据，这等于我们先有个本地仓库，想提交到远程仓库给团队一起使用，我们先尝试用`git push`往远程仓库推送本地仓库的记录：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516185559.png)

03. 上面你会发现，由于我们之前没有关联远程仓库，导致它不知道推送到哪去，因此提示我们关联一个远程仓库地址 - `git remote add origin  要关联的远程仓库地址`：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516185523.png)

> 小技巧：将 `remote` 文件夹直接用鼠标往 `git bash` 上拖可快速增加该目录路径。

04. 关联远程仓库后我们尝试再次推送，结果发现 我们还需要将本地分支关联对应上远程分支：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516185321.png)

05. 因此通过`git push --set-upstream origin master`推送并关联分支，发现就成功了：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516185826.png)

06. 实际情况，我们往往是先有个仓库地址，然后我们才开发的，这时候就需要`git clone 远程地址`来拉取远程的仓库记录：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516190457.png)

> 注意： `new` 目录也是我们在一台电脑上模拟一个新工作区，克隆下来你会发现 `远程版本库目录的名字代表着项目名称`

07. 克隆下来了，我们在这个新工作区提交一个记录测试不同设备之间的交互：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516190807.png)
08. 在之前工作区从远程仓库拉取记录：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516190849.png)

09. 不同电脑之间通过远程仓库同步代码的步骤完成了，但我们在实际开发过程中，往往我们提交时其他人已经往远程仓库提交过数据了，那么我们推送时会报错：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516192641.png)

10. 因此，推送到远程仓库正确的做法是：通过`git pull`先拉取最新代码，再将本地代码推送到远程仓库：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516192805.png)

11. 由于我们模拟的冲突是修改同一个文件且修改的位置相同，这导致拉取最新代码后因为修改内容冲突导致无法自动将内容合并，因此`new.js`文件产生冲突了，冲突细节如下：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516193003.png)

12. 这时需要我们手动处理冲突，因为我们这里两行代码是互不干扰的，不需要进行对比删除，都保留即可：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516193201.png)

13. 手动解决冲突后我们重新提交：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516193351.png)

### 分支相关 - 进阶且常用

01. 像我们之前直接克隆的工作区，如果我们通过`git branch`查看本地全部分支，你会发现是会显示`master`分支的：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516200211.png)

02. 但所有的仓库克隆下来都是这样么？其实不然，如果我们仓库是个空仓库的话，结果会明显不同，让我们来测试下，首先新建个新的远程仓库：`git init --bare`

> 小技巧：通过 `&&` 符号我们将几个命令写成一行依次执行 - 创建 `branch-remote` 目录进入并初始化为远程版本库： `mkdir branch-remote && cd branch-remote && git init --bare`

03. 然后我们发现了，一个空仓库的话，`git branch`什么都不会显示：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516201157.png)

04. 如果我们使用`git status`的话，会发现：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516201930.png)
05. 这是因为远程仓库是一个空仓库，连`master`分支都不存在，因此我们按照提示执行`git branch --unset-upstream`即可。

> 注意：测试发现其实直接用 `git push` 就能将本地 `master` 分支推给远程仓库，并不会报错。

06. 创建新分支的方式也很简单 - `git branch 新分支名字`：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516202116.png)

> 注意：分支创建时会继承当前分支的全部信息，但是创建完毕后就是彼此独立的。

07. 通过`git switch 分支名`或者`git checkout 分支名`可以切换到指定分支
08. 通过`git branch -D 分支名`可以删除该分支：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516202301.png)
09. 由于我们还没有提交，通过`git branch -r`查看远程分支你会发现啥都么有，因此如果我们要将本地分支推送给远程该怎么做呢？其实也很简单，`git push`不行的话，按照提示执行` git push --set-upstream origin 分支名`即可：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516203104.png)
10. 这时你会发现远程也存在了本地这个分支：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516203150.png)
11. 一般当我们在某个分支做完某件事后，常常需要将那个分支的代码合并到`master`主分支上来：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516203654.png)

12. 通常来讲，我们合并后会将已经废弃的分支删除：`git branch -D 分支名`，但是通过`git branch -r`你会发现远程的分支还在，这显然不是我们想要的：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516204010.png)
13. 因此，我们还需要通过`git push origin --delete test`删除远程分支：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516204121.png)

### Gitflow - git工作管理规范

`Gitflow` 所需的分支：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516204904.png)

**第一步**：创建主分支、打上版本号并创建开发分支 - ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516231349.png)

01. 创建远程版本库，本地克隆远程版本库，修改一下做一次提交到远程仓库
02. 给当前`commit`记录打上标记`v0.0.1` - ` git tag -a v0.0.1 -m '版本描述信息'` ：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210516235747.png)
03. 通过`git tag`可以查看当前有哪些`tag`（列表）
04. `git show tag版本号`可以查看指定版本的tag的详细信息：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210517233824.png)
05. 当然打上了标签标记版本后，我们肯定是希望它能够推送到远程的，因此我们通过`git push origin v0.0.1`推送指定版本到远程仓库：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210517234113.png)

06. 接着我们按照`Gitflow`工作流继续创建 开发分支`Develop`：`git branch Develop`
07. 切换到开发分支：`git switch Develop`
08. 关联本地分支与远程分支并推送：`git push --set-upstream origin Develop`

**第二步**：分配任务给对应人员，对应人员创建特性分支并开发提交，管理者代码审核并合并 - ![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210517235355.png)

01. `leader`分配张三做登录页，分配李四做主页
02. 张三拉取克隆当前分支并创建`feature/login`新特性（功能）分支：`git clone 远程地址 && cd 仓库项目名 && git branch feature/login && git switch feature/login`
03. 李四同样操作创建`feature/index`分支：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210518000100.png)
04. 张三李四都进行开发，开发完毕后，推送到自己的分支，通知`leader`进行代码审查
05. `leader`分别一个一个切到对应分支进行代码审核，审核通过则将该分支合并到`Develop`开发分支上

**第三步**：开发完成后，进入预上线阶段， `leader` 根据当前 `Develop` 分支创建 `release/版本号` 分支，测试人员切到该分支测试 `bug` ，如果发现 `Bug` ，记录成 `Issue` 通知对应的开发人员，开发人员根据 `Issue` 创建对应的 `bugfix/issue编号` ，修复完毕后开发人员切回 `release` 分支并将修复 `Bug` 的分支合并进来，再通知测试人员继续测试，一直到 `Bug` 全部修复完毕， `leader` 将当前开发分支合并到 `master` 主分支并更新版本号：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210518000351.png)

01. `leader`创建对应的发行分支并推送到远程版本库：`git branch release/v0.01 && git switch release/v0.01 && git push --set-upstream origin release/v0.01`
02. 测试人员切到当前发行分支进行测试，如果发现`Bug`记录复现步骤和`Bug`表现通知开发人员修复
03. 开发人员根据`Bug`对应的`Issue`进行创建修复分支并修复操作：`git pull && git switch release/v0.01 && git branch bugfix/issue01 && git switch bugfix/issue01`
04. 开发人员修复完毕后，将当前修复分支合并到对应的发行版本分支并通知测试人员继续测试
05. `Bug`全部修复完毕后，`leader`将当前`发行版本`合并到`开发分支`，再将`开发分支`合并到`master`分支并更新新的版本号。

**第四步**：上线后如果遇见 `bug` ，这时我们创建基于 `master` 的 `hotfix/issue编号` 紧急修复分支，开发人员切到该分支进行修复，修复后将该分支分别合并到 `Develop` 开发分支和 `master` 主分支， `leader` 在 `master` 分支上打上新的版本号并推送发布：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210518003050.png)

## 其他文章

* [git知识小课堂](./git.md)
* [git踩到的坑](./git踩到的坑.md)
* [git进阶操作](./git进阶操作.md)

## 推荐链接

* [猴子都能懂的GIT入门](https://backlog.com/git-tutorial/cn/)
* [Git - 打标签](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E6%89%93%E6%A0%87%E7%AD%BE)
