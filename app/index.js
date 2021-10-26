// 引入Koa
const Koa = require('koa');
// 请求体解析中间件
const koaBody = require('koa-body');
const path = require('path');
// 将Koa实例化为app
const app = new Koa();
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
// 导入配置
const {
    connectionStr
} = require('./config');

// 链接MongoDB
mongoose.connect(
    connectionStr,
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
app.listen(3000, () => {
    console.log('Program running in prot 3000');
});