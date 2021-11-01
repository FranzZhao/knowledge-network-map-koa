// import data Schema
const Graphs = require('../models/graphsSchema');

class GraphCtl {
    // get specific graph info
    async findById(ctx) {
        const graph = await Graphs.findOne({
            // _id: ctx.params.id,
            knmId: ctx.params.mapId,
        }).populate('nodes links');
        ctx.body = graph;
    }

    // update specific graph info
    async update(ctx) {
        ctx.verifyParams({
            themeColor: { type: 'string', required: false, },
            lineStyleType: { type: 'string', required: false, },
            lineStyleColor: { type: 'string', required: false, },
            lineStyleWidth: { type: 'number', required: false, },
            lineStyleOpacity: { type: 'number', required: false, },
            lineStyleCurveness: { type: 'number', required: false, },
            labelFontSize: { type: 'number', required: false, },
            labelPosition: { type: 'string', required: false, },
            edgeLabelFontSize: { type: 'number', required: false, },
            layout: { type: 'string', required: false, },
            forcePower: { type: 'number', required: false, },
        });
        const graph = await Graphs.findByIdAndUpdate(
            ctx.params.id,
            ctx.request.body,
            { new: true }
        ).populate('knm');
        ctx.body = graph;
    }
}

module.exports = new GraphCtl();