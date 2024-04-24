# linux杂谈
## vi编辑文件中文不显示或者?怎么处理

场景：

当我们想修改一个文件时，往往会先通过`cat xxx文件`来查看它的内容，然后通过`vi xxx文件`来进行修改；但是，我们有时候会遇见一个中文不显示的问题。

解决过程：
### 先怀疑系统编码问题

1. 查看当前系统默认采用的字符集：`locale`：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210808233614.png)
2. 查看系统当前字符集: `echo $LANG`：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210808233659.png)
3. 通过上面命令我们可以查看系统是否安装中文字符集：出现zh开头的，即为安装了中文字符集，但显然我们这里是没有安装的。
4. 安装中文字符集：`yum -y groupinstall chinese-support`：
* 但是我们报错了：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210808233834.png)
* 解决办法：`yum -y groupinstall "fonts"`
5. 显示系统所有支持的字符集：`locale -a|grep zh  #locale -a`，这条命令可以找出和中文相关的字符集，方便后面修改使用。
6. 更改字符集所在的配置文件：`vim /etc/sysconfig/i18n`，输入：`LANG="zh_CN.UTF-8"`内容
7. 让修改生效：`source /etc/sysconfig/i18n`
8. 再次输入查看是否修改成功：`echo $LANG`


不过没解决，可能不是这个问题。
### 后续解决

> 待定

## 下载文件到某个地方
```bash
wget http地址
mv 原文件名 新文件名
```