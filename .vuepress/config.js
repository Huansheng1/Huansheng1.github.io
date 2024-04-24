// 一个 VuePress 网站必要的配置文件
// const path = require('path');
module.exports = { //这个js变动时本地调试服务会自动重新 启动服务刷新网页，但是md文件改动保存是无法检测到的
    title: '幻生博客 - 不自卑，不焦虑，踏实向前', //网站标题
    description: '幻生前端开发博客，记录编程点点滴滴，前端自学,前端体系巩固,前端工程师,前端自学,高级前端工程师,中高级前端工程师,前端进阶知识,前端职业发展,前端进阶,高级前端,前端面试,幻生,vue,vuepress,vuepress技术博客,前端,blog,vuepress-blog,golang,script,windows,git,小程序', //网站描述，如有错误，敬请提交意见与指导，QQ：2933903535
    // keywords: '幻生,vue,vuepress,vuepress技术博客,前端,blog,vuepress-blog,golang,script,windows,git,小程序', // 关键字，貌似无效，不生效。
    //vuepress默认使用.vuepress/public存放静态资源(可以修改)，在config.js中base值会影响静态资源引用路径。 
    //一个 base 路径一旦被设置，它将会自动地作为前缀插入到 .vuepress/config.js 中所有以 / 开始的资源路径中。
    base: '/', //base 属性的默认值是 /。设置站点根路径，如果你在访问的地址是 'www.xxxx.com/wxDocs' 那么就设置成 '/wxDocs/'  
    dest: './dist', //指定编译路径，该处为根目录下的dist文件夹，VuePress默认路径为.vuepress/dist文件夹
    port: '7788', //指定端口号
    head: [
        ['link', { rel: 'icon', href: '/img/logo.png' }], //头部引入logo图片，也可引入CSS/JS，public目录
        ['meta', { 'name': 'viewport', content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" }],
        ['meta', { name: 'referrer', content: 'never' }],
        ['script', { type: 'text/javascript', src: '/js/load.js' }],
    ],
    markdown: {
        lineNumbers: true // 是否在每个代码块的左侧显示行号。
    },
    themeConfig: {
        nav: require("./nav.js"), //引入抽离的网站nav导航栏设置，.js后缀可省略
        //(42) vuepress自动生成侧边栏分组小函数 - https://segmentfault.com/a/1190000021875444?utm_source=tag-newest
        sidebar: 'auto', //require("./sidebar.js"), //注：sidebar: 'auto'表示自动通过md内容生成左边侧边栏
        sidebarDepth: 2, //同时提取markdown中h2 和 h3 标题，显示在侧边栏上
        lastUpdated: '最后更新时间：', // 文档更新时间：每个文件git最后提交的时间
        searchMaxSuggestoins: 10, //搜索结果最大数量
        author: '幻生',
        serviceWorker: {
            updatePopup: {
                message: "有新的内容.",
                buttonText: '更新'
            }
        },
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页 ！',
        // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
        nextLinks: false,// 上一篇和下一篇文章的链接将会自动地根据当前页面的侧边栏的顺序来获取。
        // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
        prevLinks: false,
        smoothScroll: true//页面滚动效果
    },
    configureWebpack: {
        resolve: {
            alias: { //目录别名
                // "@": require("path").resolve(__dirname, "/"), //相对于config.js文件的路径->.vuepress目录
                // 'img': '/img', //MD文件里可这样使用别名  ![](~@img/003.png)
                // '@js': path.join(__dirname, '../js'),
                // '@web': path.join(__dirname, '../web'),
                // '@copyleft': path.join(__dirname, '../copyleft'),
                // '@article': path.join(__dirname, '../article'),
                // '@guide': path.join(__dirname, '../guide'),
                // '@tools': path.join(__dirname, '../tools')
            }
        }
    }
}
    // 自定义搜索：VuePress搭建个人技术文档网站教程 - 个人文章 - https://segmentfault.com/a/1190000017055963?utm_source=tag-newest