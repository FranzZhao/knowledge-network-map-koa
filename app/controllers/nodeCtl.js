const Nodes = require('../models/nodesSchema');
const Graphs = require('../models/graphsSchema');
class NodeCtl {
    // 新建特定graph下的知识节点
    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            tags: { type: 'array', itemType: 'string', required: true },
            introduction: { type: 'string', required: true },
            size: { type: 'number', required: true },
            color: { type: 'string', required: true },
        });
        // 1. 创建知识节点
        const node = await new Nodes({
            author: ctx.state.user._id,
            graph: ctx.params.graphId,
            ...ctx.request.body,
        }).save();
        // 2. 将知识节点挂到graph下
        const graph = await Graphs.findById(ctx.params.graphId);
        let newGraphNodes = graph.nodes;
        newGraphNodes.push(node.id);
        // console.log(newGraphLinks);
        await Graphs.findByIdAndUpdate(
            ctx.params.graphId,
            {nodes: newGraphNodes}
        );
        // 3. 输出新的知识节点
        ctx.body = node;
    }

    // 查找特定graph下的所有知识节点
    async find(ctx) {
        const allNodes = await Nodes.find({
            author: ctx.state.user._id,
            graph: ctx.params.graphId,
        });
        ctx.body = allNodes;
    }

    // 查看特定graph下的特定知识点
    async findById(ctx) {
        const node = await Nodes.find({
            _id: ctx.params.id,
        });
        ctx.body = node;
    }

    // 更新在特定graph下特定知识节点
    async update(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            tags: { type: 'array', itemType: 'string', required: false },
            introduction: { type: 'string', required: false },
            size: { type: 'number', required: false },
            color: { type: 'string', required: false },
            Notebooks: { type: 'array', itemType: 'string', required: false },
            state: { type: 'number', required: false },
        });
        const node = await Nodes.findByIdAndUpdate(
            ctx.params.id, ctx.request.body, {new: true}
        );
        ctx.body = node;
    }
}

module.exports = new NodeCtl();