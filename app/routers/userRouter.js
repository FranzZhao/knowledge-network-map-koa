const Router = require('koa-router');
const jwt = require('koa-jwt');
// UserCtl
const {
    login, register, jwtVerify
} = require('../controllers/userCtl');

// env
const secret = process.env.TOKEN_SECRET;

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
router.post('/login', login);

// 用户注册
router.post('/register', register);

// 用户jwt有效性验证
router.get('/jwt', auth, jwtVerify);

module.exports = router;