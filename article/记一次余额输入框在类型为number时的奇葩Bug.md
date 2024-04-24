# 类型为Number的余额输入框的Bug与解决方法

## 场景

由于在一个项目引入了 `余额` 的设计，因此我需要实现一个类似于 `阿里云` 支付系统里的 `余额输入框` 功能，大概长这样：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201211173012.png)

看起来很简单对吧？

功能不就这些：

1. 输入框内输入的余额必须是数字，且行业惯例最多两位小数（基本大厂产品都是这样，如果太长的话在`JavaScript`精读丢失的问题比较难解决，且一般生活中一分钱为最小非常合理）。
2. 输入框最大输入金额在账户可用余额范围内，且不能大于订单金额
3. 当输入余额大于当前帐号可用余额后自动变为当前帐号可用的最大余额（取决于订单金额与账户余额谁更小）

## 问题出现

结果，当我初步实现，在删除几个数字只保留一个数字的时候敲击小数点就没反应了，当前代码：

``` html
                    <input name="chargedCurrency" class="form-control col-xl-3 chargedCurrency" type="number" [(ngModel)]="deductedBalanceAmount" (input)="inputDeductedBalance(deductedBalanceInput.value)" #deductedBalanceInput />
```

昨天理了很久没搞明白为啥会导致这个Bug。。。于是我打开阿里云看了下，发现竟然也有这个问题。。，截图：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20201211184831.gif)

最后我去经过大佬指点，人家告诉我这是 `number` 输入框的坑， `type=number` 时的 `input` 输入框的 `input` 事件是监听不到小数点这个键盘输入事件的。

因此，为了避免这个问题，我们不能选择 `number` 类型的 `input` 框，那么， `text` 看起来是唯一的选择？不，如果不需要 `+` 、 `-` 的话，我们完全可以使用 `tel` 类型的输入框来代替，这样既能在手机上弹出 `数字输入` 也避免了 `电脑浏览器的小数点BUG` ；

因此，我们只需要解决 `将输入内容里的非数字和.的字符替换处理` 即可！

注意，该 `BUG` 只在比较新版本的PC浏览器出现，手机上没问题，触发的原因应是在特定情况下，中文的 `。` 他不会识别为小数点进行替换为 `.` ，但删掉重新输入，依旧是中文输入法下的 `。` 他却能正确识别为 `.` 小数点！

> 网上类似问题：[(...) 关于input[type=number]无法获取小数点的问题！！！！](https://segmentfault.com/q/1010000006095798)

## 解决方法

1. 将`html`里的`input`输入框改为`tel`类型：

``` html
                    <input name="chargedCurrency" id="chargedCurrency" class="form-control col-xl-3 chargedCurrency" type="tel" [value]="deductedBalance?deductedBalanceAmount:''" (input)="inputDeductedBalance(deductedBalanceInput.value)" #deductedBalanceInput />
```

2. 对输入内容进行筛选处理，为方便复用，将其封装为单独的公用方法：

``` ts
export function priceFormat(price: string) {
    // 先将中文环境下。替换为.
    price = price.replace(/[。]/g, ".")
    //非数字和小数点去掉
    price = price.replace(/[^\d.]/g, "")
    //防止无输入无限个“.”
    price = price.replace(/\.+/, ".")
    //在不是“0.”开头的字符进行修改：“01”=>1
    if (price.charAt(0) == "0" && price.charAt(1) != "." && price.length >= 2) {
        price = price.replace(/0/, "")
    }
    //获取第一个小数点的索引值
    let index = price.indexOf('.')
    //获取最后一个小数点的索引值
    const lastIndex = price.lastIndexOf('.')
    //判断小数点是不是开头，如果是开头，则在前面追加0
    if (index === 0) {
        price = '0' + price;
    }
    //防止小数点后面又出现小数点
    if (index != lastIndex) {
        price = price.substring(0, index + 2)
    }
    // 再次获取当前小数点索引
    index = price.indexOf('.');
    // 判断小数点后有多少位
    const floatPointLength = price.length - index - 1;
    // 如果浮点数超过两位就只取两位四舍五入
    if (floatPointLength > 2) price = Number(price).toFixed(2);
    return price;
}
```

3. 导入公用的方法，再对输入框内容处理继续完善：

``` ts
// 参考阿里云收银台对可使用的余额进行处理
    inputDeductedBalance(currentValue: string) {
        // 对输入的价格字符串进行替换处理
        currentValue = priceFormat(currentValue);
        const chargedAmount = this.consultingOrderData.chargedAmount;
        // 判断最大可抵扣余额的数量：如果可用余额大于订单余额则最大可抵扣余额为订单余额
        const maxDeductedBalanceForOrder = this.accountBalance > chargedAmount ? chargedAmount : this.accountBalance;
        // 如果输入余额大于可用余额,则自动使用最大可抵扣余额
        if (Number(currentValue) > maxDeductedBalanceForOrder) {
            this.deductedBalanceInput.nativeElement.value = maxDeductedBalanceForOrder.toString();
            this.deductedBalanceAmount = maxDeductedBalanceForOrder;
        } else {
            this.deductedBalanceInput.nativeElement.value = currentValue;
            this.deductedBalanceAmount = Number(currentValue);
        }
    }
```

## 参考文章

* [js限制input只能输入有效的数字](https://www.jb51.net/article/148177.htm)
* [input输入框只能输入正数和小数(保留小数点后两位)](https://www.cnblogs.com/xy0710/p/11840066.html)
* [js限制input只能输入有效的数字](https://www.jb51.net/article/148177.htm)
* [H5 中数字 input 的处理](https://juejin.cn/post/6844903862118121485)
