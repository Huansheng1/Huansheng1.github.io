# Cookie、localStorage、sessionsStorage的区别与封装
## 区别

## 方法


## 封装
```js
//遍历本地存储localStorage
for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i); //通过序号来获取本地存储的Key属性名
    console.log(localStorage.getItem(key));//所有value
}
```

## 参考资料
* [封装 localstorage 的作用是什么? ](https://learnku.com/vuejs/t/23718)
* [Storage工具类的封装](https://blog.csdn.net/weixin_41900457/article/details/102859931)
* [html5中获取localStorage全部数据](https://www.codehui.net/info/46.html)