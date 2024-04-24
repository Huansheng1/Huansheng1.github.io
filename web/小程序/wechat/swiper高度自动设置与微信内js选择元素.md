# swiper高度自动检测

## 前因

小程序内，swiper的高度需要你手动指定的，但对于如果我们在swiper内的内容是通过下拉加载等方式实时加载，那我们不好一直指定一个固定的高度，这时候我们就需要搭配js选择dom来动态获取swiper内部元素的高度。

## 解决

`swiper` 设置垂直滚动，高度动态绑定变量：

```html
<swiper current="{{currentTab}}" scroll-y="{{true}}" class="swiper-box" bindchange="bindChange" style="height:{{scrollViewHeight}}rpx;">
    <view class="content-class"></view>
</swiper>
```

```js
onLoad: function(e) {
        //   设置初始的滚动视图高度
        this.setData({
            scrollViewHeight:
                //   获取设备窗口高度，减去上下边距再乘以当前设备的宽度换算inphone6的rpx单位
                (wx.getSystemInfoSync().windowHeight - 108) *
                (750 / wx.getSystemInfoSync().windowWidth),
        });
        this.getPoints();
    },
    //   动态监测swiper高度
    checkSwiperViewHeight() {
        let that = this,
            // 选择class为content-class的元素
            obj = wx.createSelectorQuery().select(".content-class");
        obj
            .boundingClientRect(function(rect) {
                // 动态计算当前列表的高度，rect是选择到的dom元素，rect.height是元素高度
                that.setData({
                    scrollViewHeight: rect.height * (750 / wx.getSystemInfoSync().windowWidth),
                });
            })
            .exec();
    },
```
