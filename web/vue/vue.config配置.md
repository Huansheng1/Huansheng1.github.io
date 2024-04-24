# vue.config.js配置
## vue.config.js
`vue.config.js` 是一个可选的配置文件，如果项目的 (和 `package.json` 同级) 根目录中存在这个文件，那么它会被 `@vue/cli-service` 自动加载。
### 跨域代理配置
如果你的前端应用和后端 `API` 服务器没有运行在同一个主机上，你需要在开发环境下将 `API` 请求代理到 `API` 服务器。这个问题可以通过 `vue.config.js` 中的 `devServer.proxy` 选项来配置。
> 注意：该方式只适合于开发环境的测试，其本质是通过`nodeJs`服务绕过浏览器的跨域限制，在浏览器上访问跨域`api`时，`nodeJs`将请求拦截更换为设置的代理域名访问；再将结果转发会我们前端从而让浏览器以为我们是同源访问而避免了跨域访问不将数据给我们`JavaScript`的问题。

> 因此，产品在生产环境上发布时，`Api`跨域还是得通过`CORS`、`JSONP`、`Nginx`等方式避免跨域。
```js
module.exports = {   
devServer:{
    host: 'localhost',//本地开发服务测试 host
    // host: '0.0.0.0',//如果是真机测试，就使用这个IP
    port: 8080,// 端口，可修改
    https: false,
    hotOnly: false,
    // 告诉开发服务器将任何未知请求 (没有匹配到静态文件的请求) 代理到http://localhost:4000
    // proxy: 'http://localhost:4000'
    proxy:{
        '/api':{
            target: 'http://192.168.1.30:8085',//代理地址，这里设置的地址会代替我们api请求的baseURL
            changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
            // logLevel: 'debug',
            //ws: true, // proxy websockets是否代理websockets
            //pathRewrite方法重写url，使得api请求能保持一致
            pathRewrite: {
                '^/api': '' // 将api请求地址里/api去除，实际请求为 http://192.168.1.30:8085/xxxx
                //pathRewrite: {'^/api': '/'} 重写之后实际请求url为 http://192.168.1.16:8085/xxxx，也就是将api这个去除了
                //pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
           }
    },// 可代理多个接口
      '/paladin': {
        target: 'http://bbb.ziroom.com',
        changeOrigin: true,
        pathRewrite: {
          '^/paladin': ''
        }
      }
  }
},
//...
}
```
实际测试一下：
```js
devServer: {
    // open: true,// 自动打开浏览器，但好像有问题会导致端口冲突。
    // host: '127.0.0.1', // 只能是localhost或者127.0.0.1这种Ip地址，没啥可改的
    proxy: {
      '/api': {
        target: 'https://api.apiopen.top', // 代理地址
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/api': '/'// pathRewrite将api去除使得真实接口能正常获取
        }
      }
    }
  }
```
结果：
![](https://cdn.jsdelivr.net/gh/Huansheng1/myimg/PicGo/20200722144959.png)

解析：
* 浏览器以为我们请求的接口是：`http://localhost:8080/api/todayVideo`
* 实际上经过`nodeJs`的中间代理拦截，其实真实访问的是`https://api.apiopen.top/todayVideo`，中间件再将数据返回给我们浏览器
* 于是浏览器以为是同源请求并获得结果，其实是中间件拦截转发了一次
* 当然，因此这只适合开发环境，实际生产环境还得用`ngnix`等服务器代理处理。

更多：  
* [devServer之proxy跨域](https://blog.csdn.net/mobile18611667978/article/details/100545882)
* [Vue项目devServer.proxy代理配置详解](https://www.jianshu.com/p/8493282fe232)
* [Vue项目devServer.proxy代理配置详解](https://www.jianshu.com/p/8493282fe232)
* [详解Webpack-dev-server的proxy用法](https://www.jb51.net/article/147081.htm)
### 关闭SourceMap生成功能
```js
productionSourceMap:false
```
这样能避免我们线上环境将源码暴露，也能加快打包速度！

> [配置参考 | Vue CLI](https://cli.vuejs.org/zh/config/#productionsourcemap)
### 彻底删除js预加载
```js
// 删除js预加载功能，真正做到只在使用时加载
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  }
```
## 完整配置
```js
// vue.config.js
const path =  require('path');

const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/site/vue-demo/' : '/',  // 公共路径
    indexPath: 'index.html' , // 相对于打包路径index.html的路径
    outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
    assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: !IS_PROD, // 生产环境的 source map
    parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    pwa: {}, // 向 PWA 插件传递选项。
    chainWebpack: config => {
        config.resolve.symlinks(true); // 修复热更新失效
        // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        config.plugin("html").tap(args => {
            // 修复 Lazy loading routes Error
            args[0].chunksSortMode = "none";
            return args;
        });
        // 删除预加载功能
        config.plugins.delete("prefetch");
        config.resolve.alias // 添加别名
            .set('@', resolve('src'))
            .set('@assets', resolve('src/assets'))
            .set('@components', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@store', resolve('src/store'));
        // 压缩图片
        // 需要 npm i -D image-webpack-loader
        config.module
            .rule("images")
            .use("image-webpack-loader")
            .loader("image-webpack-loader")
            .options({
                mozjpeg: { progressive: true, quality: 65 },
                optipng: { enabled: false },
                pngquant: { quality: [0.65, 0.9], speed: 4 },
                gifsicle: { interlaced: false },
                webp: { quality: 75 }
            });
        // 打包分析
        // 打包之后自动生成一个名叫report.html文件(可忽视)
        if (IS_PROD) {
            config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
                {
                    analyzerMode: "static"
                }
            ]);
        }
    },
    configureWebpack: config => {
        // 开启 gzip 压缩
        // 需要 npm i -D compression-webpack-plugin
        const plugins = [];
        if (IS_PROD) {
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: "[path].gz[query]",
                    algorithm: "gzip",
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
        }
        config.plugins = [...config.plugins, ...plugins];
    },
    css: {
        extract: IS_PROD,
        requireModuleExtension: false,// 去掉文件名中的 .module
        loaderOptions: {
                // 给 less-loader 传递 Less.js 相关选项
                less: {
                    // `globalVars` 定义全局对象，可加入全局变量
                    globalVars: {
                        primary: '#333'
                    }
                }
        }
    },
    devServer: {
            overlay: { // 让浏览器 overlay 同时显示警告和错误
              warnings: true,
              errors: true
            },
            host: "localhost",
            port: 8080, // 端口号
            https: false, // https:{type:Boolean}
            open: false, //配置自动启动浏览器
            hotOnly: true, // 热更新
            // proxy: 'http://localhost:8080'   // 配置跨域处理,只有一个代理
            proxy: { //配置多个跨域
                "/api": {
                    target: "http://172.11.11.11:7071",
                    changeOrigin: true,
                    // ws: true,//websocket支持
                    secure: false,
                    pathRewrite: {
                        "^/api": "/"
                    }
                },
                "/api2": {
                    target: "http://172.12.12.12:2018",
                    changeOrigin: true,
                    //ws: true,//websocket支持
                    secure: false,
                    pathRewrite: {
                        "^/api2": "/"
                    }
                },
            }
        }
}
```
## 参考资料
* [配置参考 | Vue CLI](https://cli.vuejs.org/zh/config/#devserver-proxy)
* [Vue.js CLI4 Vue.config.js标准配置 （最全注释）](https://juejin.im/post/5e944010f265da47aa3f68db)
* [vue-cli3.0之vue.config.js的配置项（注解）](https://juejin.im/post/5c6529376fb9a049e3089cea)
* [vue.config.js 基本配置](https://juejin.im/post/5c77d0b9e51d455fb110c394)
* [vue-cli 3.x vue.config.js配置（包含webpack）](https://juejin.im/post/5d42a693f265da03ce39b76f)
* [vue-cli4-config | vue-cli3配置vue.config.js持续更新](https://staven630.github.io/vue-cli4-config/)