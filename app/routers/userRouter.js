const Router = require('koa-router');
const jwt = require('koa-jwt');
const { secret } = require('../config');

// 实例化路由+路由统一前缀
const router = new Router({
    prefix: '/user'
});

// 用户认证与授权中间件
const auth = jwt({ secret });

/**
 * User Router
 */
// 用户登录
router.post('/login', );
// 用户注册
router.post('/register', );

module.exports = router;