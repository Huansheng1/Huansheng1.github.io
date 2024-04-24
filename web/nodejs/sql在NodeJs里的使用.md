# mysql2操作mysql数据库

## 安装

``` shell
npm install mysql2
```

## 基本用法

``` js
// 导入数据库
const mysql = require('mysql2');
// 连接数据库
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'ted_mysql_demo',
    user: 'root',
    password: ''
})
// 数据库待执行命令
const sqlCmd = `
    SELECT * FROM account WHERE id > 18;
`
// 数据库查询
connection.query(sqlCmd, (err, data, filed) => {
    console.log('查询结果：', data)
    // 查询完后结束连接
    connection.end();
    // 强制关闭，即使发生错误下面监听错误的也没法处理
    // connection.destroy();
})
// 为避免出现异常监听错误
connection.on('error', (err) => {
    console.log('999', err)
})
```

## 预处理语句 `Prepared Statement`

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201223210119.png)

``` js
// 导入数据库
const mysql = require('mysql2');
// 连接数据库
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'ted_mysql_demo',
    user: 'root',
    password: ''
})
// 预处理语句，其实我们可以理解为：一个sql语句执行模板
// 通过先定义个核心模板，再给想要查询不同数据传递不同值，即可实现sql语句一次编译、多次执行的操作
const sqlCmd = `
    SELECT * FROM account WHERE id > ? AND id < ?;
`
// 执行，第二个参数值传递进入的参数，如上我们有两个参数，就可以在这里传递两个参数
connection.execute(sqlCmd, [2, 15], (err, data, field) => {
    console.log('查询结果：', data)
})
// 为避免出现异常监听错误
connection.on('error', (err) => {
    console.log('999', err)
})
```

## 创建连接池

``` js
// 导入数据库
const mysql = require('mysql2');
// 这里不是创建连接了，而是创建一个连接池（类似于线程池与线程的关系）
// 这里我们设置最多在池子里放入10个连接
const connectionPool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'ted_mysql_demo',
    user: 'root',
    password: '',
    connectionLimit: 10
})
// 预处理语句，其实我们可以理解为：一个sql语句执行模板
// 通过先定义个核心模板，再给想要查询不同数据传递不同值，即可实现sql语句一次编译、多次执行的操作
const statement = `
    SELECT * FROM account WHERE id > ? AND id < ?;
`
// 连接池也可通过execute执行语句，如果有就直接从连接池中取出可用连接，如果没有则创建
connectionPool.execute(statement, [2, 15], (err, data, field) => {
    console.log('查询结果：', data)
})
// 为避免出现异常监听错误
connectionPool.on('error', (err) => {
    console.log('999', err)
})
```

### promise方式

``` js
// 注意，mysql2支持通过Promise、async等非回调方式获取结果；只需要加上 .promise()即可
// 但是，promise接收到的参数是之前回调方式接受到的两个参数数组，data,field，因此我们需要通过数组解构的方式获取
// err自然是由promise.catch获取了

connectionPool.promise().execute(statement, [2, 15])
    .then(([data, field]) => console.log('查询结果：', data))
    .catch(err => console.log(err))
```

需要注意，不仅限于 连接池，之前连接的方式照样支持 `.promise()` 获取 `promise` 对象的。

## `Sequelize` ORM库

### 基本使用

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201227181342.png)

1. 安装：`npm install sequelize`
2. 查询操作：

``` js
const {
    Sequelize,
    Model,
    DataTypes,
    Op
} = require('sequelize');
// 创建Sequelize对象，接受四个参数：数据库名、用户名、密码、其他配置（Port默认就是3306其实是可不指定的）
// dialect标识是什么数据库
const seq = new Sequelize('ted_mysql_demo', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})
// 测试是否链接成功
// seq.authenticate().then(()=>console.log('链接成功'))
//     .catch(err=>console.log('链接失败：',err))

// 定义与数据表相关联的映射对象

// 先定义个对象继承一下
class Account extends Model {};

// 将其格式与数据表格式定义相同
Account.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    telPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createTime: {
        type: DataTypes.DATE
    },
    updateTime: DataTypes.DATE
}, {
    // 指定印射的表名
    tableName: 'account',
    // 关闭默认查询的这两个字段
    createdAt: false,
    updatedAt: false,
    // 需要这个，不然没法印射
    sequelize: seq
});

// 查询所有数据
// Account.findAll().then(data => {
//     console.log('查询结果：',data);
//     console.log('----------------------------------------------------');
// })
//     .catch(err=>console.log('查询失败：',err));

// 查询所有id大于15的数据
async function getIDGte15() {
    const result = await Account.findAll({
        [Op.gte]: 15
    });
    // console.log('查询id大于15的数据：',result);
    return result;
};
// 注意：async虽然里面result能打印出来，但是如果你直接以为return 返回的数据能接收到，那你就错了
// async装饰的函数执行返回的其实是个promise对象
// 因此下面这种方法是不可行的，只会得到以下结果：
// console.log(getIDGte15());

// 想通过return获取数据而不是直接在函数里面打印，我们可以这样做：
// 1. 用promise.then方法

// getIDGte15().then(result=>console.log('查询id大于15的数据：',result));

// 2. 再包装一个函数来解析返回的promise对象：

async function parseResult() {
    console.log('解析：', await getIDGte15());
}
parseResult();

// 查询单个数据
Account.findOne({
    where: {
        id: 2
    }
}).then(data => {
    console.log('查询成功：', data)
}).catch(err => console.log('查询错误：', err));
```

3. 插入操作：

``` js
// 插入一个新数据 - 增
Account.create({
    name: 'orm',
    age: 16,
    telPhone: '19966668888'
}).then(data => {
    console.log('插入成功：', data)
}).catch(err => console.log('插入错误：', err));
```

4. 更新操作：

``` js
// 更新操作 - 修改

// 这里我们将id=2的数据的name更改为 xxx
Account.update({
    name: '爱神的箭盎司的'
}, {
    where: {
        id: 2
    }
}).then(data => {
    console.log('更新成功：', data)
}).catch(err => console.log('更新错误：', err));
```

5. 删除操作：

``` js
// 删除某条数据
Account.destroy({
    where: {
        id: 2
    }
}).then(data => {
    console.log('删除成功：', data)
}).catch(err => console.log('删除错误：', err));

// 注意，.drop为删除整张表，别用错了。。。
```

### 多表查询（一对一查询）

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201228204421.png)

``` js
const {
    Sequelize,
    Model,
    DataTypes,
    Op
} = require('sequelize');
const seq = new Sequelize('ted_mysql_demo', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})
// 先定义主表
class TelPhoneInfo extends Model {};
// 主表不在子表之前初始化，子表先初始化会报错
TelPhoneInfo.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    other: DataTypes.STRING
}, {
    tableName: 'telphoneinfo',
    createdAt: false,
    updatedAt: false,
    sequelize: seq
})

// 定义子表
class Account extends Model {};

// 将其格式与数据表格式定义相同
Account.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    telPhone: {
        type: DataTypes.STRING,
        allowNull: true,
        // 建立表字段的外键关系
        references: {
            // 当前account数据表的telPhone字段关联的是主表telphoneinfo的id字段
            model: TelPhoneInfo,
            // 外键用于与另一张表的关联。是能确定另一张表记录的字段，用于保持数据的一致性。
            // 比如，A表中的一个字段，是B表的主键，那他就可以是A表的外键。
            // 因此，我们这里telphoneinfo的id必须是主键，不然它是不能作为account子表的外键的！
            key: 'id'
        }
    },
    createTime: {
        // 如果数据表内的字段是类似`create_time`之类在Js不规范的格式，则可以通过field标识类属性对应哪个数据表字段
        field: 'createTime',
        type: DataTypes.DATE
    },
    updateTime: DataTypes.DATE
}, {
    // 指定印射的表名
    tableName: 'account',
    // 关闭默认查询的这两个字段
    createdAt: false,
    updatedAt: false,
    // 需要这个，不然没法印射
    sequelize: seq
});

// 表关联！上面只是定义了account的哪个字段是外键，我们还需要定义下 父子表之间的关联关系

// Account作为子表，属于TelPhoneInfo父表
// 其telPhone是外键
Account.belongsTo(TelPhoneInfo, {
    foreignKey: 'telPhone'
})

// 多表查询
Account.findAll({
        include: TelPhoneInfo
    }).then(data => console.log('查询：', data))
    .catch(err => console.log('查询失败：', err))
```

### 多表查询（多对多映射关系）

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201228221437.png)

``` js
const {
    Sequelize,
    Model,
    DataTypes,
    Op
} = require('sequelize');
const seq = new Sequelize('ted_mysql_demo', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

class Student extends Model {};
Student.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING
}, {
    tableName: 'students',
    createdAt: false,
    updatedAt: false,
    sequelize: seq
})

class Course extends Model {};
Course.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    descInfo: {
        field: 'desc_info',
        type: DataTypes.STRING
    }
}, {
    // 指定印射的表名
    tableName: 'courses',
    // 关闭默认查询的这两个字段
    createdAt: false,
    updatedAt: false,
    // 需要这个，不然没法印射
    sequelize: seq
});

// 多对多关联表 - 重点

// 选课关联表 - 记录了学生与课程的相互关系
class StudentRelativeCourse extends Model {};
StudentRelativeCourse.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 外键1：学生Id
    studentId: {
        field: 'student_id',
        type: DataTypes.INTEGER,
        references: {
            model: Student,
            key: 'id'
        }
    },
    // 外键2：课程Id
    courseId: {
        field: 'course_id',
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: 'id'
        }
    }
}, {
    // 指定印射的表名
    tableName: 'select_related',
    // 关闭默认查询的这两个字段
    createdAt: false,
    updatedAt: false,
    // 需要这个，不然没法印射
    sequelize: seq
})

// 多对多数据表关联
Student.belongsToMany(Course, {
    through: StudentRelativeCourse,
    foreignKey: 'studentId',
    otherKey: 'courseId'
})
Course.belongsToMany(Student, {
    through: StudentRelativeCourse,
    foreignKey: 'courseId',
    otherKey: 'studentId'
})
// 多表查询
Student.findAll({
        include: Course
    }).then(data => console.log('查询：', data))
    .catch(err => console.log('查询失败：', err))
```
