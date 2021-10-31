// import data Schema
const Maps = require('../models/mapsSchema');
const Graphs = require('../models/graphsSchema');

class MapCtl {
    // get knm lists: the users only see their own maps
    async find(ctx) {
        const maps = await Maps.find({
            author: ctx.state.user._id
        }).populate('author');
        ctx.body = maps;
    }

    // create a new knm
    async create(ctx) {
        // 先创建一个knm
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
        // 再创建一个graph, graph属于一个knm, 一对一的关系
        const newGraph = await new Graphs({
            author: ctx.state.user._id,
            knm: newMap._id,
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
}

module.exports = new MapCtl();