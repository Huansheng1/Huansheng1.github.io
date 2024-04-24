# 胡思乱想的站长
## 禁止F12调试
部分网站不给别人查看他的网页，打开调试模式，直接自己跳断点+弹窗：  
```js
((function() {
    var callbacks = [],
        timeLimit = 50,
        open = false;
    setInterval(loop, 1);
    return {
        addListener: function(fn) {
            callbacks.push(fn);
        },
        cancleListenr: function(fn) {
            callbacks = callbacks.filter(function(v) {
                return v !== fn;
            });
        }
    }
    function loop() {
        var startTime = new Date();
        debugger;
        if (new Date() - startTime > timeLimit) {
            if (!open) {
                callbacks.forEach(function(fn) {
                    fn.call(null);
                });
            }
            open = true;
            window.stop();
            alert('不要扒我了');
            window.location.reload();
        } else {
            open = false;
        }
    }
})()).addListener(function() {
    window.location.reload();
});
```
### 粗暴解决办法
禁止断点再放行：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200617112945.png)  
### 条件断点解决
找到`debugger;`这行代码，打上断点，邮件
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200617113557.png)
再放行即可：![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200617113656.png)

更多方法：  
* [突破前端反调试--阻止页面不断debugger](https://blog.csdn.net/qq_41879417/article/details/105494582)
* [爬虫技巧:突破前端反调试(无限debugger)](https://blog.csdn.net/qq_29556507/article/details/103578552)
* [你想逆向我的 js 代码？呵呵，先过了我的反 debug 再说吧！](https://zhuanlan.zhihu.com/p/80008429)

## 禁止F12和右键打开调试模式
禁止F12代码：
```js
<script type="text/javascript">

        document.onkeydown = function () {
            if (window.event && window.event.keyCode == 123) {
                event.keyCode = 0;
                event.returnValue = false;
                return false;
            }
        };
</script>
```

禁止右键代码:
```js
<script language="Javascript">
document.oncontextmenu=new Function("event.returnValue=false");
document.onselectstart=new Function("event.returnValue=false");
</script>
```
自动刷新代码:
```js
<script language="JavaScript">
function re_fresh() {
window.location.reload();
}
setTimeout('re_fresh()',15000); //指定15秒刷新一次
</script>
```
编写油猴脚本或者FD拦截预处理网页可简单解决！

