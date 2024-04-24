# Vue3.x初体验
## 引入方式
### CDN引入
#### CDN是什么？
日常开发与上线中，我们常常需要购买一个 云服务器，这时候我们都知道他会让我们选择一个 服务器地址，比如，我一般会选择 上海 或 广州的服务器；
然后我们会将打包后的代码上传发布到服务器里面，由于我们服务器是上海的，所以靠近上海的用户访问我们服务器最快，越远的用户由于网络传输的限制，访问会更慢一点。
一般情况下我们当然是考虑在用户最多的地方上线。
但是，现实是很难让用户都在一个城市的，这时候我们有两种做法：
1. 部署多个服务器，根据`IP`让用户访问离他最近的服务器 - 但这个开销有点大，而且有点浪费
2. `CDN`分发技术

`CDN`是什么呢？

> `内容分发网络`（`Content Delivery Network`，简称CDN）是建立并覆盖在承载网之上，由分布在不同区域的边缘节点服务器群组成的分布式网络。
![](https://pic3.zhimg.com/80/v2-5ba76e77f05b030b5879177bd336928f_720w.jpg?source=1940ef5c)

比如：我们购买了一个`CDN`资源包（服务器），我们可以将我们的程序发布到这个 CDN服务器里，由于CDN系统是在全国各地都有相应的子服务器。当北京用户去访问我们资源时，CDN系统会优先找离当前北京用户最近的服务器，如果这个子服务器没有找到相应的资源的话，子服务器会找它的父服务器，父服务器也没该资源的话，父服务器再去往上一级服务器寻找，知道找到 源站，再将源站的该资源下载保存到自己服务器里，然后其他用户访问的时候就能在最近的服务器找到该资源了！
#### CDN引入Vue3
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Vue3</title>
<!-- 引入CDN里的Vue3库文件 -->
<script src="https://unpkg.com/vue@next"></script>
</head>
<body>
<!-- 宿主节点 -->
<div id="root"></div>
<script>
// 创建Vue实例的初始化数据
const HelloVueApp = {
      template: '<h1>Hello Vue!!</h1>'
}
// Vue3是通过createApp创建一个Vue实例的，然后再挂载到宿主节点上
Vue.createApp(HelloVueApp).mount('#root')
</script>
</body>
</html>
```
### 本地文件引入

### VueCli脚手架

## 基础
### 制作加减器
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Vue3</title>
    <!-- 引入CDN里的Vue3库文件 -->
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="root"></div>
    <script>
        const HelloVueApp = {
            template: `
			<h1>Hello Vue!!</h1>
			<h1>{{count}}</h1>
			<button @click="increment">增加</button>
			<button @click="decrement">减小</button>
	`,
            data: () => {
                return {
                    count: 0
                }
            },
            methods: {
                increment() {
                    this.count++;
                },
                decrement() {
                    this.count--;
                }
            }
        }

        Vue.createApp(HelloVueApp).mount('#root')
    </script>
</body>

</html>
```
### 定义模版方式
1. 直接在`createApp`方法传入对象的`template`里直接赋值

> 上面都是这种方式

2. `script`定义脚本：
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Vue3</title>
    <!-- 引入CDN里的Vue3库文件 -->
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="root"></div>
    <!-- 定义了一个模板 -->
    <script type="x-template" id="calcRef">
            <h1>Hello Vue!!</h1>
			<h1>{{count}}</h1>
			<button @click="increment">增加</button>
			<button @click="decrement">减小</button>
    </script>
    <script>
        const HelloVueApp = {
            template: `#calcRef`,
            data: () => {
                return {
                    count: 0
                }
            },
            methods: {
                increment() {
                    this.count++;
                },
                decrement() {
                    this.count--;
                }
            }
        }

        Vue.createApp(HelloVueApp).mount('#root')
    </script>
</body>

</html>
```
3. `template`方式定义一个模板：
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Vue3</title>
    <!-- 引入CDN里的Vue3库文件 -->
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="root"></div>
    <!-- 定义了一个模板 -->
    <template id="calcRef">
            <h1>Hello Vue!!</h1>
			<h1>{{count}}</h1>
			<button @click="increment">增加</button>
			<button @click="decrement">减小</button>
    </template>
    <script>
        const HelloVueApp = {
            template: `#calcRef`,
            data: () => {
                return {
                    count: 0
                }
            },
            methods: {
                increment() {
                    this.count++;
                },
                decrement() {
                    this.count--;
                }
            }
        }

        Vue.createApp(HelloVueApp).mount('#root')
    </script>
</body>

</html>
```
综上对比，我们可以发现`template`方式有 标签高亮、语法提示，以后我们优先使用该种方式！

## 如何分析源代码
> 新手无需阅读

1. 前往`github`下载`vue3`的源码，项目名是 [`vue-next`](https://github.com/vuejs/vue-next)

2. 我们下载`tag`稳定版本便于分析：[`网页下载`](https://github.com/vuejs/vue-next/tree/v3.2.23)

> 如果是`git clone`的话，克隆的是整个仓库，然后切换到`对应tag版本`上
```bash
git clone https://github.com/vuejs/vue-next.git
```
3. 我们会发现`vue-next`是一个[`monorep`](https://juejin.cn/post/6950082433647640612)，不是以前的那种单仓库哦！其采用的依赖安装是`yarn`安装。
4. 终端进入目录，我们开始安装依赖：
```bash
# 如果是zip下载而非git克隆需要先执行git初始化
# git init

# 安装依赖，如果没有yarn则会报错
yarn install
# emm，报错了，不是课程说的yarn，而是pnpm，需要先安装pnpm
npm i -g pnpm
# 再安装依赖
pnpm intall
```
5. 运行打包指令：`yarn dev`
6. 导入打包后的库文件`D:\code\vue-next\packages\vue\dist\vue.global.js`，引入该文件：
```html
<script>
        // 设置断点
        debugger;
        const HelloVueApp = {
            template: `#calcRef`,
            data: () => {
                return {
                    count: 0
                }
            }
        }
        Vue.createApp(HelloVueApp).mount('#root')
    </script>
```
7. 会发现断点虽然能中断，打包后的文件经过了压缩，不好分析原理
8. 于是我们需要修改打包指令，在`package.json`文件里增加一个参数：`--sourcemap`：
```json
{
    "scripts":{
        "dev":"node scripts/dev.js --sourcemap
    }
}
```
## 基础语法
### 模板语法
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Vue3</title>
    <!-- 引入CDN里的Vue3库文件 -->
    <script src="https://unpkg.com/vue@next"></script>
    <style>
        [v-cloak] {
            display: none;
        }
    </style>
</head>

<body>
    <div id="root"></div>
    <!-- 定义了一个模板 -->
    <template id="calcRef">
        <!-- 只渲染一次 -->
        <h1 v-once>Hello Vue!! {{count}}</h1>
        <h1>{{count}}</h1>
        <!-- 绑定事件简写 -->
        <button @click="increment">增加</button>
        <!-- 绑定事件全写 -->
        <button v-on:click="decrement">减小</button>
        <hr />bindbind
        <!-- 绑定属性 -->
        <!-- stop修饰符代表阻止冒泡 -->
        <button v-bind:disabled="disabled" @click.stop="changeDisbaled">按钮1</button>
        <!-- 绑定变量简写 -->
        <!-- prevent修饰符代表阻止默认事件 -->
        <button :disabled="!disabled" @click.prevent="changeDisbaled">按钮2</button>
        <!-- 修饰符camel会将 test-name 中划线形式的属性改为 testName 驼峰形式 -->
        <div :test-name.camel="1">测试水水水水</div>
        <!-- 支持对象绑定和数组绑定，以及对象数组绑定 -->
        <div :class="['name','age',{active:true},{lalala:false}]">lalal</div>
        <div :style="{color:'red',backgroundColor:'black'}">sjdklajsdka</div>
        <!-- 当然，也支持直接定义在data、method、computed之类的里面再调用 -->
        <h1>自定义组件的时候有奇效！</h1>
        <!-- 还支持动态绑定属性名 - 动态参数 -->
        <!-- <div v-bind:[keyName]="tyre">动态属性名</div> keyName会被转化为keyname，除非用computed之类的，不然不建议用驼峰形式 -->
        <div :[keyname]="false">动态属性名</div>
        <!-- 还支持绑定整个对象作为属性名和属性值！ -->
        <button :="keyValues">绑定属性键值对</button>
        <hr>
        <!-- 渲染富文本内容 -->
        <div v-html="htmlData"></div>
        <!-- 渲染文本内容 -->
        <div v-text="textContent"></div>
        <!-- template,特殊占位符,类似于小程序里的block、ng里的ng-container -->
        <template v-if="show">
            <!-- 保持原始格式展示，不会被翻译成为变量 -->
            <div v-pre>{{htmlData}}</div>
        </template>
        <!-- v-show不能在template上使用，因为其本质是css修改，template不支持display属性 -->
        <template v-show="show">
            <!-- 保持原始格式展示，不会被翻译成为变量 -->
            <div v-pre>{{极客帮还不加包}}</div>
        </template>
        <div :hidden="show">hidden隐藏</div>
        <hr />
        <!-- 根据变量决定是否显示 -->
        <h1 v-if="show">是否显示？</h1>
        <!-- 还可以跟着上面使用v-else -->
        <h1 v-else>你不显示我显</h1>
        <!-- v-show本质是display: none;隐藏；v-if则是直接修改dom -->
        <h2 v-show="show">v-show展示</h2>
        <!-- 还可以搭配else-if -->
        <div class="red" style="color: rebeccapurple;" v-if="scpre > 90">A</div>
        <div class="red" style="color: rebeccapurple;" v-else-if="scpre > 80">B</div>
        <div class="red" style="color: rebeccapurple;" v-else-if="scpre > 70">C</div>
        <div class="red" style="color: rebeccapurple;" v-else>D</div>
        <button @click="changeScore(+10)" @dbclick.prevent="changeScore(-10)">加分</button>
        <!-- self 当事件在该元素本身触发时才触发事件
        .capture 添加事件侦听器是，使用事件捕获模式
        .once 事件只触发一次 -->
        <!-- 更多修饰符：https://v3.cn.vuejs.org/guide/events.html#事件修饰符 -->
        <button @click.once="show = !show">切换</button>
        <button @[testclick]="clickValues.click">拉拉</button>
        <button @="clickValues">测测</button>
        <!-- 如果需要显式的话必须使用 $event 传入event，但其实不传入也可以在函数里使用event获取事件对象 -->
        <button @click="forceSendEvent('name','age',$event)">显式传入事件</button>
        <hr />
        <!-- 根据变量批量渲染显示多个 -->
        <h1 v-for="item in arr">
            {{item.title}}
        </h1>
        <hr>
        <!-- 在vue时存在数据还未初始化完成先展示了界面导致出现了 类似 {{renderForSomeTime}}场景，因此可以通过 v-cloak 标记，如果还未渲染完成，元素上会有 v-cloak 属性，我们通过 属性选择器将其隐藏，渲染完成后会自动去掉该属性
        Vue3上几乎不存在该问题 -->
        <div v-cloak>{{renderForSomeTime}}</div>
        <!-- 遍历支持对象、数组、数字，数组和数字支持 值、索引两个参数 -->
        <!-- 不用括号也有效哦 -->
        <!-- 注意，也支持 of关键字 ，不仅仅是 in哦 -->
        <div v-for="(item,index) in ['lalla','biubiubiu','dididi']">{{item}}--{{key}}--{{index}}</div>
        <!-- 对象 支持传入三个参数，分别代表 当前项、属性名、索引 -->
        <!-- 通过绑定个唯一值的key，我们可以提升列表变更时重新渲染的性能 -->
        <div v-for="(item,key,index) in {name:'幻生',age:18,score:100}" :key="key">{{item}}--{{key}}--{{index}}</div>
        <div v-for="(item,index) in 5">{{item}}--{{key}}--{{index}}</div>
    </template>
    <script>
        const HelloVueApp = {
            template: `#calcRef`,
            data: () => {
                return {
                    count: 0,
                    htmlData: '<h2 style="color:red;">富文本解析</h2>',
                    textContent: '文本内容',
                    renderForSomeTime: 'dlasdsa撒旦撒',
                    disabled: true,
                    show: false,
                    arr: [
                        {
                            title: '车蒙古阿大撒',
                        },
                        {
                            title: '爱睡觉的楼上的楼上卡',
                        }
                    ],
                    keyname: 'lalala',
                    keyValues: {
                        name: '啊啊',
                        age: 18,
                        disabled: true
                    },
                    testclick: 'click',
                    clickValues: {
                        click: (e) => {
                            // 方法调用没显示指定时默认会传入事件对象，用一个变量接受即可
                            console.log('点击：', e);
                            alert('test');
                        },
                        mouseleave: () => {
                            alert('鼠标挪走了');
                            // 不指定的话，直接打印event变量也可以使用事件对象
                            // e、$event不行！
                            console.log('鼠标挪动~', event);
                        },
                    },
                    forceSendEvent(name, age, e) {
                        // 显式传入$event后才可以在方法里通过event使用事件，当然也可以在那个位置自己指定形参来接收
                        // event === e
                        console.log('name:', name, 'age', age, event, e);
                        // forceSendEvent('name','age')调用依然可以通过event获取到事件对象，但是e就不行了
                    },
                    scpre: 60
                }
            },
            methods: {
                increment() {
                    this.count++;
                },
                decrement() {
                    this.count--;
                },
                changeDisbaled() {
                    this.disabled = !this.disabled;
                },
                changeScore(value) {
                    this.scpre += value;
                    console.log('value：', value, 'scpre:', this.scpre)
                }
            }
        }

        Vue.createApp(HelloVueApp).mount('#root')
    </script>
</body>

</html>
```
在Vue里面，会先将每一个元素转换为用 `JavaScript`描述的对象(VNode/虚拟节点) ，这个对象描述了该元素的全部信息：类型、属性、内容等等。
`VNode`节点共同组成了 `虚拟Dom`（VNode Tree），然后将 内存中的该份 虚拟节点树 渲染为 真实的浏览器存在的 `Dom Tree`。

将虚拟Dom渲染为真实Dom的过程中，根据有无`key`属性，Vue采用了两种方式来渲染：
1. 有key时，使用`Diff算法`来让渲染效率最大化：开发者在同一父级元素下的子元素指定唯一的key，在发生二次变更时，Diff算法会根据Key值判断哪些需要插入或者删除、修改Dom节点，不影响其他未变更的节点。
2. 无key时，根据节点来对比，如果我们在中间插入了一个节点，它会对比新VNode Tree 和 旧VNode Tree长度，取短的那个开始进行循环比较（可以减少循环次数），首先未变更的节点保持不变，中间插入的节点发现发生了变更，它会将旧节点更新为新的节点信息，但是由于我们改了这个旧节点，所以其之后的节点其实都对应不上了，于是后续的都要进行更新。最后，判断旧版节点树和新节点树的长度，如果旧的更长，则将后续的都删除销毁，如果新的更长则进行新节点的创建挂载：![](https://pic.imgdb.cn/item/61aea8ab2ab3f51d91464038.jpg)
### 计算属性与监听器
> 计算属性：`computed`，用于结合多个`data`里的数据运算出界面需要的展示效果，具有缓存效果

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Vue3</title>
    <!-- 引入CDN里的Vue3库文件 -->
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="root"></div>
    <template id="demoRef">
        <div>{{personInfo}}</div>
        <div>{{love}}</div>
        <div>{{scoreDetail}}</div>
        <hr>
        <button @click="changeLove">修改</button>
    </template>
    <!-- 渲染结果：
            幻生-18
            我喜欢玲儿
            语文：128 数学：148 计算机：149 -->
    <script>
        const HelloVueApp = {
            template: `#demoRef`,
            data: () => {
                return {
                    name: '幻生',
                    age: 18,
                    lover: '玲儿',
                    scores: [{
                        subject: '语文',
                        score: 128
                    },
                    {
                        subject: '数学',
                        score: 148
                    },
                    {
                        subject: '计算机',
                        score: 149
                    }]
                }
            },
            methods: {
                changeLove() {
                    // 传入新数据到computed的setter方法
                    this.personInfo += '；另外我说件事，喜欢不止一点点，好多好多哦！';
                },
            },
            computed: {
                // 其实这种是缩写（只有getter方法，setter为空方法：()=>{} ）
                // personInfo() {
                //     return this.name + '-' + this.age;
                // },
                // 完整写法：
                personInfo: {
                    get: function () {
                        return this.name + '-' + this.age;
                    },
                    set: function (newValue) {
                        // 默认为空
                        // 如：执行某些操作！
                        this.age = newValue;
                    }
                },
                love() {
                    return '我喜欢' + this.lover;
                },
                scoreDetail() {
                    return this.scores.map(item => item.subject + '：' + item.score + '    ').join('\n');
                },
            }
        }

        Vue.createApp(HelloVueApp).mount('#root')
    </script>
</body>

</html>
```
计算属性如果依赖的`data`数据不发生变更，那么它缓存机制会很优越，不管调用多少次都只会运算一次！如果发送变更才会重新运算。


> 监听器：[`watch`，用于监听某个`data`数据变化时进行某些特殊处理](https://v3.cn.vuejs.org/api/options-data.html#watch)

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Vue3</title>
    <!-- 引入CDN里的Vue3库文件 -->
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="root"></div>
    <template id="demoRef">
        <input type="text" v-model="comment">
        <hr>
        <div>输入暂停的次数：{{commentStopCount}}</div>
        <hr>
        <div @click="changeObjValue">{{obj.firstChild && obj.firstChild.name}}</div>
        <div @click="testMethodFunc">测试直接使用methods里的方法</div>
    </template>
    <!-- 渲染结果：
            幻生-18
            我喜欢玲儿
            语文：128 数学：148 计算机：149 -->
    <script>
        const HelloVueApp = {
            template: `#demoRef`,
            data: () => {
                return {
                    comment: '',
                    commentStopCount: 0,
                    obj: {
                        firstChild: {
                            name: 'lalala'
                        }
                    }
                }
            },
            methods: {
                listenComment() {
                    this.commentStopCount++;
                },
                changeObjValue() {
                    this.obj.firstChild.name = '幻生';
                },
                test(newValue, oldValue) {
                    console.log('测试：', newValue, oldValue)
                },
                testMethodFunc() {
                    this.obj = {
                        name: '奥特曼'
                    }
                }
            },
            watch: {
                // comment：要监听的data里的变量名
                // newValue：新输入的值
                // oldValue：原输入的值

                // 这种其实也是缩写
                comment: function (newValue, oldValue) {
                    console.log('新值：', newValue, '原值：', oldValue);
                    this.listenComment();
                },
                // 完整写法
                // comment: {
                //     handler: function (newValue, oldValue) {
                //         console.log('新值：', newValue, '原值：', oldValue);
                //         this.listenComment();
                //     },
                // }
                // 可选参数
                // obj(newValue, oldVaule) {
                //     // 默认情况下，只能监听当前变量的变更，无法监听对象变量的某一个属性的值的变更
                //     // 如 changeObjValue方法执行变更操作 无法正常监听
                //     console.log('new value:', newValue, 'old value:', oldVaule);
                // }
                obj: {
                    handler: function (newValue, oldVaule) {
                        // 默认情况下，只能监听当前变量的变更，无法监听对象变量的某一个属性的值的变更
                        // 如 changeObjValue方法执行变更操作 无法正常监听
                        // 该变量如果是引用数据，存在浅拷贝导致看起来原始数据也是最新值的问题
                        console.log('new value:', newValue, 'old value:', oldVaule);
                    },
                    // 通过指定deep参数可以深度监听对象数据的变更操作
                    deep: true,
                    // 立即执行，如果需要在数据初始化后立马监听一次，则可以指定该参数在初始化后就触发一次！
                    // 从undefined变成了初始值时会触发
                    immediate: true
                },
                // 如果在监听器里写两个监听器，后者会覆盖前者！

                // 监听器的其他写法：
                // 1. 直接指定使用methods里的方法
                // obj: 'test',
                // 2. 为了避免覆盖的话，可以传入一个数组用于发生变更时触发多个函数
                obj: [
                    'test',
                    {
                        handler: function (newValue, oldVaule) {
                            // 默认情况下，只能监听当前变量的变更，无法监听对象变量的某一个属性的值的变更
                            // 如 changeObjValue方法执行变更操作 无法正常监听
                            // 该变量如果是引用数据，存在浅拷贝导致看起来原始数据也是最新值的问题
                            console.log('new value66:', newValue, 'old value:', oldVaule);
                        },
                        // 通过指定deep参数可以深度监听对象数据的变更操作
                        deep: true,
                        // 立即执行，如果需要在数据初始化后立马监听一次，则可以指定该参数在初始化后就触发一次！
                        // 从undefined变成了初始值时会触发
                        immediate: true
                    },
                ],
                // 3. 支持直接监听某个对象的某个属性 xx.xx，注意：数组[xx]是不支持的；不会和 监听 xx 对象的监听器重叠覆盖
                'obj.name': function (newV, oldV) {
                    console.log('name变更：', newV, oldV);
                }
                // 4. 还支持在钩子函数里通过this.$watch设置监听哦
            },
            created() {
                // 传入三个参数：要监听的数据、监听函数、监听配置
                // 返回一个方法，可用来取消监听哦！

                // 不会和watch里定义的监听覆盖或重叠
                const unListenFunc = this.$watch('obj', (newV, old) => {
                    console.log('$watch - new:', newV, 'old:', old);
                }, {
                    deep: true
                });
                // 取消监听；这里我们设计了如果超过8秒没变更的话不再进行监听
                setTimeout(unListenFunc, 8000);
            },
        }
        Vue.createApp(HelloVueApp).mount('#root')
    </script>
</body>

</html>
```

> 注意：
* Vue3不支持`filter`过滤器了（类似`ng`里的`pipe`管道），官方推荐使用`computed`计算属性或者全局方法来实现相关功能
### v-model：表单双向绑定
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Vue3</title>
    <!-- 引入CDN里的Vue3库文件 -->
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="root"></div>
    <template id="demoRef">
        <!-- 输入框 -->
        <input type="text" v-model="comment">
        <!-- 可以简单看作为 下面这种方式的简写：绑定变量的显示的同时，会自动对用户输入的事件进行处理修改变量值 -->
        <!-- <input type="text" :value="comment" @input="comment = $event.target.value"> -->
        <div>评论：{{comment}}</div>
        <hr>
        <!-- 文本域 -->
        <label for="intro">自我介绍：</label>
        <textarea id="intro" v-model="intro"></textarea>
        <div>自我介绍：{{intro}}</div>
        <hr>
        <!-- 多选框 -->
        <label for="favorite">爱好：</label>
        <input type="checkbox" name="favorite" v-model="favorite" value="vue">vue</input>
        <input type="checkbox" name="favorite" v-model="favorite" value="ng">ng</input>
        <input type="checkbox" name="favorite" v-model="favorite" value="玲儿">玲儿</input>
        <input type="checkbox" name="favorite" v-model="favorite" value="王者">王者</input>
        <div>爱好：{{favorite}}</div>
        <hr>
        <!-- 单选框 -->
        <label for="gender">性别：</label>
        <input type="radio" name="gender" v-model="gender" value="boy">男</checkbox>
        <input type="radio" name="gender" v-model="gender" value="girl">女</checkbox>
        <div>爱好：{{gender}}</div>
        <hr>
        <!-- 下拉框 -->
        <label for="food">食物：</label>
        <select name="food" id="food" v-model="foods">
            <option value="辣条">辣条</option>
            <option value="玲儿">玲儿</option>
            <option value="主食">主食</option>
        </select>
        <div>想吃：{{foods}}</div>
    </template>
    <!-- 渲染结果：
            幻生-18
            我喜欢玲儿
            语文：128 数学：148 计算机：149 -->
    <script>
        const HelloVueApp = {
            template: `#demoRef`,
            data: () => {
                return {
                    comment: '',
                    intro: '',
                    // 如果是一个非数组变量的话，点击哪个都是true，显然不是我们想要的
                    // favorite: '',
                    // 数组的话，点击了某个复选框，就会将其value加入到当前数组
                    favorite: [],
                    gender: 'boy',
                    foods: '玲儿'
                }
            },
            methods: {

            },
        }
        Vue.createApp(HelloVueApp).mount('#root')
    </script>
</body>

</html>
```
`v-model`同样有一点修饰符：
* `lazy`：`v-model.lazy`等于将默认的`v-model`监听从`input`输入即监听 变为 `change`失去焦点才触发的事件
* `number`：将输入的值默认转换为 `number`类型，感觉类似于 `type="number"` 的作用；如果无法转换则还是`string`类型。
* `trim`：自动去除前后空格；回车或者失去焦点的时候生效
### 组件化
1. 注册全局组件：
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Vue3</title>
    <!-- 引入CDN里的Vue3库文件 -->
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="root"></div>
    <template id="demoRef">
        <cpn-favorite></cpn-favorite>
        <cpn-demo></cpn-demo>
        <cpn-like></cpn-like>
    </template>
    <template id="cpn-demo">
        <input type="text" v-model.trim="comment">
        <div>评论：{{comment}}</div>
        {{getType(comment)}}
        <hr>
        <!-- 文本域 -->
        <label for="intro">自我介绍：</label>
        <textarea id="intro" v-model.lazy="intro"></textarea>
        <div>自我介绍：{{intro}}</div>
        <hr>
    </template>
    <template id="cpn-favorite">
        <!-- 多选框 -->
        <label for="favorite">爱好：</label>
        <input type="checkbox" name="favorite" v-model="favorite" value="vue">vue</input>
        <input type="checkbox" name="favorite" v-model="favorite" value="ng">ng</input>
        <input type="checkbox" name="favorite" v-model="favorite" value="玲儿">玲儿</input>
        <input type="checkbox" name="favorite" v-model="favorite" value="王者">王者</input>
        <div>爱好：{{favorite}}</div>
        <hr>
    </template>
    <template id="cpn-like">
        <!-- 单选框 -->
        <label for="gender">性别：</label>
        <input type="radio" name="gender" v-model="gender" value="boy">男</checkbox>
        <input type="radio" name="gender" v-model="gender" value="girl">女</checkbox>
        <div>爱好：{{gender}}</div>
        <hr>
        <!-- 下拉框 -->
        <label for="food">食物：</label>
        <select name="food" id="food" v-model="foods">
            <option value="辣条">辣条</option>
            <option value="玲儿">玲儿</option>
            <option value="主食">主食</option>
        </select>
        <div>想吃：{{foods}}</div>
        <hr>
    </template>
    <script>
        const HelloVueApp = {
            template: `#demoRef`,
            data: () => {
                return {
                }
            }
        }
        Vue.createApp(HelloVueApp).component('cpn-demo', {
            template: '#cpn-demo',
            data: () => {
                return {
                    comment: '',
                    intro: '',
                }
            },
            methods: {
                getType(value) {
                    console.log('comment：', this.comment)
                    console.log('intro：', this.intro)
                    return typeof value;
                }
            },
        }).component('cpn-favorite', {
            template: '#cpn-favorite',
            data: () => {
                return {
                    favorite: [],
                }
            },
        }).component('cpn-like', {
            template: '#cpn-like',
            data: () => {
                return {
                    gender: 'boy',
                    foods: '玲儿'
                }
            },
        }).mount('#root')
    </script>
</body>

</html>
```
2. 注册局部组件：
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Vue3</title>
    <!-- 引入CDN里的Vue3库文件 -->
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="root"></div>
    <template id="demoRef">
        <cpn-favorite></cpn-favorite>
        <cpn-demo></cpn-demo>
        <cpn-like></cpn-like>
    </template>
    <template id="cpn-demo">
        <input type="text" v-model.trim="comment">
        <div>评论：{{comment}}</div>
        {{getType(comment)}}
        <hr>
        <!-- 文本域 -->
        <label for="intro">自我介绍：</label>
        <textarea id="intro" v-model.lazy="intro"></textarea>
        <div>自我介绍：{{intro}}</div>
        <hr>
    </template>
    <template id="cpn-favorite">
        <!-- 多选框 -->
        <label for="favorite">爱好：</label>
        <input type="checkbox" name="favorite" v-model="favorite" value="vue">vue</input>
        <input type="checkbox" name="favorite" v-model="favorite" value="ng">ng</input>
        <input type="checkbox" name="favorite" v-model="favorite" value="玲儿">玲儿</input>
        <input type="checkbox" name="favorite" v-model="favorite" value="王者">王者</input>
        <div>爱好：{{favorite}}</div>
        <hr>
    </template>
    <template id="cpn-like">
        <!-- 单选框 -->
        <label for="gender">性别：</label>
        <input type="radio" name="gender" v-model="gender" value="boy">男</checkbox>
        <input type="radio" name="gender" v-model="gender" value="girl">女</checkbox>
        <div>爱好：{{gender}}</div>
        <hr>
        <!-- 下拉框 -->
        <label for="food">食物：</label>
        <select name="food" id="food" v-model="foods">
            <option value="辣条">辣条</option>
            <option value="玲儿">玲儿</option>
            <option value="主食">主食</option>
        </select>
        <div>想吃：{{foods}}</div>
        <hr>
    </template>
    <script>
        const CpnDemo = {
            // 注册组件：cpn-demo
            template: '#cpn-demo',
            data: () => {
                return {
                    comment: '',
                    intro: '',
                }
            },
            methods: {
                getType(value) {
                    console.log('comment：', this.comment)
                    console.log('intro：', this.intro)
                    return typeof value;
                }
            },
        };
        const CpnFavorite = {
            // 注册组件cpn-favorite
            template: '#cpn-favorite',
            data: () => {
                return {
                    favorite: [],
                }
            },
        };
        const CpnLike = {
            template: '#cpn-like',
            data: () => {
                return {
                    gender: 'boy',
                    foods: '玲儿'
                }
            },
        };
        const HelloVueApp = {
            template: `#demoRef`,
            data: () => {
                return {
                }
            },
            components:{
                // 支持驼峰方式注册 - CpnDemo：CpnDemo, 
                // 使用时建议 - 方式，只在cli里支持 驼峰式标签
                CpnDemo,
                'cpn-favorite':CpnFavorite,
                CpnLike,
            }
        }
        Vue.createApp(HelloVueApp).mount('#root')
    </script>
</body>

</html>
```
### 相关参考文章
* [coderwhy老师 - vue3课程](https://ke.qq.com/course/3453141)
* [从 vue3 和 vite 源码中，我学到了一行代码统一规范团队包管理器的神器](https://blog.csdn.net/weixin_40906515/article/details/121668177)