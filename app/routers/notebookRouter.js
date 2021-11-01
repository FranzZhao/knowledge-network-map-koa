const Router = require('koa-router');
const jwt = require('koa-jwt');
const {
    create, find, findById, update, findAll
} = require('../controllers/notebookCtl');
const secret = process.env.TOKEN_SECRET;

// 实例化路由+路由统一前缀
const router = new Router({
    prefix: '/graph/:graphId'
});

// 用户认证与授权中间件
const auth = jwt({ secret });

/**
 * Node Router
 */
// 查找map下所有node&link的所有知识笔记
router.get('/allNotebook', auth, findAll);

// 新建知识笔记
router.post('/:target/:targetId/notebook', auth, create);

// 查找node/link下的所有知识笔记
router.get('/:target/:targetId/notebook', auth, find);

// 查找node/link下特定id的知识笔记
router.get('/:target/:targetId/notebook/:id', auth, findById);

// 更新node/link下特定id的知识笔记
router.patch('/:target/:targetId/notebook/:id', auth, update);

module.exports = router;