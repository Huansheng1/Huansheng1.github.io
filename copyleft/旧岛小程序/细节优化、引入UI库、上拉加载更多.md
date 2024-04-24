# 细节优化、上拉加载更多
## 细节优化
### 图片异常优化
在测试时，我们发现：部分豆瓣图片是开启了防盗链措施的，因此我们请求的部分数据是会失败的；

在请求失败后，我们的 书籍详情页 将会空出 一大片的空白 ，这会显得非常尴尬

于是我们通过 监测`image`标签 加载失败事件 来避免空白的场景：
1. `wxml`增加事件绑定：
```html
<image class="book-image" src="{{bookData.image}}" mode="widthFix" binderror="onLoadImgErr"></image>
```
2. `js`文件处理加载异常的逻辑：
```js
data: {
  imageError: 'images/img-undefined.png'
},
methods: {
    // 图片加载出错时使用默认的占位图片
    // 这里通过['']来直接修改data数据里的某个属性值
  onLoadImgErr() {
    this.setData({
      ['bookData.image']: this.data.imageError
    })
  },
    onClickBook(event){
      this.triggerEvent('clickedBook',this.data.bookData,{})
    }
  }
```
### 内容不存在优化
如果评论与书籍内容也没有的话，通过`wx:if`判断是否显示即可。
### input双向绑定
1. `wxml`代码：
```html
<!-- 双向绑定，类似于vue的v-model -->
<input class="search" placeholder="搜索图书名称" focus bindconfirm="onSearchConfirm"model:value="{{keywordValue}}"></input>
```
2. `js`代码：
```js
data: {
    popularTags: [],
    searchData: [],
    bookData: [],
    showSearchResult: false,
    keywordValue: ''
  }
```
* 更多：[简易双向绑定 | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/framework/view/two-way-bindings.html)
## 上拉加载更多
对于这功能，微信官方其实是给`App`全局 与 `Page`页面 提供了相关配置与监听事件，方便我们我们直接使用的；

但是，遗憾的是，本项目为了方便其他地方的复用，将搜索详情封装为一个高阶组件（也就是业务逻辑较复杂的组件），从而无法使用官方提供的配置
> 如果对官方配置感兴趣，请查看：
* [页面配置Json | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)

* [页面的初始数据、生命周期回调、事件处理函数等 | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onpulldownrefresh)

* [微信小程序分页加载数据～上拉加载更多～小程序云数据库的分页加载 | 微信开放社区](https://developers.weixin.qq.com/community/develop/article/doc/000a2287318888d8a2b856e0750813)

### 分析过程
1. 先查看`bind`事件是否有触底相关监听事件：[监听事件 | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)，遗憾的是，并没有找到
2. 在`组件.js`尝试了`onReachBottom`事件，果然没效果
3. 于是，我们可以使用`scroll-view`滚动组件啊，滚动组件肯定有相关事件，于是我搜索了一下，果然有！
* 相关问题：
* > [scroll-view如何实现上拉加载更多功能？](https://developers.weixin.qq.com/community/develop/doc/000cae53bfc840b4276ac3d135bc00?highLine=%25E7%25BB%2584%25E4%25BB%25B6%25E5%258A%25A0%25E8%25BD%25BD%25E6%259B%25B4%25E5%25A4%259A)
* > [微信小程序封装上拉加载、下拉刷新组件](https://segmentfault.com/a/1190000021107517?utm_source=tag-newest)
* > [微信小程序下拉加载和上拉刷新两种实现方法详解](https://www.jb51.net/article/169371.htm)
4. 但是真的必须这样么？其实我们再细想一下，既然当前这个是组件，何不我们在需要引入该组件的页面配好上拉加载更多，再将是否需要上拉加载传递给我们的组件呢？

5. 那么，方案搞清楚了，我们开始做吧！

### 上拉加载代码实现
1. `json`配置引入组件：
```json
{
  "enablePullDownRefresh": true,
  "usingComponents": {
    "search-cpn": "/components/search/index",
    "book-cpn":"/components/bookItem/index",
    "search-detail-cpn":"/components/searchDetail/index"
  }
}
```
2. `wxml`使用组件的相关代码：
```html
<view wx:else class="search-wrapper">
  <search-detail-cpn bind:onSearchCancel="onSearchCancel" searchMore="{{loadingMore}}" clearSearchData="{{clearSearchData}}" />
</view>
```
3. `index.js`写入相应方法：
```js
import requestModel from '../../api/url'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    booksData: [],
    showSearchDetail: false,
    loadingMore: '',
    clearSearchData: {}
  },
  onClickedSearch(event) {
    this.setData({
      showSearchDetail: true
    })
  },
  onSearchCancel() {
    this.setData({
      showSearchDetail: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '书单',
    })
    requestModel.getBooks()
      .then(v => {
        console.log(v)
        this.setData({
          booksData: v
        })
      })
  },
  onClickBookItem(event) {
    console.log(event.detail)
    wx.navigateTo({
      url: '../bookDetail/index?id=' + event.detail.id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      clearSearchData: new Boolean('清空数据啊')
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      loadingMore: new Date().getTime()
    })
  }
})
```
4. 封装的组件内部处理：
```js
import requestModel from '../../api/url'
import searchModel from 'searchModel'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchMore: {
      type: String,
      observer(v) {
        // 通过时间戳来使得每次结果都不相同达到下拉就调用的目的
        console.log(v)
        this.searchMore({
          keyword: this.data.keywordValue,
          start: this.data.bookData.length
        })
      }
    },
    clearSearchData: {
      type: Object,
      observer() {
        console.log('清空数据啊')
        this.searchBook({
          start: 0,
          keyword: this.data.keywordValue
        })
        wx.stopPullDownRefresh({
          success: (res) => {
            console.log('停止加载更多成功！')
          },
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 热门标签数据
    popularTags: [],
    // 历史搜索数据
    searchData: [],
    // 搜索数据结果数据
    bookData: [],
    // 是否显示搜索结果状态值
    showSearchResult: false,
    // 输入框当前值
    keywordValue: '',
    // 为什么这里使用undefined而不是0？因为我们为了避免当搜索结果总数就是0 与 初始值的区别
    bookTotalNums: undefined,
    // 是否显示本搜索组件界面
    isSearch: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCancel(event) {
      this,
      this.triggerEvent('onSearchCancel', '取消按钮被点击了', {})
    },
    onClear() {
      this.setData({
        start: 0,
        bookData: [],
        showSearchResult: false
      })
    },
    // 上拉记载代码，本文核心
    searchMore(config) {
      // 判断搜索关键字是否为空 且 不为 空格  && config.keyword
      if (!config.keyword.trim().length) return
      // 如不为初始的undefined时 判断搜索页数是否达到上限
      if (typeof this.data.bookTotalNums !== 'undefined' && config.start >= this.data.bookTotalNums) {
        console.log('666')
        wx.showToast({
          title: '结果全部展示啦',
          duration: 2500
        })
        return
      }
      // 判断搜索是否正在进行，避免重复搜索
      if (!this.data.isSearch) {
        wx.showLoading({
          title: '获取更多中...'
        })
        // 加锁
        this.setData({
          isSearch: true
        })
        // 获取更多的请求
        requestModel.searchBook(config)
          .then(v => {
            this.saveSearchInfo(config.keyword)
            console.log(v)
            // 将获取到的新数据追加到之前数据后面
            this.setData({
              bookData: this.data.bookData.concat(v.books),
              bookTotalNums: v.total
            })
          })
          .catch(e => console.log(e))
          .finally(() => {
            // 取消loading显示与去锁
            wx.hideLoading()
            this.setData({
              isSearch: false
            })
          })
      }
    }
  }
})
```

## 获取用户信息
1. 将按钮组件封装使得更加美观：
```html
<button bind:getuserinfo="onGetUserInfo" 
    open-type='{{openType}}'  plain='{{true}}'
     class="container">
  <slot name="img"></slot>
</button>
```
2. `wxml`代码：
```html
<user-cpn wx:if="{{!authorized}}" open-type="getUserInfo" class="avatar-position" bind:getuserinfo="onGetUserInfo">
	<image slot="img" class="avatar" src="images/my.png" />
</user-cpn>
<view wx:if="{{authorized}}" class="avatar-container avatar-position">
	<image src="{{userInfo.avatarUrl}}" class="avatar" />
	<text>{{userInfo.nickName}}</text>
</view>
```
3. `js`代码：
```js
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的',
    })
    this.onGetUserInfo()
  },
// 如果点击按钮也进行调用
  onGetUserInfo(event) {
    console.log(event)
    this.getUserInfo(event)
  },
getUserInfo(config) {
    // 先试图获取用户信息，如不成功，则使用新API获取用户授权
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          authorized: true
        })
      },
      fail: (err) => {
        console.log('用户未授权：')
        console.log(err)
        // 如果授权成功
        if (config && config.detail && config.detail.errMsg === "getUserInfo:ok") {
          this.setData({
            userInfo: config.detail.userInfo,
            authorized: true
          })
        } else {
          this.setData({
            authorized: false
          })
          return
        }
      }
    })
  }
```
从上可以看出：
* `wx.getUserInfo(Object object)`的改动仅仅是：[调用前需要 用户授权 `scope.userInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html)。

* 使用 `button` 组件，并将 `open-type` 指定为 `getUserInfo` 类型，弹出授权窗口来获取用户基本信息。

* 二者配合就可完成我们日常的授权操作了！

* 当然，为了更加完善，我们还可以配合：[ wx.getSetting ](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) 来获取用户授权的状态。