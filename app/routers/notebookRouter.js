const Router = require('koa-router');
const jwt = require('koa-jwt');
const {
    create, find, findById, update
} = require('../controllers/notebookCtl');
const secret = process.env.TOKEN_SECRET;

// 实例化路由+路由统一前缀
const router = new Router({
    prefix: '/graph/:graphId/:target/:targetId/notebook'
});

// 用户认证与授权中间件
const auth = jwt({ secret });

/**
 * Node Router
 */
// 新建知识笔记
router.post('/', auth, create);

// 查找node/link下的所有知识笔记
router.get('/', auth, find);

// 查找node/link下特定id的知识笔记
router.get('/:id', auth, findById);

// 更新node/link下特定id的知识笔记
router.patch('/:id', auth, update);

module.exports = router;