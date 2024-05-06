# typescript学习之路
> [官网](https://www.typescriptlang.org/zh/)

## 诞生意义
### 为什么需要类型？
> 类型的好处：

1. 通过指定变量类型，避免传入错误变量值

2. 通过声明函数接收/返回的数据类型，可有效避免传入错误参数/对返回数据类型错误理解的出现。
![](https://user-gold-cdn.xitu.io/2019/2/27/1692d91ce2d5a7bb?imageslim '图来自：https://juejin.im/post/6844903783869349902#heading-2')
> 总结：引入 类型 这一概念，具有以下优点：提前检测类型错误；调用函数时清楚知道各参数类型与返回值类型；接口等规范提供更好的开发体验。

## 安装typescript
1. `npm` 安装 `TypeScript`：
```bash
npm install -g typescript
# 查看版本
tsc --version
```
2. 运行 `TypeScript` 编译器：
```bash
npx tsc
```
成功结果：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo-img/20200820114551.png)

3. 新建一个`.ts`文件
```bash
touch demo.ts
```
4. 编译`.ts`文件为`.js`文件：
```bash
tsc demo.ts
```

> 也可以通过 `ts-node`这个库来直接运行 `ts`文件
## 开始学习
> [官方手册](https://www.typescriptlang.org/docs/handbook/basic-types.html)
### 与JavaScript的区别
1. 增加类型约束
2. 增加更多类型：枚举、元组等
### 声明方式
#### 变量的定义
格式：
```ts
const/let/var 变量名:变量类型 = 变量值;
```
其中，`:变量类型`的方式叫做 `类型注解`；注：如果不写类型注解的话，`ts`也是会根据值进行`类型推导`自动推断当前变量的值的！
##### 类型推导的注意事项
1. `let`声明的变量，自动推导出来的类型是 `通用类型`，如：`string`、`number`、`boolean`等；
```ts
let age = 18;
// age:number
```
1. `const`声明的变量，自动推导出来的类型是 `字面量类型`
```ts
let level = 25;
// level:25
```
#### 类成员声明
1. `public`：默认声明，所有文件都可获取使用该属性
2. `protected`：只有当前类和其子类可访问该属性
3. `private`：只有当前类可访问该属性
### 变量类型指定
变量可自己手动设置类型`: string` 也可根据 变量值 自动设置 类型，因此 变量类型一旦确定，不可赋予 新类型的值；但是，`: unknown` 表示 我们手动指定 一个不确定的值！
```typescript
let aNumber: number = 1; // 等价于 let aNumber = 1;
aNumber = false; // 报错，类型必须为数字

// 设置未知类型
let notSure: unknown = 4;
notSure = "maybe a string instead";
console.log(notSure)
notSure = false;
console.log(notSure)
```
#### unknown
为啥在有`any`的时候还需要引入`unknown`呢？

原因在于 虽然两者都是表达不确定，但`any`是什么都能干，不限制，而`unknown`是什么都不能干，都被限制，两者在后续操作上是相反的！
```ts
let anyVar:any = 111;
anyVar = 'test';
// any类型，正常执行！
```
```ts
let unknownVar:unknown = 111;
unknownVar = 'test'; // 报错！
if(typeof unknownVar === 'string'){
    unknownVar = 'test';// 不报错，unknown类型需要 确定类型/类型缩小，才能进行赋值操作
}
// 因此，对于unknown类型可以在赋值的时候限制，避免传入个非法的类型
// 而any类型就太过灵活，会导致使用和赋值没有任何影响，失去了ts的特性
```

注意事项：
* `TypeScript`在编译时会对代码进行静态的分析 - 分析代码结构和提供的类型注解

* 即使代码出现错误，依旧会编译为`.js`文件，但是，它会警告提示代码运行结果无法保证。


#### 常见类型一览表：

|类型|语法|代码示例|注意事项|
|:--|:-:|:-:|:-:|
|布尔|`: boolean`|`let flag: boolean = false`||
|空对象|`: null`|`let emptyObj: null = null`||
|未定义|`: undefined`|`let emptyValue: undefined = undefined`||
|数字|`: number`|`let numberValue: number = 1`|[除了浮点数以外，Infinity、-Infinity、NaN，它们也属于 number 类型](https://juejin.im/post/6844903791372845063)|
|字符串|`: string`|`let stringValue: string = 'hello typescript'`|支持模板字符串写法`${value}`|
|符号|`: symbol`|`let symbolValue: symbol = Symbol('测试')`|打印的话得`console.log(symbolValue.toString())`|
|大数字|`: bigint`|`let bigintValue: bigint = 122n`|如果需要该类型，编译`Target`必须改为`ES2020`方才支持|


> 注意事项：
* 默认情况下，`undefined` 和 `null` 是所有其他类型的子类型。也就是说，如果 `undefined` 和 `null` 赋值给任何其他类型的变量。
```ts
// 如果在 tsconfig 中开启了 strictNullChecks，那么 undefined 和 null 就只能赋值给 void 或 any 类型变量以及它们自身类型的变量。强烈建议开启这一选项，它能帮助避免很多常见的问题。
let person: string = 'Jerry'
person = null // 有效的
```
### 高级类型
> `javascript`里没有的数据类型

1. `void`：函数没有返回值，即返回值为`undefined`
```ts
// 函数没有返回值（返回值为undefined）时使用
function warning(): void {
    console.log('WARNING!')
}
```
注意：
* 变量也可使用`void`来表示`undefined`类型，但是没必要
* [`JavaScript` 的 `void` 运算符的作用是：对给定的表达式进行求值，然后返回 `undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/void)。

2. `any`：任意类型
```ts
let value:any = 1
value = 'aaa'
console.log(value)
```
注意：
* `TypeScript`会根据变量初始化时的值类型推断变量类型
* 变量声明时不指定类型，也不进行初始化就等于`:any`
```ts
let value
value = 'aaa'
value = 2
console.log(value)
```
* 滥用`any`类型的话，`ts`就失去了其意义

3. `never`：不存在返回值
> `never` 用于表示永远不会存在的值的类型。`never` 是任何类型的子类型，但没有类型是 `never` 的子类型。
```ts
// 第一种情况
function neverStop(): never {
    while (true) {
        // do something
    }
}

// 第二种情况
function error(message: string): never {
    throw new Error(message)
}
```
[`never` 类型常用于两种情况](https://juejin.im/post/6844903791372845063#heading-8)：

* 用于描述从不会有返回值的函数
* 用于描述总是抛出错误的函数

如何理解 `never` 是任何类型的子类型？
```js
function checkNumber(x: string | number): boolean {
    if (typeof x === 'number') {
        return true
    } else if (typeof x === 'string') {
        return false
    }
    
    return fail('Failure')
}

function fail(message: string): never {
    throw new Error(message)
}
```
从上可以看出，如果`never`不是`boolean`的子集，那么，`checkNumber`编译时是会提示报错的。

<!-- 看起来是不是不太明白`never`的使用场景？

官方示例其实举了一种应用场景：
```ts

``` -->
### 函数注解
`类型注解`：在方法形参可如此指定类型 - - > `function testFunc(name: string){}`
### 数组类型

```ts
// 使用`类型` + `[]`来表示，推荐这种写法，兼容性最好
const arr: number[] = [1,2,3]
const arr2: string[] = ['1','2']

// 泛型定义方式（不推荐，因为在JSX语法中会和标签冲突，因此上面那种写法兼容性最好）
const arr2: Array<number> = [1,2,3,3]
const arr2: Array<string> = [1,2,3,3]

// 接口定义数组（当然，会增加理解成本，也不太推荐）
interface NumArr {
    // 定义了该类型是一个对象，key和value都是number，且数量不确定 -> 这形容的不就是js里的数组么，因为js的数组其实可以看作为 属性名和属性值都是number的对象
    [index: number]: number;
}
let numArr: NumArr = [1,2,3];

// 元组类型声明
// 注意：这是一个确定数组长度和类型的写法
const arr:[string,number] = ['2',3]
// 此处限制了数组只有两个元素，且类型分别为字符串和数字

// 伪数组
// 官方已提供各自的定义接口 Arguments, NodeList, HTMLCollection
// 注意：值只能说参数列表数据，因此 IArguments 只能放在函数里才能得到参数列表值
function sum() {
    let args: IArguments = arguments;
}
```
### 元组类型
`ts`里，数组一般是同一类型的集合，但考虑到部分场景，确实需要用数组存储多个不同类型的数据的话，会引入一个 `元组`类型：
```ts
const tuple1:[string,number,boolean] = ['元组demo',3,false];
```
一般用于函数的返回值里
### 枚举类型
> js中没有这类型，仿照强类型语言来的。值只能为数字，不定义默认值从0开始。
```ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
// c = 1

enum Number {one = 10, two}
let c: Number = Number.two;
// c = 11
```
> [该处原文](https://juejin.im/post/6844903822981070855)
### 函数类型
```ts
function demo(): () => string {
    return 'hello world!'
}
```
当然，一般是在定义 callback 参数函数时使用，而且一般使用 type 定义后再使用
### 对象类型
```ts
let obj: object = {name:'foo'};
console.log(obj)
```
还有个小诀窍哦，万一人家传入一个`null`空对象咋办？

```ts
这样可以接受 对象类型 和 Nul类型
let obj: object | null = null;
console.log(obj)
```
<!-- 但是，这样声明其实是有问题的，因为我们指定了类型是object，导致其编译器不会自动推导了，通用默认的object是没有name属性的，如果你在下面打印name就会报错 -->
```ts
const teacher:object = {
    name:'玲儿',
    age:18
};
// 类型“object”上不存在属性“name”。
console.log(teacher.name);
```
因此，更推荐：
1. 不直接写类型注释，让其自动推导，如果要用到的属性都在赋予的值里体现了，则是个简单的办法：
```ts
const teacher = {
    name:'玲儿',
    age:18
};
// 自动推导不会报错
console.log(teacher.name);
```
2. 自定义对象类型有哪几个属性，就在类型注解的时候写明属性与属性值，如果多个地方使用则可以使用接口定义，不过这个就得利用下面的，请看下面的知识点：
```ts
const teacher:{
    name:string,
    age:number
} = {
    name:'玲儿',
    age:18
};
// 写明了不会报错
console.log(teacher.name);
```
如果对象的属性值是不固定的，则需要这样写：
```ts
// 比如，某个商品的属性数量是不固定的
const product:{
    // 他的属性名和属性值是开放的，但是这种的话，一般不建议这样做，可用数组代替，实在不行才这样做，把ts的优势又丢失了不少，快等于any了
    // 不固定的属性名，多种类型的属性值
    [propertyName:string]:string | number | boolean
} = {
    name:'苹果手机',
    price:8888,
    shuxing1:'666',
    shuxing2:'999',
    shuxing3:'奥术大师'
}
```
#### type类型别名 定义一个对象
```ts
type Teacher = {
    name: string,
    age: number
}
```
### 接口interface
接口 用于定义指定的对象类型，也可称之为 对对象的描述。
```ts
interface Person{
    name: string,
    age: number
}
let obj: Person | null = {
    name: '张三',
    age: 18
};
console.log(obj)
console.log(obj.name)
```
当然，也许你会说，为啥需要接口定义对对象的描述呢？

我来举个例子：
```ts
function printf(obj:object): void{
    // Property 'name' does not exist on type 'object'.
    console.log(obj.name)
}
printf({name: '李四'})
```
如果没有接口定义一个类型进行描述的话，函数内是无法得知我们传入的对象是否拥有该属性的，这将导致 编译时报错。

使用接口声明时则就无此烦恼：
```ts
function printf(obj:Person): void{
    console.log(obj.name)
}
```
此外，接口还有其他更多功能：

1. 可选属性`?`：
```ts
interface Person{
    name: string,
    age?: number
}
// age属性就不是必须属性了
printf({name: '李四'})
```
2. 任意属性`[propName: string]: any;`：
```ts
// 任意属性使得我们接口定义更加灵活
interface Person{
    name: string,
    age?: number,
    [propName: string]: any;
}
// 注意哦，任意属性 也是 非必填的，可不传入
let obj: Person | null = {
    name: '张三',
    like: '萌妹子'
};
console.log(obj)
console.log(obj.like)
```
但是，真的这么自由么？
其实是有代价的，**一旦定义了 任意属性，那么，其他 指定属性的类型 也必须和自由属性相同！**

```ts
interface Person{
    name: string,
    // Property 'age' of type 'number | undefined' is not assignable to string index type 'string'.
    age?: number,// 此处会报错！由于任意属性的值设为字符串，其他属性因此必须和他类型一致了。
    [propName: string]: string;
}
let obj: Person | null = {
    name: '张三',
    test: '测试'
};
console.log(obj)
```
也许你会问，为什么之前的也有 `age`属性，其值设置的是`number`却没有报错呢？

亲，仔细看哦，我们上面 任意属性 设置的是`any`类型，当然不会报错啦！

3. 只读属性`readonly`：
```ts
interface Person{
    name: string,
    readonly age?: number,
}
let obj: Person | null = {
    name: '张三',
    age: 18
};
console.log(obj)
console.log(obj.age)
// Cannot assign to 'age' because it is a read-only property.
obj.age = 20
```
该设置的用处是：对象属性在第一次初始化后无法赋值修改了（`const`常量，该描述符则是指定 属性常量）
> 数组设置只读：`ReadonlyArray`，该数组就不可以修改
```ts
let arr: number[] = [1, 2, 3, 4];
let constArr: ReadonlyArray<number> = [1,2,3];
arr[0] = 10 // success
constArr[0] = 12; // error!
arr = constArr; // 注意！ 将readonly的值赋值给一个可变得数组也是不行的。
```
#### 接口interface 和 类型别名type的区别
1. 类型别名使用范围更广，而接口仅支持声明对象
```ts
type CustomerId = string;
type IdType = string | number;

interface Person{
}
```
2. 接口支持多次被重复声明、扩展，而类型别名不支持
```ts
type PositionType = {
    x: number;
    y: number;
}
// 标识符“PositionType”重复。ts(2300)
// type PositionType = {
//     z?: number;
// }
```
```ts
interface PositionType {
    x: number;
    y: number;
}
interface PositionType {
    z?: number;
}

const position: PositionType = { x: 1, y: 2 };
position.z = 3;
```
3. 接口支持继承，而类型别名不支持
```ts
interface PositionType {
    x: number;
    y: number;
}
// 使用 extends 关键字 继承另一个接口
interface Position3DType extends PositionType {
    z?: number;
}

const position: Position3DType = { x: 1, y: 2 };
position.z = 3;
```
4. 接口支持被 `class`实现，而类型别名不支持
```ts
interface PositionType {
    x: number;
    y: number;
}
// 使用 implements 关键字 使用类实现一个接口
class Position3DType implements PositionType {
    x: number;
    y: number;
    z?: number;
    constructor(x: number, y: number, z?: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const position = new Position3DType(1, 3, 4);
position.z = 3;
```

综上所述：定义对象类型一般使用 `interface`，定义非对象类型一般使用 `type`
#### 接口支持对 函数使用的：

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200830112942.png)

![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200830113010.png)

### 类型断言
> 待续

## 参考资料
除官网外，还参考了：
* [TypeScript (基础)](https://juejin.im/post/6844903822981070855#heading-17)
* [TypeScript 入门系列](https://juejin.im/post/6844903930497859592)
* [TypeScript 入门系列](https://juejin.im/post/6844903929172459534)
* [TypeScript 基础](https://juejin.im/post/6844904128989102087)

> 放心，本文所诉，皆敲过代码验证过