const Router = require('koa-router');
const jwt = require('koa-jwt');
// UserCtl
const {
    find, create, findById, update
} = require('../controllers/mapCtl');
// env
const secret = process.env.TOKEN_SECRET;

// 实例化路由+路由统一前缀
const router = new Router({
    prefix: '/map'
});

// 用户认证与授权中间件
const auth = jwt({ secret });

/**
 * Map Router
 */
// 获取用户自己所有knm知识地图列表
router.get('/', auth, find);

// 新建knm知识地图
router.post('/', auth, create);

// 获取指定的knm知识地图
router.get('/:id', auth, findById);

// 更新指定的knm知识地图(put整体, patch部分)
router.patch('/:id', auth, update);

module.exports = router;