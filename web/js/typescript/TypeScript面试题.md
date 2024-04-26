# Typescript知识点
## 基础
> [TypeScript高频面试题及解析](https://juejin.cn/post/7321542773076082699?searchId=20240424091637FAD9E143BB1F00650878#heading-2)

### TypeScript有哪些数据类型？

答案：

1. 任意类型 (any)：声明为any的变量可以赋予任意类型的值。这种类型常用于变量的值会动态改变的情况，比如来自用户的输入。使用any类型时，变量会跳过编译阶段的类型检查。
2. 数字类型 (number)：双精度64位浮点值，用于表示整数和分数。可以用二进制、八进制、十进制、十六进制表示。
3. 字符串类型 (string)：表示一个字符系列，可以使用单引号（'）或双引号（"）来表示字符串。还可以使用反引号（`）来定义多行文本和内嵌表达式。
4. 布尔类型 (boolean)：表示逻辑值，只有true和false两个值。
5. 数组类型：可以声明变量为数组，使用元素类型后面加上[]，或者使用数组泛型。
```ts
let arr: number[] = [1, 2]; // 使用[]
let arr: Array<number> = [1, 2]; // 使用数组泛型
```
6. 元组类型：用来表示已知元素数量和类型的数组，各元素的类型不必相同，但对应位置的类型需要相同。
```ts
let x: [string, number];
x = ['Runoob', 1]; // 正常
x = [1, 'Runoob']; // 报错
console.log(x[0]); // 输出 Runoob
```
7. 枚举类型 (enum)：用于定义数值集合，它们可以增加代码的可读性，并提供一种便捷的方式来使用一组有意义的常量。例如颜色、性别的枚举。
```ts
enum Color { Red, Green, Blue };
let c: Color = Color.Blue;
console.log(c); // 输出 2
```
8. void类型：用于标识方法返回值的类型，表示该方法没有返回值。
```ts
function hello(): void {
    alert("Hello Runoob");
}
```
9. null和undefined：null和undefined是所有类型的子类型，可以赋值给任意类型。如果启用严格的空校验（--strictNullChecks）特性后，null和undefined只能被赋值给void或本身对应的类型。
```ts
let x: number | null | undefined;
x = 1; // 编译正确
x = undefined; // 编译正确
x = null; // 编译正确
```
10. never类型：是其他类型（包括null和undefined）的子类型，代表从不会出现的值。
```ts
let x: never;
let y: number; // 编译错误，数字类型不能转为never类型
x = 123; // 运行正确，never类型可以赋值给never类型
x = (() => { throw new Error('exception') })(); // 运行正确，never类型可以赋值给数字类型
y = (() => { throw new Error('exception') })(); // 返回值为never的函数可以是抛出异常的
```

### 类型声明和类型推断的区别
 类型声明是显式地为变量或函数指定类型，而类型推断是TypeScript根据赋值语句右侧的值自动推断变量的类型。
```ts
// 类型声明
let x: number;
x = 10;
// 类型推断
let y = 20; // TypeScript会自动推断y的类型为number
```

### type 和 interface 的区别

在 TypeScript 中，interface 和 type 都可以用来描述对象或函数的类型。

1. 扩展性：interface 可以通过名称相同的方式进行扩展，而 type 则不能。这意味着你可以创建一个新的 interface，并使用相同的名称，TypeScript 会将这两个 interface 合并为一个。这对于定义像 React.ComponentProps 这样的全局状态非常有用。
```ts
interface User {
    name: string
}

interface User {
    age: number
}

// User 现在有了 name 和 age 属性
```
2. 使用 type 可以表示更复杂的类型：除了可以表示对象和函数的类型，type 还可以表示基本类型（如 string，number），元组，联合类型，交叉类型等。
```ts
type StringOrNumber = string | number;
```

3. 在声明类和接口时，interface 更常用：当你想要定义一个类或者一个接口的时候，通常会使用 interface。

4. type 只是一个类型别名，并不会真的产生类型，它给一个已经存在的类型起了一个新的名字，但并没有创建一个新的类型。而 interface 则可以被视为一个新的类型，因为你可以使用 interface 创建一个具有特定属性和方法的新对象类型。
### 实现一个 Typescript 里的 Pick
> type Pick<T, K extends keyof T> = { [P in K]: T[P] }

