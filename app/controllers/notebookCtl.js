const Notebooks = require('../models/notebooksSchema');
const Nodes = require('../models/nodesSchema');
const Links = require('../models/linksSchema');
const Graphs = require('../models/graphsSchema');

class NotebookCtl {
    // 创建知识笔记
    async create(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true },
            tags: { type: 'array', itemType: 'string', required: false },
            quotes: { type: 'string', required: false },
            introduction: { type: 'string', required: false },
            addPropertyName: { type: 'array', itemType: 'string', required: false },
            addPropertyContent: { type: 'array', itemType: 'string', required: false },
            text: { type: 'string', required: false },
        });
        // 1. 判断是知识节点还是知识关联的笔记
        const target = ctx.params.target;
        let newNotebook;
        if (target === 'node') {
            // 2. 新建知识笔记-知识节点
            newNotebook = await new Notebooks({
                author: ctx.state.user._id,
                relationNode: ctx.params.targetId,
                ...ctx.request.body,
            }).save();
            // 3. 关联到知识节点
            const node = await Nodes.findById(ctx.params.targetId);
            let newNodeNotebooks = node.Notebooks;
            newNodeNotebooks.push(newNotebook.id);
            await Nodes.findByIdAndUpdate(
                ctx.params.targetId,
                { Notebooks: newNodeNotebooks }
            );
        } else {
            // 2. 新建知识笔记-知识关联
            newNotebook = await new Notebooks({
                author: ctx.state.user._id,
                relationLink: ctx.params.targetId,
                ...ctx.request.body,
            }).save();
            // 3. 关联到知识节点
            const link = await Links.findById(ctx.params.targetId);
            let newNodeNotebooks = link.Notebooks;
            newNodeNotebooks.push(newNotebook.id);
            await Links.findByIdAndUpdate(
                ctx.params.targetId,
                { Notebooks: newNodeNotebooks }
            );
        }
        // 4. 输出结果
        ctx.body = newNotebook;
    }

    // 获取知识地图下所有知识节点与关联的所有知识笔记
    async findAll(ctx) {
        // 1. 获取知识地图下的所有知识节点与关联
        const graph = await Graphs.findById(ctx.params.graphId);
        const allNodes = graph.nodes;
        const allLinks = graph.links;
        // 2. 依次获取各自拥有的知识地图
        const nodeNotebooks = await Notebooks.find({
            relationNode: allNodes,
            state: 1,
        });
        const linkNotebooks = await Notebooks.find({
            relationLink: allLinks,
            state: 1,
        });
        // 3. 将所有Notebooks合并, 并发送给前端
        let allNotebooks = [...nodeNotebooks, ...linkNotebooks];
        ctx.body = allNotebooks;
    }

    // 获取知识节点或关联下的所有知识笔记
    async find(ctx) {
        const target = ctx.params.target;
        let newNotebook;
        if (target === 'node') {
            newNotebook = await Notebooks.find({
                relationNode: ctx.params.targetId,
                state: 1,
            });
        } else {
            newNotebook = await Notebooks.find({
                relationLink: ctx.params.targetId,
                state: 1,
            });
        }
        ctx.body = newNotebook;
    }

    // 获取知识节点或关联下的特定知识笔记
    async findById(ctx) {
        const target = ctx.params.target;
        let newNotebook;
        if (target === 'node') {
            newNotebook = await Notebooks.findOne({
                relationNode: ctx.params.targetId,
                _id: ctx.params.id,
            });
        } else {
            newNotebook = await Notebooks.findOne({
                relationLink: ctx.params.targetId,
                _id: ctx.params.id,
            });
        }
        ctx.body = newNotebook;
    }

    // 更新知识节点或关联下的特定知识笔记
    async update(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: false },
            tags: { type: 'array', itemType: 'string', required: false },
            quotes: { type: 'string', required: false },
            introduction: { type: 'string', required: false },
            addPropertyName: { type: 'array', itemType: 'string', required: false },
            addPropertyContent: { type: 'array', itemType: 'string', required: false },
            text: { type: 'string', required: false },
        });
        const notebook = await Notebooks.findByIdAndUpdate(
            ctx.params.id, ctx.request.body, { new: true }
        );
        ctx.body = notebook;
    }

    // 删除知识笔记
    async delete(ctx) {
        // 1. 查找对应notebookId下所关联的知识节点或知识关联
        let target;
        if (ctx.params.target === 'node') {
            target = await Nodes.findById(ctx.params.targetId);
        } else {
            target = await Links.findById(ctx.params.targetId);
        }

        // 2. 在知识节点或知识关联的Notebooks Array中去除该notebookId, 并保存到数据库
        // 2-1. 找到notebookId在Notebooks Array中的index
        let notebookIndex = 0;
        target.Notebooks.map((note, index) => {
            if (note.toString() === ctx.params.id) {
                notebookIndex = index;
            }
        });
        // 2-2. 删除
        target.Notebooks.splice(notebookIndex, 1);
        const newNotebooks = target.Notebooks;
        // 2-2. 保存到数据库中
        if (ctx.params.target === 'node') {
            await Nodes.findByIdAndUpdate(
                ctx.params.targetId,
                { Notebooks: newNotebooks },
                { new: true }
            );
        } else {
            await Links.findByIdAndUpdate(
                ctx.params.targetId,
                { Notebooks: newNotebooks },
                { new: true }
            );
        }

        // 3. 在notebook schema中将指定notebookId下的state=0
        const updateNotebookInfo = await Notebooks.findByIdAndUpdate(
            ctx.params.id,
            { state: 0 },
            { new: true }
        );

        // 4. 返回200成功码
        ctx.body = updateNotebookInfo;
    }
}

module.exports = new NotebookCtl();