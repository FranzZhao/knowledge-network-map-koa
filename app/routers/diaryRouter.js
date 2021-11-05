const Router = require('koa-router');
const jwt = require('koa-jwt');
const {
    create, update, find, findById, delete: del
} = require('../controllers/diaryCtl');
// env
const secret = process.env.TOKEN_SECRET;

// 实例化路由+路由统一前缀
const router = new Router({
    prefix: '/user/diary'
});

// 用户认证与授权中间件
const auth = jwt({ secret });

/**
 * Map Router
 */
// 新建日志
router.post('/', auth, create);

// 更新日志
router.patch('/:id', auth, update);

// 获取用户所有日志
router.get('/', auth, find);

// 获取特定的日志
router.get('/:id', auth, findById);

// delete diary
router.delete('/:id', auth, del);

module.exports = router;