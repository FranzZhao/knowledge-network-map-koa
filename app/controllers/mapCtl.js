// import data Schema
const Maps = require('../models/mapsSchema');
const Graphs = require('../models/graphsSchema');
const Nodes = require('../models/nodesSchema');
const Links = require('../models/linksSchema');
const Notebooks = require('../models/notebooksSchema');



class MapCtl {
    // get knm lists: the users only see their own maps
    async find(ctx) {
        const maps = await Maps.find({
            author: ctx.state.user._id,
            state: 1,
        }).populate('author');
        ctx.body = maps;
    }

    // create a new knm
    async create(ctx) {
        // 1. 先创建一个knm
        ctx.verifyParams({
            title: { type: 'string', required: true },
            tags: { type: 'array', itemType: 'string', required: true },
            introduction: { type: 'string', required: true },
            emoji: { type: 'string', required: true },
        });
        const newMap = await new Maps({
            ...ctx.request.body,
            author: ctx.state.user._id
        }).save();
        // 2. 再创建一个graph, graph属于一个knm, 一对一的关系
        const newGraph = await new Graphs({
            author: ctx.state.user._id,
            knm: newMap._id,
            knmId: newMap._id,
            nodes: [],
            links: [],
            relations: [],
        }).save();
        ctx.body = newMap;
    }

    // get a knm detail info
    async findById(ctx) {
        const map = await Maps.findOne({
            _id: ctx.params.id,
            author: ctx.state.user._id
        }).populate('author');
        if (!map) {
            ctx.throw(404, '知识地图不存在');
        }
        ctx.body = map;
    }

    // update a knm
    async update(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: false },
            tags: { type: 'array', itemType: 'string', required: false },
            introduction: { type: 'string', required: false },
            emoji: { type: 'string', required: false },
            state: { type: 'number', required: false }
        });
        const map = await Maps.findByIdAndUpdate(
            ctx.params.id,
            ctx.request.body
        );
        ctx.body = map;
    }

    // delete graph
    async delete(ctx) {
        // 1. delete knm map
        const map = await Maps.findByIdAndUpdate(
            ctx.params.id,
            { state: 0 },
            { new: true }
        );
        // 2. 获取knm下面的graph(graph没有state), 并使用graph找到knm下所有的node\link\notebook
        const graph = await Graphs.findOne({
            knm: map._id
        }).populate('nodes links');
        const nodes = graph.nodes;
        const links = graph.links;
        // 2-1. delete nodes & its notebooks
        for (let i in nodes) {
            // 2-1-1. set node state = 0
            const node = await Nodes.findByIdAndUpdate(
                nodes[i]._id,
                { state: 0 },
                { new: true }
            );
            const nodeNotes = node.Notebooks;
            // 2-1-2. set notebooks state = 0
            for (let j in nodeNotes) {
                await Notebooks.findByIdAndUpdate(
                    nodeNotes[j],
                    { state: 0 }
                )
            }
        }
        // 2-2. delete nodes & its notebooks
        for (let i in links) {
            // 2-2-1. set node state = 0
            const link = await Links.findByIdAndUpdate(
                links[i]._id,
                { state: 0 },
                { new: true }
            );
            const linkNotes = link.Notebooks;
            // 2-2-2. set notebooks state = 0
            for (let j in linkNotes) {
                await Notebooks.findByIdAndUpdate(
                    linkNotes[j],
                    { state: 0 }
                )
            }
        }
        // 3. return new knm
        const newMaps = await Maps.find({
            author: ctx.state.user._id,
            state: 1,
        }).populate('author');
        ctx.body = newMaps;
    }
}

module.exports = new MapCtl();