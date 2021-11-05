const Router = require('koa-router');
const jwt = require('koa-jwt');
const {
    create, find, findById, update, delete: del
} = require('../controllers/linkCtl');
const secret = process.env.TOKEN_SECRET;

// 实例化路由+路由统一前缀
const router = new Router({
    prefix: '/graph/:graphId/link'
});

// 用户认证与授权中间件
const auth = jwt({ secret });

/**
 * Link Router
 */
// 新建知识关联
router.post('/', auth, create);

// 查找graph下的所有知识关联
router.get('/', auth, find);

// 查找graph下特定id的link
router.get('/:id', auth, findById);

// 更新graph下特定id的link
router.patch('/:id', auth, update);

// delete link
router.delete('/:id', auth, del);

module.exports = router;