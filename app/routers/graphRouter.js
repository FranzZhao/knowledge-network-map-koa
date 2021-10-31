const Router = require('koa-router');
const jwt = require('koa-jwt');
const {
    findById, update
} = require('../controllers/graphCtl');
// env
const secret = process.env.TOKEN_SECRET;

// 实例化路由+路由统一前缀
const router = new Router({
    prefix: '/map/:mapId/graph'
});

// 用户认证与授权中间件
const auth = jwt({ secret });

/**
 * Map Router
 */
// 新建knm知识地图
// router.post('/', auth, create);

// 获取指定的knm知识地图
router.get('/', auth, findById);

// 更新指定的knm知识地图(put整体, patch部分)
router.patch('/:id', auth, update);

module.exports = router;