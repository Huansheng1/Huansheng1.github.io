# 校验器与数据库模块sequelize
## LinValidator校验器
文档：[校验器 | Lin CMS](https://doc.cms.talelin.com/server/koa/validator.html)
源码：[lin-cms-koa-core/lin-validator.ts](https://github.com/TaleLin/lin-cms-koa-core/blob/master/lib/validator/lin-validator.ts)
## 安装软件
* [XAMPP](https://www.apachefriends.org/index.html)
* > 可能下载需要翻墙。
* [MySQL 安装 | 菜鸟教程](https://www.runoob.com/mysql/mysql-install.html)

1. `xampp`一键安装所需软件,包括数据库`mysql`，然后启动数据库服务：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004163856.png)
2. 安装`navicat`连接数据库，连接，默认用户名为root，密码为空不填即可：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004175809.png)
* > 通过`XAMPP`安装`MySQL`其实是`MariaDB`，而后者没有`password_lifetime`，取而代之的是`password_expired`；因此我们需要选择`MariaDB`连接。
3. 新建数据库：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004170515.png)
4. 新建/修改用户和密码：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004180224.png)
5. 检验密码是否设置成功：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004180935.png)
6. 关闭连接，重新编辑连接再验证密码是否正确：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004181036.png)
## sequelize模块管理数据库
安装插件：`npm install --save sequelize`，然后尽量看一下官网[sequelize中文文档](https://github.com/demopark/sequelize-docs-Zh-CN)；

首先，我们需要指定如何使用：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004181529.png)

当然，为了代码解耦，我们应该在配置文件中配置数据库相关设置再引入到这里：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004181655.png)

可是，在正式使用之前，我们还需要知道，如果`sequelize`想要连接操作`mysql`数据库，还需要先安装对应驱动：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004182205.png)
```
# 选择以下之一:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
```

### 连接mysql实战
1. 连接数据库的实例：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004182529.png)
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201004182508.png)
2. 建立模型`Model`，模型相当于数据库里的数据表：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201005182758.png)
* > 模型是 `Sequelize` 的本质. 模型是代表数据库中表的抽象. 在 `Sequelize` 中,它是一个 `Model` 的扩展类.  

* > 该模型告诉 `Sequelize` 有关它代表的实体的几件事,例如数据库中表的名称以及它具有的列(及其数据类型).  

* > 注意,在以上两种方法中,都从未明确定义表名(`Users`). 但是,给出了模型名称(`User`).

* > 默认情况下,当未提供表名时,`Sequelize` 会自动将模型名复数并将其用作表名. 这种复数是通过称为 `inflection` 的库在后台完成的,因此可以正确计算不规则的复数(例如 `person` -> `people`).
```js
const { Sequelize, DataTypes, Model } = require('sequelize');
// Sequelize 提供很多内置数据类型. 要访问内置数据类型,可以导入 DataTypes
const sequelize = new Sequelize('sqlite::memory');

class User extends Model {}

User.init({
  // 在这里定义模型属性与类型
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    // allowNull 默认为 true
    comment: '注释信息，这是带有注释的列'
    // 注释只能添加到 MySQL,MariaDB,PostgreSQL 和 MSSQL 的列中
  },
  defineName: {
    type: DataTypes.STRING,
    field: 'define_name'
    // 通过 'field' 属性指定自定义列名称
  }
  nowTime: {
    type: DataTypes.DATETIME,
    defaultValue: Sequelize.NOW
    // 默认值为Null，但我们可以自己指定的
    // 这样,当前日期/时间将用于填充此列(在插入时)
  }
}, {
  // 这是其他模型参数
  sequelize, // 必填，我们需要传递连接实例，ES6写法- > sequelize:sequelize
  modelName: 'User' // ,我们需要选择模型名称，但非必填
  // tableName: 'Users' // 其实我们也可以指定数据表名字
});

// 定义的模型是类本身
console.log(User === sequelize.models.User); // true
```
3. [创建模型实例](https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/core-concepts/model-instances.md#创建实例)，真正将数据持久保存到数据库：
```js
const huansheng = await User.create({ nickname: "huansheng", email: "88888888@qq.com", password: "123456" });
// huansheng 现在存在于数据库中！
console.log(huansheng instanceof User); // true
console.log(huansheng.email); // "88888888@qq.com"
```
4. 更新数据：
```js
huansheng.name = "Ada";
// 数据库中的名称仍然是 "huansheng"
await jane.save();
// 现在该名称已在数据库中更新为 "Ada"！
```
当然，如果我们本地修改了又不想要了，就可以像浏览器一样刷新重新变为数据库里的数据：
```js
huansheng.name = "Ada";
// 还未保存，数据库中的名称仍然是 "huansheng"
await huansheng.reload();
// reload 调用生成一个 SELECT 查询,以从数据库中获取最新数据.
console.log(huansheng.name); // "huansheng"
```
最后，我们可以删除该信息：
```js
await huansheng.destroy();
// 现在该条目已从数据库中删除
```
5. 查询数据：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201006094631.png)
### 模型同步与`define`属性
在之前的连接配置里，我们`define`属性没具体介绍有哪些常用的选项：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201005182318.png)
> 强烈注意：图中搞错了，**`createAt`属性指的就是`createTime`创建时间**，只是属性名和默认的列名不一样，所以我之前搞错了！


配置选项说明：  
1. 默认情况下,`Sequelize` 使用数据类型 `DataTypes.DATE` 自动向每个模型添加 `createdAt` 和 `updatedAt` 字段. 这些字段会自动进行管理 - 每当你使用 `Sequelize` 创建或更新内容时,这些字段都会被自动设置. `createdAt` 字段将包含代表创建时刻的时间戳,而 `updatedAt` 字段将包含最新更新的时间戳.
* > 注意： 这是在 `Sequelize` 级别完成的(即未使用 SQL触发器 完成). 这意味着直接 `SQL` 查询(例如,通过任何其他方式在不使用 `Sequelize` 的情况下执行的查询)将不会导致这些字段自动更新.
```js
// 除了图中的连接配置里全局指定，我们也可以选择只在某个模型里指定设置
class User extends Model {}
User.init({ /* 属性 */ }, {
  sequelize,

  // 不要忘记启用时间戳！
  timestamps: true,

  // 不想要 createdAt
  createdAt: false,

  // 想要 updatedAt 但是希望名称叫做 updateTimestamp
  updatedAt: 'updateTimestamp'
});
```
2. `paranoid`：需要注意`paranoid` 属性只在启用 `timestamps` 时适用；启用后不从数据库中删除数据，而只是增加一个 `deletedAt` 标识当前时间,我们常说的逻辑删除。

3. `underscored`: 表示不使用驼峰式命令规则，而是使用下划线分隔

4. `freezeTableName`：默认情况下`sequelize`会自动使用传入的模型名设置为复数表名，如果你不想使用这种方式你需要启用该设置

5. `deletedAt`:注意要启用逻辑删除方会出现，且该选项才能生效

此外，`sync`是不是看着有点迷糊？其实[模型同步的中文文档](https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/core-concepts/model-basics.md#模型同步)说得比较详细：  
> 如果我们不确定模型对应的数据表是否存在于我们的数据库 或者 模型属性是否与已存在的数据表列一致 ， 我们可以通过该方法确保 模型能与数据库同步一致

用法其实有多种：
1. 指定模型同步：
```js
User.sync() - 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
User.sync({ force: true }) - 将创建表,如果表已经存在,则将其首先删除
User.sync({ alter: true }) - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.

// 后面两种方法需要慎用
```
2. 自动同步所有模型：
```js
await sequelize.sync({ force: true });
```

但是我们需要注意，如果连接的数据库不存在，`sync()`就会报错！