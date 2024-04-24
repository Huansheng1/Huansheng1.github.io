# docker容器个人使用记录

> 环境：CentOs8环境为准

## 初体验

### 相关网站

* docker仓库：[搜索想要的镜像仓库](https://hub.docker.com/)
* 免费docker部署网站：[Cloud Application Platform | Heroku](https://www.heroku.com/)

### 安装docker环境

#### 前期准备

1. 使用 root 权限登录 Centos。确保 yum 包更新到最新：

```bash
sudo yum update
```

2. 安装的yum工具集：

```bash
yum install -y yum-utils
```

#### 手动安装

1. 安装docker-ce的yum源:

```bash
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

2. 安装docker-ce

```bash
dnf install docker-ce
# 或者用yum安装

yum install docker-ce
```

3. 查看docker服务状态:

```bash
systemctl status docker.service
```

4. 开启`docker`自启动:

```bash
systemctl enable docker.service
```

5. 开启`docker`服务:

```bash
systemctl start docker.service
```

#### 一键安装

1. 安装`docker`环境：

```bash
#使用官方安装脚本自动安装
#安装命令如下：
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

#也可以使用国内 daocloud 一键安装命令：
curl -sSL https://get.daocloud.io/docker | sh

#以上二选一即可
```

2. 开启`docker`开机自启：

```bash
#建议docker开机自启
systemctl enable docker
```

### 查看docker信息

该命令会返回所有容器和镜像的数量、Docker使用的执行驱动和存储驱动以及Docker的基本配置：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210718125623.png)

```bash
docker info
```

### 拉取安装镜像

如图，我们选择了一个 `qinglong` 镜像（docker仓库里可以查看搜索），将它拉取到本地：

```bash
docker pull whyour/qinglong:latest
```

### 根据镜像创建并启动容器

#### 根据镜像创建并启动容器

```bash
# container可省略，这里我们拉取了ubuntu镜像
docker container run -it ubuntu:latest /bin/bash
```

注意，如果容器名不能重复，创建容器时默认会生成一个容器名，而生成容器名的策略，据我观察大概是：
* 如果根据镜像创建会默认查找是否有镜像名的容器，如果没有，则根据镜像名创建容器名，如果已有镜像名容器则产生个 随机容器名

> Docker会为我们创建的每一个容器自动生成一个随机的名称。如果想为容器指定一个名称，而不是使用自动生成的名称，则可以用—name标志来实现：

```bash
docker run --name 容器名 -i -t 镜像名 /bin/bash
```

如果我们试图创建两个名称相同的容器，则命令失败。如果要使用的容器名称已经存在，可以先用 `docker rm` 命令删除已有的同名容器后，再来创建新的容器。

上面创建的容器都属于 `交互式运行` 的容器，如果容器内进程没有能常驻后台的，当你在终端执行 `exit` 退出容器时，docker进程也会停止，因此如果我们有需要，可以创建长期运行的容器。

`守护式容器` 没有交互式会话（如上在执行指令后直接在终端bash交互输入），非常适合运行后台应用程序和服务。

```bash
docker run --name 容器名 -d 镜像 /bin/sh -c "while true;do echo hello world;sleep 1;done"
```

通过 `-d` 参数，Docker会将容器放到后台运行。

`/bin/sh` 会启动docker的bash终端，通过配合 `-c "shell代码"` 在容器里运行了一个while循环，该循环会一直打印hello world，直到容器或进程停止运行。

> 提示：[Docker run 命令参数及使用](https://www.cnblogs.com/Coder-lp/p/13269513.html)

通过组合使用参数，可以发现docker run命令并没有像上一个容器一样将主机的控制台附着到新的shell会话上，而是仅仅返回了一个容器ID而已。

如果我们也想查看该镜像的运行结果，有两种方式可以实现：

1. 通过`docker attch`附着到容器上查看：

```bash
docker attch name/ID
```

2. 通过`docker log`查看容器日志：

```bash
docker logs name/ID
```

![](https://img2018.cnblogs.com/blog/967123/201812/967123-20181203010633756-66529287.png)

我们还可以查看某个容器的运行进程：

```bash
docker top name/ID
```

#### 启动已存在的容器

```bash
# 通过docker ps -a即可查看容器列表，并选择想启动的容器
docker start 容器名/容器ID
```

### 查看docker容器列表/信息

默认情况下docker ps只能看到正在运行的容器，但是加上-a会列出所有的容器，包括正在运行的和已经停止的：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210718130642.png)

```bash
# 查看运行中的docker列表
docker ps
# 查看所有的docker列表（包括已停止的）
docker ps -a
# 列出最后一次运行的容器，包括正在运行的和已经停止的。
docker ps –l

# 查看指定容器详细信息：
docker inspect 容器名/容器ID
```

从该命令的输出结果中我们可以看到容器的很多有用信息：ID、用于创建该容器的镜像、容器最后执行的命令、创建时间以及容器的退出状态（上面退出状态为0，因为容器是通过正常的exit命令退出）

### 进入docker容器目录

docker类似于一个独立的系统小环境，有其单独的系统目录，我们要想查看某个镜像文件，可以进入其容器目录查看：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210718131137.png)

注意： `exec` 是打开一个新的shell交互式任务， `attach` 是附加到原有的shell终端上，这点需要注意哦。

```bash
# 如：通过镜像名进入该镜像，容器id也可，另外 container也可省略
docker container exec -it qinglong /bin/bash
# 也可根据CONTAINER ID进入，CONTAINER_ID通过 docker ps查看运行中的docker镜像列表查看
docker CONTAINER_ID  exec -it qinglong /bin/bash
# 有种意外情况，如果/bin/bash目录被破坏了，我们后面就可用其他入口路径代替
docker container exec -it qinglong sh

# 命令解释：docker exec -it qinglong /bin/bash 等同于 docker exec -i -t qinglong /bin/bash

# 告诉docker执行docker exec命令，并指定了-i和-t两个命令行参数，-i: 以交互模式运行容器，通常与 -t 同时使用；
# -t: 为容器重新分配一个伪输入终端，通常与 -i 同时使用；
# -it   //是容器具有交互性，并与终端进行连接，类似于git rebase的-i，与终端进行交互式
```

如果想查看docker某个文件内容，只需要前面就加上 `docker` 进入容器目录的指令即可：

```bash
# 查看文件列表
docker exec [容器名称] ls

# cat 本来是在linux里查看指定路径的文件内容的指令，前面接上docker命令可直接查看dokcer目录内容
docker exec -it qinglong cat /ql/scritps/要查看的文件.text

# 移动或者重命名
docker exec -it qinglong mv /ql/scritps/要查看的文件.text ./new-file.text
```

进入容器目录后，我们可以通过执行容器内的 `linux命令` 查看当前容器内的运行进程：

```bash
ps -elf
```

运行进程有两个特殊的进程：上面这个是我们当前运行的 `Bash Shell` 终端, 第二个进程是临时进程，由 `ps -elf` 这个命令产生，命令执行完进程也会结束。
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210718132451.png)

退出终端进入的容器：

```bash
# 注意：如果在Bash Shell输入exit会退出Bash Shell，如果这时容器中没有任何进程运行，容器本身会被杀死。
exit
```

### 复制本地文件到docker容器目录

有时候我们需要将linux本地系统的某个文件复制到docker镜像目录里，这时候也需要依靠docker指令来进行：

```bash
# 将当前终端本地目录的xmsport.py文件复制到运行中的镜像里的scripts目录下
docker cp xmsport.py 2aa8ca2c8d0a:/ql/scripts

# 情景:比如一个docker实例无法正常启动
# 我们通过：docker start 实例id -a 查看无法启动的原因，定位到要修改的配置文件

# 把docker容器中的配置文件复制到主机中
# docker cp 容器id：docker容器中配置文件路径  主机路径
# docker cp eaaba6bd4423:/etc/mysql/mysql.conf.d/mysqld.cnf /root/mysqld.cnf  
```
### 本地文件复制回容器
<!-- 通常用于解决docker无法启动的问题:我们修改配置文件后拷贝回去,然后docker会自动重启. -->
```bash
# 可以解决容器在无法启动的情况下，修改容器中的配置文件
# docker cp 主机文件路径 容器id：docker容器中配置文件路径
# docker cp /root/mysqld.cnf eaaba6bd4423:/etc/mysql/mysql.conf.d/mysqld.cnf
```
### 查看日志
查看指定时间后的日志，只显示最后100行：
```bash
docker logs -f -t --since="2018-02-08" --tail=100 CONTAINER_ID
```

查看最近30分钟的日志:
```bash
docker logs --since 30m CONTAINER_ID
```
### 重启docker进程

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

对应单个容器，我们也可以配置重启策略：

```bash
# 根据某个镜像创建并启动容器，设置其为守护式且如果容器意外退出了，Docker自动重新启动该容器
docker run --restart=always --name 容器名 -d 镜像名 /bin/sh

# 注，重启策略有多种，还可以这样：
docker run --restart=on-failure:5 --name 容器名 -d 镜像名 /bin/sh

# 当容器退出代码为非0时，Docker会自动重启该容器，最多重启5次。
```

### 停止容器

```bash
docker container stop 容器名/容器ID
```

### 删除docker镜像

#### 删除单个docker镜像

```bash
# 杀死qinglong镜像运行进程
docker kill qinglong
# 删除docker青龙镜像，可以加上-f强制参数
docker rm qinglong
```

#### 删除全部docker镜像

```bash
#逐行输入
docker kill $(docker ps -a -q)
# -a标志代表列出所有的容器，-q标志则表示返回容器的ID而不会返回其他信息；也可以这样写： docker container rm $(docker container ls -aq) -f 
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
```

### 重装docker

这个其实就是 先执行上面的删除镜像指令，再执行 拉取镜像，然后启动镜像即可。
