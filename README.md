# knowledge-network-map-koa
A Knowledge Network Map's Server develop by Node.js &amp; Koa2

## 1. Project Dependencies
- Koa2
- nodemon
- koa-router
- koa-json-error
- cross-env
- mongoose
- jsonwebtoken
- koa-jwt
- koa-body
- koa-static
- koa-parameter
- dotenv-cli
- koa2-cors


使用koa2-cors解决跨域问题, 因为在域名、端口、协议其中有一项不一样时就会存在跨域, 这是网络请求的安全限制, 那么如何在前后端分离的项目中让前端可以访问到后端的api呢? 对于koa2应用可以使用koa2-cors

在入口文件中引入koa2-cors并配置中间件即可

```js
// import koa2-cors 跨域
const cors = require('koa2-cors');
// Koa跨域实现
app.use(
    cors({
        origin: function (ctx) {
            return ctx.header.origin; //只允许http://localhost:8080这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
    })
);
```
