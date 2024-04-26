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