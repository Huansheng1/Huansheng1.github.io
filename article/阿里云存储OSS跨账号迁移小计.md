# 阿里云存储OSS跨账号迁移
## 背景
某个项目的照片存放在我们公司自己的阿里云存储里，但是，有一天对方需要将数据全部迁移到他们自己那里去，于是我们需要跨账户迁移阿里云存储的某个`Bucket`全部文件！
## 经过
首先，我注意到了：[`拷贝文件`](https://help.aliyun.com/document_detail/31861.html)
![](https://pic.imgdb.cn/item/612e217b44eaada739cf5a34.jpg)

因为我们不是用代码迁移，所以下面的`SDK`什么的先排除，然后，可选的不多了，图形化最简单，但是呢，有大小限制，最大限制为`5GB`，而我们准备迁移的`Bucket`有足足`70GB`，因此，我们选择了`命令行工具 ossutil`。

下载和安装对应我们当前操作系统的[`ossutil`](https://help.aliyun.com/document_detail/120075.htm?spm=a2c4g.11186623.0.0.56da7a74aJZg3U#concept-303829)软件包，并进行相应配置：
1. 单击下载链接下载工具。
2. 将工具解压，并双击运行ossutil.bat文件。
3. 运行以下命令，生成配置文件。
```bash
D:\ossutil>ossutil64.exe config
```
4. ![](https://pic.imgdb.cn/item/612e241e44eaada739d575d0.jpg)

我们按照要求来，进行配置下：![](https://pic.imgdb.cn/item/612e23e644eaada739d4eeb9.jpg)

> 注：
1. `endpoint`我们在[`访问域名和数据中心`](https://help.aliyun.com/document_detail/31837.htm?spm=a2c4g.11186623.0.0.837e1c34LQy5Hl#concept-zt4-cvy-5db)查看可以看到![](https://pic.imgdb.cn/item/612e247144eaada739d6448b.jpg),需要填入的是 公网地址。

2. 配置的是我们原阿里云存储账户，因为我们是将当前阿里云账户的`Bucket`拷贝、迁移到另一个最后账户的`Bucket`里！

配置完毕，我们查看下当前阿里云里的所有`Bucket`：
```bash
# 列出所有Bucket：
./ossutil64 ls
```
结果很正常的报错了：
```bash
'.' 不是内部或外部命令，也不是可运行的程序
或批处理文件。
```
原因很简单，网页上已经写了：

> 本文各命令行示例均基于`Linux 64位`系统，其他系统请将命令开头的`./ossutil64`替换成对应的`Binary名称`。详情请参见[`命`令行工具ossutil快速入门`](https://help.aliyun.com/document_detail/195960.html)。

于是很明显啦，我们将`./ossutil64`换成`ossutil64.exe`即可。
```bash
ossutil64.exe ls
```
当前账户下的`Bucket`列表：![](https://pic.imgdb.cn/item/612e250c44eaada739d7b5e8.jpg)

我们也可以查看下想要迁移的`Bucket`大小：
```bash
ossutil64.exe du oss://Bucket名字 --all-versions
```
> 这个有点慢，不如控制台查看方便！

然后，我注意到了[`sync（同步文件）`](https://help.aliyun.com/document_detail/300054.html)这个官网说明，同步文件？
> sync命令用于同步本地文件到OSS、同步OSS文件到本地、或者在OSS之间同步文件

有三个选项：
1. 有关sync命令用于同步本地文件到OSS的命令格式及使用示例的更多信息，请参见同步本地文件到OSS。

2. 有关sync命令用于同步OSS文件到本地的命令格式及使用示例的更多信息，请参见同步OSS文件到本地。

3. 有关sync命令用于在OSS之间同步文件的命令格式及使用示例的更多信息，请参见[在OSS之间同步文件](https://help.aliyun.com/document_detail/256354.htm?spm=a2c4g.11186623.0.0.2cc7543eWoa9EQ#concept-2080117)。

完美，第三条看起来就是它了，在不同`OSS`账户之间同步文件嘛，不错不错。

看了一下，发现不大对，咦，咋没看见怎么连接目标的`Bucket`，这看着不对啊，然后才意识到：`sync（同步文件）`是针对同一个账户下不同`Bucket`同步用的（当然，也可以阿里云存储和本地之间，但不在我们考虑范围内！）。

这时，最下面的 复制给了我们一线生机：
> 当您需要通过命令行工具ossutil管理不同地域的Bucket时，可以通过-e选项切换至指定Bucket所属的Endpoint。当您需要通过命令行工具ossutil管理多个阿里云账号下的Bucket时，可以通过-i选项切换至指定账号的AccessKey ID，并通过-k选项切换至指定账号的AccessKey Secret。

> 例如，您需要将另一个阿里云账号下，华东2（上海）地域下源存储空间examplebucket的文件夹srcfolder同步至目标存储空间testbucket的文件夹examplefolder，命令如下：

```bash
./ossutil64 sync oss://examplebucket/srcfolder/  oss://testbucket/examplefolder/ -e oss-cn-shanghai.aliyuncs.com -i LTAI4Fw2NbDUCV8zYUzA  -k 67DLVBkH7EamOjy2W5RVAHUY9H
```

说的稍微抽象了一点，意思就是很简单：
* 要将一个云存储里的东西拷贝到另一个地方，需要指定 源目录 和 目标目录，然后如果不是在一个地域的`Bucket`也要用`-e`参数指定下目标`Bucket`所在地域对应的`外网Endpoint`
* 如果是跨账号，需要通过`-i`指定阿里云的`AccessKey ID`，`-k`指定`AccessKey Secret`

> [命令的相关选项解释](https://help.aliyun.com/document_detail/50455.htm?spm=a2c4g.11186623.0.0.39b91bdb2n4ppu#section-yhn-ko6-gqj)

但是，这个也有个限制，我不确定文件大小有没有超过这个范围：![](https://pic.imgdb.cn/item/612e2d1744eaada739eb3b53.jpg)

于是，我们使用了`cp`这个命令：
```bash
# 直接拷贝bucket下面的所有东西
# -r代表递归拷贝，包括子目录和子文件
# -j代表多少个任务
ossutil64.exe cp oss://examplebucket  oss://testbucket -e oss-cn-shanghai.aliyuncs.com -i LTAI4Fw2NbDUCV8zYUzA  -k 67DLVBkH7EamOjy2W5RVAHUY9H -r -j 100
```
之所以使用`100`是因为按它上面的说明我不确定我们公司服务器算不算大：![](https://pic.imgdb.cn/item/612e2db044eaada739eca8ed.jpg)

当然，你也可能会碰见些许问题：

1. 权限不够：![](https://pic.imgdb.cn/item/612e2e4944eaada739ee1c49.jpg)
```bash
average speed 0(byte/s)
Error: oss: service returned error: StatusCode=403, ErrorCode=AccessDenied, ErrorMessage="The bucket you access does not belong to you.", RequestId=XXXXXXXXXXXX, Bucket=Bucket名字, Object=
```
解决思路：
* 在源`Bucket`和目标`Bucket`里都设置授权用户：![](https://pic.imgdb.cn/item/612e2ed344eaada739ef7f89.jpg)、![](https://pic.imgdb.cn/item/612e2f6044eaada739f177c7.jpg)、![](https://pic.imgdb.cn/item/612e2f2044eaada739f08db9.jpg)

2. 进度特别慢，我这里`100G`大概得拷贝`14`个小时，所以也许你觉得服务器还OK的情况下可以试着把`job`增加！

## 舍弃方案
1. [跨区域复制介绍](https://help.aliyun.com/document_detail/31864.html)
* 舍弃原因：太长，不讲人话！

2. [OSS 之间数据迁移](https://help.aliyun.com/document_detail/99079.html)
* 舍弃原因：虽然这个是网页操作，看起来也很符合![](https://pic.imgdb.cn/item/612e2c3844eaada739e9087e.jpg)，但是，有个坑爹的地方，需要申请填写工单，很麻烦而且不能立即解决问题：![](https://pic.imgdb.cn/item/612e2c7244eaada739e99efe.jpg)![](https://pic.imgdb.cn/item/612e2c9944eaada739ea00bb.jpg)

