const Router = require('koa-router');
const jwt = require('koa-jwt');
// UserCtl
const {
    login, register, jwtVerify, uploadAvatar, getAvatar,
    staticUserKNM, checkPassword, update
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

// 上传用户头像
router.post('/avatar', auth, uploadAvatar);

// 获取用户头像
router.get('/avatar', auth, getAvatar);

// 统计用户信息
router.get('/statics', auth, staticUserKNM);

// 用户修改信息前的密码校验
router.post('/verify', auth, checkPassword);

// 更新用户信息
router.patch('/', auth, update);

module.exports = router;