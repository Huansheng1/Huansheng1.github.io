# git报错解决指南

## 提交报错

### remote: huansheng: Incorrect username or password (access token)
错误原因：

* 大概率是 用户名错误 或者 密码错误

解决办法：

1. 打开文档管理器，输入以下地址：`控制面板\用户帐户\凭据管理器`
2. 找到 `Window凭证`，选择 对应的普通凭证：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210419230728.png)
3. 编辑修改对应的用户名和密码：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210419230821.png)

### git push -u origin master报错：Permission denied (publickey).

``` bash
The authenticity of host 'github.com (13.250.177.223)' can't be established.
RSA key fingerprint is SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'github.com,13.250.177.223' (RSA) to the list of known hosts.
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

> 这里我们在第三行按照指示敲上了yes，可是并不顶用！  
> 再次尝试：  

``` bash
Warning: Permanently added the RSA host key for IP address '13.229.188.59' to the list of known hosts.
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.      

Please make sure you have the correct access rights
and the repository exists.
```

> 既然如此，尝试重新试试配置的命令  
> 1. ssh -T git@github.com  
> `git@github.com: Permission denied (publickey).` 第一步被拒绝了。。。  
> 2. git config --global user.name "Huansheng1"  配置用户名  
> 3. git config --global user.email "2933903535@qq.com"  配置用户邮箱  
> 再次尝试：依旧如此。  

``` bash
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

> 推测秘钥问题  
> 解决开始：  
>> github主页 -> 点击设置 -> 进入 SSH and GPG keys  
>> 创建一个新的密钥"New SSH key"  
>> 这里出现个 输入key的框  
>> 我们回到 需要上传的项目文件夹的根目录，右键Git Base Here  
>> 输入命令： `ssh-keygen -t rsa -C "2933903535@qq.com"`

![image.png](https://i.loli.net/2020/06/03/SljRmrN7YWadC8c.png)

  

>> 一路回车，不要做其他操作  
>> 输入命令： `cat ~/.ssh/id_rsa.pub`

![image.png](https://i.loli.net/2020/06/03/ArZzyWu3dYt9Jis.png)

  

>> 复制公钥输入到key的输入框，不要名字！  
>> `git push --set-upstream origin master` 成功了！  

### git push -u origin master出错： [rejected]

``` bash
To github.com:Edward125/DetectFileEncoding.git
 ! [rejected]        master -> master (fetch first)
error: failed to push some refs to 'git@github.com:Edward125/DetectFileEncoding.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

> 解决方法有两种  
> 1. 根据提示，使用git pull，将github上的分支和本地的分支合并  
> 2. 使用push -f origin master 强制push  

### git push 后dist文件夹就是无法上传：

> 尝试过N个办法，个人最粗暴的办法：  
>> 将项目目录里的.git目录删除  
>> 这就相当于将本地仓库的全部记录全部删掉，重新连接远程仓库  

``` bash
git init
git add .
git commit -m 'message'
git remote add origin 'git@github.com:Huansheng1/Huansheng1.github.io.git'
git push -u origin master
```

>> 然后强制push！  

### 推送报错：`error: RPC failed; HTTP 504 curl 22 The requested URL returned error: 504；send-pack: unexpected disconnect while reading sideband packet；Writing objects: 100% (550/550), 54.09 MiB | 500.00 KiB/s, done.；Total 550 (delta 0), reused 0 (delta 0), pack-reused 0 fatal: the remote end hung up unexpectedly`

解决方式有两种：
1. 加大缓存区的大小：
```bash
git config --global http.postBuffer 524288000 
```

2. 从`http`换协议为`git`：
```bash
git remote remove  origin
git remote add origin xxx.git
```

## 连接仓库

### 已连接其他仓库修改地址

> 多种方法操作：  
> 一种是直接使用git命令来操作  

``` bash
#断开连接
git remote remove origin
#与仓库关联
git remote add origin 'git@github.com:Huansheng1/Huansheng1.github.io.git'
```
