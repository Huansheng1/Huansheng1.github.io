# JavaScript常用方法
## 判断链接格式
```js
// 判断是否是视频链接
  isVideo(url = "") {
    if (!url) return false;
    let typeName = url.substring(url.lastIndexOf(".") + 1);
    return (
      typeName === "mp4" ||
      typeName === "rmvb" ||
      typeName === "avi" ||
      typeName === "flv"
    );
  }
```
## 数组移除某个成员
```js
if (!Array.prototype.remove) {
  Array.prototype.remove = function remove(item) {
    // 如果长度为零则返回空数组
    if (!this.length) return []
    // 获取当前item在当前数组的索引
    let index = this.indexOf(item)
    if (index > -1) this.splice(index, 1)
    return this
  }
}
```

更简单的方法：
```ts
removeCurrentItem(currentItem: any) {
    // 1. 通过findIndex通过对比对象数组里的成员对象的唯一属性值 得到当前成员索引
    // 2. 通过splice切除当前成员（注意，slice是取出某个索引的成员，但不改变原数组！）
    sourceArr.splice(sourceArr.findIndex(item => item.xx属性 === currentItem.fileUrl), 1);
}
```
## 检测是否是手机
```js
functon isPhone(){
  return 'ontouchend' in document
}
```
## 通过文件名判断格式
```ts
getFileExtName(fileName: string) {
        // 获取.符号的最后一个索引
        const dotIndex = fileName.lastIndexOf('.');
        let filleExtName = '';
        // 如果索引不为-1说明文件名里有.
        if (dotIndex > -1) {
            // 通过.索引取它后面的文件名扩展名
            filleExtName = fileName.substring(dotIndex + 1).toUpperCase();
        }
        // 如果没有就返回未知字符串 - UNKNOWN或者File
        return filleExtName || 'FILE';
    }
```
## 判断是否为常见图片
```ts
// 判断是否为图片扩展名
isPicture(filleExtName: string) {
    const picExtNameFilter = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'bmp', 'pic', 'svg', 'tiff'];
    return picExtNameFilter.indexOf(filleExtName.toLowerCase()) > -1;
}
```
## 复制某些内容
>注： `copy`方法只在浏览器`dev tools`面板生效，无法在代码生效

```js
// 复制内容到剪切板
function copyLink(rawStr) {
        const inputRef = document.createElement('input');
        document.body.appendChild(inputRef);
        inputRef.value = rawStr;
        inputRef.select();
        if (document.execCommand) {
            document.execCommand('copy');
            document.body.removeChild(inputRef);
            console.log('复制成功！');
        } else {
            console.error('当前浏览器不支持copy命令，请手动复制或者更换浏览器');
            document.body.removeChild(inputRef);
        }
    }
```