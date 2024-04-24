module.exports = [
    {
        text: "搭建指南",
        link: "/guide/", //指定导航栏文字下的链接路径，如无link则无法点击
    },
    {
        text: "MD相关",
        link: "/markdown/",
    },
    {
        text: "工具经验",
        link: "/tools/",
    },
    {
        text: "学习资料",
        items: [
            {
                text: "博客社区",
                items: [
                    { text: "掘金", link: "https://juejin.im/" },
                    { text: "思否", link: "https://segmentfault.com/" },
                    { text: "stackoverflow", link: "https://stackoverflow.com/" },
                    { text: "牛客网", link: "https://www.nowcoder.com/" },
                    { text: "知乎", link: "https://www.zhihu.com/" },
                    { text: "阮一峰", link: "http://www.ruanyifeng.com/home.html" },
                    { text: "LeetCode", link: "https://leetcode-cn.com/" },
                ],
            },
            {
                text: "开源网站",
                items: [
                    { text: "github", link: "https://github.com/" },
                    { text: "码云gitee", link: "https://gitee.com/" },
                ],
            },
            {
                text: "框架编程",
                items: [
                    { text: "Vue", link: "https://cn.vuejs.org/index.html" },
                    { text: "Uni-app", link: "https://uniapp.dcloud.io/" },
                    { text: "Webpack", link: "https://www.webpackjs.com/" },
                ],
            },
            {
                text: "学习教程",
                link: "http://xuexizuoye.com",
                items: [
                    { text: "哔哩哔哩", link: "https://bilibili.com/" },
                    { text: "MDN文档", link: "https://developer.mozilla.org/zh-CN/" },
                    { text: "菜鸟教程", link: "https://www.runoob.com/" },
                    { text: "吾爱破解", link: "https://52pojie.cn/" },
                    {
                        text: "Vue渲染器源码解析文档",
                        link: "http://hcysun.me/vue-design/zh/",
                    },
                    {
                        text: "Vue源码解析文档",
                        link: "https://ustbhuangyi.github.io/vue-analysis/",
                    },
                ],
            },
            {
                text: "资源书籍",
                items: [
                    {
                        text: "软件合集",
                        link: "https://github.com/91CL/91CL-Softwares/wiki",
                    },
                    { text: "epubw", link: "https://epubw.com/" },
                    { text: "SoBooks", link: "https://sobooks.cc/" },
                ],
            },
        ],
    },
    {
        text: "前端知识",
        //link: '/web/',//有分类的情况下不推荐给上级目录页加上可点击路径
        items: [
            //面试宝典导航下的子分类导航
            { text: "Html", link: "/web/html/" }, //设置点击该导航时跳转路径，默认寻找该目录下的README.md文件
            { text: "Css", link: "/web/css/" },
            { text: "JavaScript", link: "/web/js/" },
            { text: "Vue", link: "/web/vue/" },
            { text: "网络相关", link: "/web/network/" },
            { text: "浏览器知识", link: "/web/browser/" },
            { text: "Webpack", link: "/web/webpack/" },
            { text: "NodeJs", link: "/web/nodejs/" },
            { text: "小程序", link: "/web/小程序/" },
            { text: "Angular", link: "/web/angular/" },
            { text: "React", link: "/web/react/" },
            { text: "性能优化与监控", link: "/web/性能优化与监控/" },
            { text: "面试题库与知识", link: "/web/interview-ready/" },
        ],
    },
    {
        text: "推荐与插件", //items里面可以嵌套新的导航{}，推荐最多两级导航，不然嵌套不清晰
        items: [
            {
                text: "服务器",
                items: [
                    { text: "阿里云", link: "https://www.aliyun.com/" },
                    { text: "腾讯云", link: "https://cloud.tencent.com/" },
                ],
            },
            {
                text: "图片相关",
                items: [
                    { text: "图片压缩", link: "https://tinypng.com/" }, //外部链接
                    { text: "sm永久免费图床", link: "https://sm.ms/" },
                    {
                        text: "Cutterman-PS切图插件",
                        link: "http://www.cutterman.cn/zh/cutterman",
                    },
                    { text: "蓝湖lanhuapp-自动切图", link: "https://www.lanhuapp.com/" },
                    { text: "凡科快图", link: "https://kt.fkw.com/" },
                    { text: "稿定设计", link: "https://ps.gaoding.com/" },
                    { text: "一键AI抠图", link: "https://www.remove.bg/zh" },
                    { text: "wallhaven壁纸", link: "https://wallhaven.cc/" },
                ],
            },
            {
                text: "美丽配色",
                items: [
                    { text: "Color Hunt", link: "http://colorhunt.co/" },
                    {
                        text: "Adobe Color CC",
                        link: "https://color.adobe.com/zh/create/color-wheel",
                    },
                    {
                        text: "LOLCOLORS",
                        link: "https://www.webdesignrankings.com/resources/lolcolors",
                    },
                    { text: "随机COLOR", link: "http://color.aurlien.net/" },
                    { text: "渐变配色uigradients", link: "https://uigradients.com/" },
                    {
                        text: "渐变配色bestvist",
                        link: "https://www.bestvist.com/css-gradient",
                    },
                    { text: "coolors", link: "https://coolors.co/" },
                ],
            },
            {
                text: "文章画图",
                items: [
                    { text: "GitMind- 免费在线思维导图", link: "https://gitmind.cn/" },
                    { text: "幕布-一键生成导图", link: "https://mubu.com/" },
                    { text: "Process On", link: "https://www.processon.com/" },
                    { text: "语雀", link: "https://www.yuque.com/yuque" },
                    { text: "Mdnice - MD美化换主题", link: "https://mdnice.com/" },
                ],
            },
            {
                text: "代码相关",
                items: [
                    { text: "Carbon - 美化代码片段截图", link: "https://carbon.now.sh/" },
                    { text: "CanIuse - 兼容性查询", link: "https://www.caniuse.com/" },
                    {
                        text: "Prettier - Playground 代码在线格式化",
                        link: "https://prettier.io/playground/",
                    },
                ],
            },
            {
                text: "组件图标",
                items: [
                    { text: "Iconfont 图标库", link: "https://www.iconfont.cn/" },
                    { text: "CanIuse - 兼容性查询", link: "https://www.caniuse.com/" },
                    { text: "Element-ui", link: "https://element.eleme.cn/#/zh-CN" },
                    { text: "免费字体", link: "https://www.fontspace.com/" },
                    {
                        text: "undraw - 免费可商用自定义颜色图表库",
                        link: "https://undraw.co/illustrations",
                    },
                ],
            },
            {
                text: "网络API",
                items: [
                    { text: "Postwoman 接口调试利器", link: "https://postwoman.io/" },
                ],
            },
            {
                text: "浏览器及插件",
                items: [
                    {
                        text: "FeHelper-WEB开发助手",
                        link:
                            "https://chrome.google.com/webstore/detail/fehelper%E5%89%8D%E7%AB%AF%E5%8A%A9%E6%89%8B/pkgccpejnmalmdinmhkkfafefagiiiad",
                    },
                    {
                        text: "Octotree-Github项目结构树",
                        link:
                            "https://chrome.google.com/webstore/detail/octotree/bkhaagjahfmjljalopjnoealnfndnagc",
                    },
                    {
                        text: "Postman-API测试神器",
                        link:
                            "https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop",
                    },
                    {
                        text: "Tampermonkey-油猴脚本",
                        link:
                            "https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo",
                    },
                    { text: "Ghelper-谷歌上网助手", link: "http://googlehelper.net/" },
                    {
                        text: "Astar VPN",
                        link:
                            "https://chrome.google.com/webstore/detail/astar-vpn-free-and-fast-v/jajilbjjinjmgcibalaakngmkilboobh?hl=zh-CN",
                    },
                    { text: "IG谷歌访问助手", link: "https://iguge.app/" },
                    {
                        text: "谷歌访问助手破解版",
                        link:
                            "https://github.com.cnpmjs.org/wuxiumu/Google-Browser-Assistant",
                    },
                ],
            },
        ],
    },
    {
        text: "胡扯文章",
        link: "/article/",
    },
    {
        text: "项目源码",
        link: "/copyleft/",
    },
];
