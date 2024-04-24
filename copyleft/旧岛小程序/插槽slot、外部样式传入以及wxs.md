# 插槽slot、外部样式传入以及wxs使用
## slot注意事项

这里，我们将标签封装为组件，以方便后续复用与代码维护；

但是，需要注意到一点：在搜索界面的标签 与 书籍详情页标签 的样式是不一致的，搜索页书签是没有数字的；

详情页标签而外需要数字显示：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200811162219.png)

我这里有两种方案：
1. 我们需要传入一对象，通过`wx:if`判断对象是否有`nums`属性来决定是否显示 数字标签
> 但是，这样的话，等于将我们的标签局限化了，本来只需要传入一个字符串即可，现在必须传入 一个对象，且我们还不一定能用到，一点都不优雅。

2. 通过`slot`标签预留一个插槽位，在引入的时候动态决定 是否插入 以及 插入标签

> [组件模板和样式 | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html)

### 正式开始
1. `tag.wxml`骨架代码：
```html
<view class="wrapper tag-class">
  <text class="tag-text">{{tag}}</text>
  <!-- 不写插槽名字时，使用就不需要指定插槽名，也无需配置多插槽属性 -->
  <slot name="after"></slot>
</view>
```
2. `tag.js`进行相应设置：
```js
// components/tag/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持，只要slot有名字就必须开启该选项
  },
  // 允许外部传入样式类
  externalClasses: ['tag-class'],
  properties: {
    tag: {
      type: String
    }
  }
})
```
3. `bookDetail.json`引入组件：
```json
{
  "usingComponents": {
    "tag-cpn":"../../components/tag/index"
  }
}
```
4. `bookDetail.wxml`使用组件：
```html
<block wx:for="{{bookTags}}" wx:key="index">
<!-- 传入外部样式类 -->
	<tag-cpn tag="{{item.content}}" tag-class="extal-tag" class="tag">
  <!-- 指定插槽 -->
		<text class="tag-number" slot="after">+{{item.nums}}</text>
	</tag-cpn>
</block>
```
> 外界传入样式类需要注意：属性冲突问题，传入的样式类虽然在后面，但并不一定能保证完全覆盖组件默认样式，因此建议加上`!important`来提高权重。

## wxs文件编写与引入
1. 在`untils`目录下新建`filter.wxs`文件：
```js
function arrayFilter(tagArray, startIndex = 0, limitNumber) {
  return tagArray.slice(startIndex, limitNumber)
}
function replaceWrap(text){
  // 如果传入为空，则直接返回
  if(!text) return 
  // WXS里 生成 regexp 对象需要使用 getRegExp函数。
  // 第一个参数匹配\\n字符（因为其\为特殊字符，则需要转义符\）；g表示全局匹配
  var regExp = getRegExp('\\\\n','g')
  // 将匹配到的全部替换为\n ，这里不需转义哦;通过对文本进行处理，增加空格
  var txtData = '&nbsp;&nbsp;&nbsp;&nbsp;' + text.replace(regExp,'\n&nbsp;&nbsp;&nbsp;&nbsp;')
  return txtData
}
module.exports = {
  arrayFilter: arrayFilter,
  replaceWrap: replaceWrap
}
```
> 从这里， 我们可以看出 `wxs`文件只支持`ES5`语法，因此导出也得使用`commonJs`形式。

> `wxs`文件 因其 可在 `wxml`里调用，因此非常适合用于 数据筛选与过滤。

> [WXS | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/)
2. 在`wxml`文件使用 `wxs`导出的模块
```html
<!-- 引入wxs模块，并设置名字，不然没法调用 -->
<wxs src="../../utils/filter.wxs" module="filter" />
<!-- 过滤器调用 -->
  <block wx:for="{{filter.arrayFilter(bookTags,0,10)}}" wx:key="index">
<!-- 注意啊，text标签会自动对\n等符号进行正确处理，而view则无法正确识别为换行符；为了识别更多，比如空格，我们加上decode解码属性 -->
	<text class="center-text" decode>{{filter.replaceWrap(bookDetailData.summary)}}</text>
</block>
```

## input控件与值获取
> [input | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/component/input.html)

1. `wxml`核心代码：
```html
<view class="post-view-hd">
  <view class="cancle" bindtap="onCancle">取消</view>
  <view class="confirm" bindtap="onConfirm">提交</view>
</view>
<!-- 自动聚焦属性；设置最大输入长度；设置键盘右下角按钮的文字，仅在type='text'时生效；通过绑定Input事件实时将输入框内容存储起来，方便上面的提交按钮使用 -->
<input class="post-view-input" placeholder="短评长度在十二字内哦~" focus maxlength="12" confirm-type="提交" bindconfirm="onConfirmFinish" bindinput="saveInputTxt"></input>
```
2. `js`代码：
```js
// 确认事件
onConfirm(event) {
    this.postComment({
      content: this.data.saveInputTxt
    })
  },
  // 取消事件
  onCancle() {
    this.setData({
      postStatus: false
    })
  },
  // 监听输入自动保存事件
  saveInputTxt(event) {
    this.data.saveInputTxt = event.detail.value
  }
  // 键盘回车事件
  onConfirmFinish: function (event) {
    this.postComment({
      content: event.detail.value
    })
  },
  // 提交评论事件
  postComment: function (config) {
    console.log(config)
    let newComment = ''
    if (config.index) {
      newComment = this.data.bookTags[config.index].content
    } else {
      newComment = config.content
    }
    requestModel.addBookComment({
        id: this.data.id,
        content: newComment
      })
      .then(v => {
        console.log(v)
        // 强烈注意，该数据方法直接修改数组，返回的是当前数组长度!
        this.data.bookTags.unshift({
          content: newComment,
          nums: 1
        })
        this.setData({
          // 插入到数组头部后的数据进行更新
          bookTags: this.data.bookTags
        })
        wx.showToast({
          title: '短评+1',
          icon: 'none'
        })
        this.onCancle()
      })
      .catch(e => {
        console.log(e)
      })
  }
```
注意事项：
* 获取当前`input`标签的内容：`event.detail.value`
* 实时保存某个`input`标签的内容：`bindinput`事件进行保存
* 控件绑定值`data-xxx`使得该控件的点击事件获取到对应的值：`event.currentTarget.dataset.xxx`