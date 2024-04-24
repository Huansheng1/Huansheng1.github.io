# 装饰器初识
## 概念
`装饰器`，又称 `注解`，在`TypeScript`支持，`JavaScript`还需时日来发展。
## 简单实战
### 定义一个装饰变量的装饰器
```ts
export function Emoji() {
    // 装饰器需要返回一个函数
    // target指的就是装饰器所处的类，这里我们在AboutComponent内使用了，指的就是它
    // key指的是所处类的属性名，这里我们就是对应装饰器后面的result变量
    return (target: object, key: string) => {
        // 获取变量值
        let value = target[key];
        const getter = () => {
            return value;
        };
        // 对装饰器装饰的变量值进行修饰改造
        const setter = (val: string) => {
            value = `👿${val}👿`;
        };
        // 通过该方法让我们的函数关联到变量的读写
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            configurable: true,
            enumerable: true,
        });
    };
}
```
使用：
```ts
@Emoji() result = '测试';
```
效果：
```html
👿测试👿
```
### 定义一个装饰函数的装饰器
```ts
export function Emoji(message: string) {
    // 装饰器需要返回一个函数
    // target指的就是装饰器所处的类，这里我们在AboutComponent内使用了，指的就是它
    // key指的是所处类的属性名，这里我们就是对应装饰器后面的clickMe方法名
    // descriptor表示的是我们key这个变量对应的属性描述对象
    // {
    //     configurable: true;
    //     enumerable: false;
    //     value: ƒ; clickMe();
    //     writable: true;
    // }
    return (target: object, key: string, descriptor: any) => {
        // 获取变量值
        const func = descriptor.value;
        // 我们也可以选择使用description.value来获取
        // 修改原有的方法
        descriptor.value = function (...args: any) {
            // 该装饰器会让装饰的方法弹出一个对话框，点击确认了才执行其装饰的方法
            const flag = window.confirm(message);
            if (flag) {
                // 通过apply将其指针和参数列表传回去
                return func.apply(this, args);
            } else {
                return null;
            }
        };
        // 将属性描述对象返回
        return descriptor;
    };
}
```
使用：
```ts
@Emoji('测试')
    clickMe(val: string): void {
        console.log('点击了', val);
    }
```
```html
<app-user (click)="clickMe('666')"></app-user>
```
效果：点击`app-user`后先弹出对话框，点击确认了才真正执行`clickMe`方法。

注意：修饰普通变量时是没有`decriptor`描述对象的。