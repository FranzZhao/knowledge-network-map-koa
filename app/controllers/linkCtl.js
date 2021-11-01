const Links = require('../models/linksSchema');
const Graphs = require('../models/graphsSchema');

class LinkCtl {
    // 新建特定graph下的知识关联
    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            tags: { type: 'array', itemType: 'string', required: true },
            introduction: { type: 'string', required: true },
            source: { type: 'string', required: true },
            target: { type: 'string', required: true },
        });
        // 1. 创建知识关联
        const link = await new Links({
            author: ctx.state.user._id,
            graph: ctx.params.graphId,
            ...ctx.request.body,
        }).save();
        // 2. 将知识关联挂到graph下
        const graph = await Graphs.findById(ctx.params.graphId);
        let newGraphLinks = graph.links;
        newGraphLinks.push(link.id);
        // console.log(newGraphLinks);
        // 3. 判断该知识关联的名称是否是新的, 如果是则将其名称加到relations中
        let newGraphRelations = graph.relations;
        newGraphRelations.push(link.name);
        newGraphRelations = Array.from(new Set(newGraphRelations)) // 去重
        await Graphs.findByIdAndUpdate(
            ctx.params.graphId,
            {
                links: newGraphLinks,
                relations: newGraphRelations,
            },
        );

        // 4. 输出新的知识关联
        ctx.body = link;
    }

    // 查找特定graph下的所有知识关联
    async find(ctx) {
        const allLinks = await Links.find({
            author: ctx.state.user._id,
            graph: ctx.params.graphId,
        }).populate('source target');
        ctx.body = allLinks;
    }

    // 查看特定graph下的特定知识关联
    async findById(ctx) {
        const link = await Links.find({
            _id: ctx.params.id,
        }).populate('source target Notebooks');
        ctx.body = link;
    }

    // 更新在特定graph下特定知识关联
    async update(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            tags: { type: 'array', itemType: 'string', required: false },
            introduction: { type: 'string', required: false },
            source: { type: 'string', required: false },
            target: { type: 'string', required: false },
            Notebooks: { type: 'array', itemType: 'string', required: false },
            state: { type: 'number', required: false },
        });
        // 1. 更新link
        const link = await Links.findByIdAndUpdate(
            ctx.params.id, ctx.request.body,
            { new: true }
        ).populate('source target');
        // ! 2. 需要同步更新graph下的relations
        // 2-1. 获取所有的link
        const currentLinks = await Links.find({
            graph: ctx.params.graphId
        });
        // 2-2. 将所有的link-name放到数组中并去重
        let relations = [];
        currentLinks.map(link => {
            relations.push(link.name);
        });
        relations = Array.from(new Set(relations));
        // 2-3. 更新Graph中的relations
        // console.log(relations);
        const newGraph = await Graphs.findByIdAndUpdate(
            ctx.params.graphId,
            {relations : relations},
            {new: true}
        );
        // console.log(newGraph);
        ctx.body = link;
    }
}

module.exports = new LinkCtl();