// 引入Koa
const Koa = require('koa');
// 请求体解析中间件
const koaBody = require('koa-body');
const path = require('path');
// 将所有的路由注册到app中的脚本文件
const routing = require('./routers');
// 注册错误信息
const error = require('koa-json-error');
// 参数校验
const parameter = require('koa-parameter');
// 引入Mongoose
const mongoose = require('mongoose');
// 引入koa-static
const koaStatic = require('koa-static');
// import koa2-cors 跨域
const cors = require('koa2-cors');

// import dotenv
const dotenv = require('dotenv');
dotenv.config();

// 将Koa实例化为app
const app = new Koa();
// Koa跨域实现
app.use(
    cors({
        origin: function (ctx) {
            return ctx.header.origin; //只允许http://localhost:8080这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'PUT'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
    })
);

// 链接MongoDB
mongoose.connect(
    // connectionStr
    process.env.MONGODB_CONNECTION,
    {
        useNewUrlParser: true,
    },
    // 成功连接后的回调函数
    () => console.log('MongoDB Connect Success!')
);
// 监听错误和警告信息
mongoose.connection.on('error', console.error)

// 静态文件: 通常在最前面
app.use(koaStatic(
    path.join(__dirname, '/public')
));
// 自定义的错误处理中间件
app.use(error({
    // 定制返回格式: 生产环境下不返回堆栈信息
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));
app.use(koaBody({
    multipart: true, //支持文件格式
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'), //文件上传目录
        keepExtensions: true,       // 保留文件拓展名
    }
}));
// 参数校验
app.use(parameter(app));
// 路由入口
routing(app);

// 监听的端口
app.listen(3001, () => {
    console.log('Program running in prot 3001');
});