const Nodes = require('../models/nodesSchema');
const Graphs = require('../models/graphsSchema');
const Notebooks = require('../models/notebooksSchema');
const Links = require('../models/linksSchema');
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
            { nodes: newGraphNodes }
        );
        // 3. 输出新的知识节点
        ctx.body = node;
    }

    // 查找特定graph下的所有知识节点
    async find(ctx) {
        const allNodes = await Nodes.find({
            author: ctx.state.user._id,
            graph: ctx.params.graphId,
            state: 1,
        });
        ctx.body = allNodes;
    }

    // 查看特定graph下的特定知识点
    async findById(ctx) {
        const node = await Nodes.find({
            _id: ctx.params.id,
            state: 1,
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
            ctx.params.id, ctx.request.body, { new: true }
        );
        ctx.body = node;
    }

    // 删除知识节点
    async delete(ctx) {
        // 1. 找到对应nodeId的知识节点并设置state=0
        const node = await Nodes.findByIdAndUpdate(
            ctx.params.id,
            { state: 0 },
            { new: true }
        );
        // 2. 找到node对应的graph并删除nodes Array中的nodeId
        const graph = await Graphs.findById(node.graph);
        let nodeIndex = 0;
        graph.nodes.map((node, index) => {
            if (node.toString() === ctx.params.id){
                nodeIndex = index;
            }
        });
        graph.nodes.splice(nodeIndex, 1);
        const newNodes = graph.nodes;
        await Graphs.findByIdAndUpdate(
            node.graph,
            {nodes: newNodes},
            {new: true}
        );
        // 3. 找到node下面的所有notebook, 并设置state=0, 并且使node的Notebooks为空
        const nodeNotebooks = node.Notebooks;
        for (let i in nodeNotebooks) {
            await Notebooks.findByIdAndUpdate(
                nodeNotebooks[i], { state: 0 }
            );
        }
        await Nodes.findByIdAndUpdate(
            ctx.params.id,
            { Notebooks: [] },
        );
        // 4. 删除与该node相关联的所有link以及这些link下面的notebook, state=0
        // 4-1. 找到所有的相关的link
        const sourceLink = await Links.find({
            source: ctx.params.id
        });
        const targetLink = await Links.find({
            target: ctx.params.id
        });
        // 4-2. 将link的state设为0, 并将下面所有的笔记都设置state=0
        for (let i in sourceLink) {
            // 4-2-1. 设置link的state
            await Links.findByIdAndUpdate(
                sourceLink[i]._id, { state: 0 }
            );
            // 4-2-2. 设置notebook的state
            const currentLinkNotes = sourceLink[i].Notebooks;
            for (let j in currentLinkNotes) {
                await Notebooks.findByIdAndUpdate(
                    currentLinkNotes[j], { state: 0 }
                );
            }
        }
        for (let i in targetLink) {
            // 4-2-1. 设置link的state
            await Links.findByIdAndUpdate(
                targetLink[i]._id, { state: 0 }
            );
            // 4-2-2. 设置notebook的state
            const currentLinkNotes = targetLink[i].Notebooks;
            for (let j in currentLinkNotes) {
                await Notebooks.findByIdAndUpdate(
                    currentLinkNotes[j], { state: 0 }
                );
            }
        }
        // 4-3. 获取要删除的link和relations
        let deleteLinks = [];
        let deleteRelationsName = [];
        sourceLink.map(link => {
            deleteLinks.push(link._id);
            deleteRelationsName.push(link.name);
        });
        targetLink.map(link => {
            deleteLinks.push(link._id);
            deleteRelationsName.push(link.name);
        });
        // 4-4. 更新graph中的link和relations
        let newGraphLinks = graph.links;
        let newGraphRelations = graph.relations;
        deleteLinks.map(delLink => {
            newGraphLinks.map((graphLink, index) => {
                if (graphLink.toString() === delLink.toString()){
                    newGraphLinks.splice(index, 1);
                }
            });
        });
        deleteRelationsName.map(delLink => {
            newGraphRelations.map((graphLink, index) => {
                if (graphLink === delLink){
                    newGraphRelations.splice(index, 1);
                }
            });
        });
        // 4-5. 写入到graph中
        await Graphs.findByIdAndUpdate(
            node.graph,
            {
                links: newGraphLinks,
                relations: newGraphRelations
            }
        );
        // 5. 返回新的节点信息列表
        const newNodeList = await Nodes.find({
            author: ctx.state.user._id,
            graph: ctx.params.graphId,
            state: 1,
        });
        ctx.body = newNodeList;
    }
}

module.exports = new NodeCtl();