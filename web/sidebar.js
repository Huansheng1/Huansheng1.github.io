module.exports = [ //进入前端知识 时 侧边栏 显示内容文件的路径
    //tips: 你在config.js里配置的名字，要和你在文件夹下新建的名字一致，但是实际侧边栏的名字，是你在H5和app对接文档.md文件下写的第一个标题的名字
    {
        title: 'JavaScript', // 侧边栏名称
        collapsable: true, // 可折叠
        children: [
            '/blog/JavaScript/学会了ES6，就不会写出那样的代码', // 你的md文件地址
        ]
    },
    {
        title: 'CSS',
        collapsable: true,
        children: [
            '/blog/CSS/搞懂Z-index的所有细节',
        ]
    },
    {
        title: 'HTTP',
        collapsable: true,
        children: [
            '/blog/HTTP/认识HTTP-Cookie和Session篇',
        ]
    }
]