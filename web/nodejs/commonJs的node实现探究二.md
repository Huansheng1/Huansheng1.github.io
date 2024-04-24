# NodeJs里的CommonJs规范实现
## module
之前我们大致提到过`NodeJs`里的`CommonJs`规范：它每个文件都是一个`module`模块，因此，在每个`Js`文件中是可以打印出`module`实例的：
```js
console.log(module);

// 打印结果：
// Module {
//   id: '.',
//   path: 'C:\\Users\\Administrator\\Desktop\\web\\code\\node-demo',
//   exports: {},
//   parent: null,
//   filename: 'C:\\Users\\Administrator\\Desktop\\web\\code\\node-demo\\index.js',
//   loaded: false,
//   children: [],
//   paths: [
//     'C:\\Users\\Administrator\\Desktop\\web\\code\\node-demo\\node_modules',
//     'C:\\Users\\Administrator\\Desktop\\web\\code\\node_modules',
//     'C:\\Users\\Administrator\\Desktop\\web\\node_modules',
//     'C:\\Users\\Administrator\\Desktop\\node_modules',
//     'C:\\Users\\Administrator\\node_modules',
//     'C:\\Users\\node_modules',
//     'C:\\node_modules'
//   ]
// }
```
从上我们可用看出`module`实例的几点：
1. `id`表示`module`是当前运行文件的自身，如果打印的`module`不是当前文件，那么会是那个文件的绝对路径
2. `exports`就是我们模块化导入导出的对象
3. `parent`代表打印`module`实例的`js`模块有没有被其他模块引入 - `require`，如果有，则会显示其父模块，`children`代表的是是否引入其他模块 - 这就构成了父子关系
4. `paths`代表如果导入模块既不是核心模块，又不是文件路径，在哪几个地方查找是否存在模块。

## 模块加载机制
### 查找方式
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121132443.png)
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121132514.png)
### 加载顺序
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121120356.png)
注意：`node`里的`commonJs`加载规范是`同步的`，这意味如果你`require`导入模块，会先执行模块里的代码，才继续执行当前文件下面的代码。
### 加载方式区别
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121130949.png)
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121131011.png)
### 导出区别
`Es6 Module`模块依赖关系是在编译时就确定的：

`Es6 Module`导出的是值引用，而不是当前值，因此即使导出的是个变量，如果模块内部的基本属性变量值发生变化，其他地方导入该模块获取到的值也会发生变化（有个地方会动态绑定值的）：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121131440.png)

而且需要注意，导入模块的地方是无法修改模块内部导出的东西的，因为导出的变量是个常量，无法在外部进行修改，但是如果导出的是个对象，我们还是可以利用引用地址修改其内部属性的！
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121132230.png)

`CommonJs`在`Node`里的实现我们之前提到过，导出的只是个对象，因此还是很不一样的。
## CommonJs缺点
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121122217.png)
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201121123055.png)

## 互相导入
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201122000119.png)