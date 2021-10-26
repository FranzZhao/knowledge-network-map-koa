/**
 * 将所有的router注册到app中的脚本文件
 */

// 读取目录
const fs = require('fs');

module.exports = (app) => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file === 'index.js') {return ;} //不读自己
        const route = require(`./${file}`);
        app.use(route.routes()).use(route.allowedMethods());
    });
};