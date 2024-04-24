# 网页实现打印与Html转Pdf功能浅析
## 打印
### 克隆Html元素打印法
```js
print() {
        const contentForPrint = document.querySelector('.print-content-area');
        if (contentForPrint) {
            const allHtml = window.document.body.innerHTML;
            const printHtml = contentForPrint.outerHTML;
            window.document.body.innerHTML = printHtml;
            window.print();
            window.document.body.innerHTML = allHtml;
        } else {
            window.print();
        }
    }
```
### 设置样式直接原生打印
```html
<style>
    :root {
        --bleeding: 0.5cm;
        --margin: 1cm;
    }
    @media print {
        // 不打印的元素
        .no-print {
            display: none !important;
        }
    }

    @page {
        size: A4;
        margin: 0;
    }

    .transcript {
        display: inline-block;
        position: relative;
        height: 297mm;
        width: 210mm;
        font-size: 12pt;
        margin: 2em auto;
        padding: calc(var(--bleeding) + var(--margin));
        box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
        background: white;
    }
</style>
```
### html转为pdf再打印
