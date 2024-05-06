# 笔试题
## 考察继承
```js
function Ofo() {}

function Bick() {
	this.name = 'mybick'
}

var myBick = new Ofo()

Ofo.prototype = new Bick()

var youbick = new Bick()

console.log(myBick.name)

console.log(youbick.name)
```
## 手写个Promise.all
```js
function myPromiseAll(promises) {
//   1. 要返回个Promise，所以我们需要创建一个Promise
  return new Promise((resolve, reject) => {
    const results = [];
    let completedCount = 0;
    // 2. 遍历promises，依次在then方法里获取结果，并加入到返回数据里，直到全部执行完毕时则resolve
    promises.forEach((promise, index) => {
      promise
        .then((result) => {
          results[index] = result;
          completedCount++;

          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
}
```
> [更多可参考](https://juejin.cn/post/7069805387490263047?searchId=20240429104248A00607F81C1FD174FF77#heading-15)
## 请用Promise.prototype.then实现一个Promise.prototype.catch
> [请看详细描述](./../../js/promise%E7%AE%80%E5%8D%95%E5%85%A5%E9%97%A8.md)

`Promise.prototype.catch(e => e)` 其实就是 `Promise.prototype.then(null, e => e)` 的语法糖。

`catch` 方法等效于 `then(null, onRejected)`

```js
// 明白了吗，所以上面的那个代码完全可以不用catch而是直接将 reject传入到then作为第二个参数即可。
Promise.prototype.myCatch = function (onRejected) {
  return this.then(null, onRejected);
};
```

## 手写一个函数，能够将一个字符串列表的共同前缀提取出来（最长可用的公共前缀），如果不存在则返回 ""
```js
function longestCommonPrefix(strs) {
  if (strs.length === 0) {
    return "";
  }
  
  // 将第一个字符串作为初始的公共前缀
  let prefix = strs[0];
  
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      // 如果当前字符串不以当前公共前缀开头，则将当前公共前缀缩短一位
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === "") {
        return "";
      }
    }
  }
  
  return prefix;
}
```
## 手写一个函数，能够传入 两个 字符串形式数字，并返回他们相乘之后的结果，要求：不能使用 BigInt，也不能直接将传入的数字字符串转为数字，返回的结果也是 字符串形式。
```js
// 使用了经典的竖式乘法算法来计算它们的乘积。首先创建一个长度为 len1 + len2 的数组 result，用于存储乘积的每一位。
// 然后使用两层循环遍历 num1 和 num2 的每一位数字，并将其相乘得到乘积。将乘积与对应位置上已有的结果相加，并处理进位。
// 最后，去除结果数组开头多余的零，并将剩下的数字转换为字符串形式返回。
function multiplyStrings(num1, num2) {
  const len1 = num1.length;
  const len2 = num2.length;
  const result = new Array(len1 + len2).fill(0);

  for (let i = len1 - 1; i >= 0; i--) {
    for (let j = len2 - 1; j >= 0; j--) {
      const product = Number(num1[i]) * Number(num2[j]);
      const sum = result[i + j + 1] + product;

      result[i + j] += Math.floor(sum / 10);
      result[i + j + 1] = sum % 10;
    }
  }

  while (result[0] === 0 && result.length > 1) {
    result.shift();
  }

  return result.join('');
}

// 示例用法
const num1 = '123';
const num2 = '456';
console.log(multiplyStrings(num1, num2)); // 输出: "56088"
```

## [两天时间速通百度...](https://juejin.cn/post/7362756601727074343#heading-14)