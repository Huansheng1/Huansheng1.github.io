# switch基础与理解

## 背景

`switch` 应该基本每个人都知道，作为 编程语言基本都有的一个基础语法：

``` js
const arr = ['lala', 'haha', 'didi'];
arr.forEach(key => {
    switch (key) {
        case 'lala':
            console.log('一：', key);
            break;
        case 'haha':
            console.log('二：', key);
            break;
        case 'didi':
            console.log('三：', key);
            break;
        default:
            console.log('一定执行的东西：', key);
            break;
    }
});
```

一般我们这样用的，不同条件，匹配到后通过 `break` 进行中止。

某一天，我在写代码时有这样一个想法，因为我该部分代码有许多重复的代码，那我能不能这样做？

``` js
const arr = ['lala', 'haha', 'didi'];
arr.forEach(key => {
    switch (key) {
        case 'lala':
            console.log('一：', key);
        case 'haha':
            console.log('二：', key);
        case 'didi':
            console.log('三：', key);
        default:
            console.log('一定执行的东西：', key);
            // 放置我们每个分支都会执行的重复代码
    }
});
```

当时我的想法是：通过 `key` 匹配到对应条件的进行往下执行，由于 `break` 缺失，因此会继续往下走，但由于 `key` 不匹配，因此一直到 `default` 执行重复代码才结束。

但是，结果并不如我想的那样：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210307112539.png)

## 原因

该问题当然暴露了我的基础的缺失， `switch` 多年来的理解一直是错误的，它 不是 `分支、切换` 的概念，它其实是 `开关` 的概念，有一个知乎的回答特别好：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20210307112845.png)

记录一下，引以为戒！
