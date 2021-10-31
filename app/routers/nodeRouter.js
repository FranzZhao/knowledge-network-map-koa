const Router = require('koa-router');
const jwt = require('koa-jwt');
const {
    create, find, findById, update
} = require('../controllers/nodeCtl');
const secret = process.env.TOKEN_SECRET;

// 实例化路由+路由统一前缀
const router = new Router({
    prefix: '/graph/:graphId/node'
});

// 用户认证与授权中间件
const auth = jwt({ secret });

/**
 * Node Router
 */
// 新建知识节点
router.post('/', auth, create);

// 查找graph下的所有知识节点
router.get('/', auth, find);

// 查找graph下特定id的node
router.get('/:id', auth, findById);

// 更新graph下特定id的node
router.patch('/:id', auth, update);

module.exports = router;