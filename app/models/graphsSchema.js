const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const graphsSchema = new Schema({
    __v: {
        type: Number,
        select: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        select: true,
    },
    nodes: {
        type: Schema.Types.ObjectId,
        ref: 'Nodes',
        select: true,
    },
    links: {
        type: Schema.Types.ObjectId,
        ref: 'Links',
        select: true,
    },
    relations: {
        type: [{
            type: String,
        }],
        select: true
    },
    themeColor: {
        type: String,
        select: true,
    },
    lineStyleType: {
        type: String,
        select: true,
    },
    lineStyleColor: {
        type: String,
        select: true,
    },
    lineStyleWidth: {
        type: Number,
        select: true,
    },
    lineStyleOpacity: {
        type: Number,
        select: true,
    },
    lineStyleCurveness: {
        type: Number,
        select: true,
    },
    labelFontSize: {
        type: Number,
        select: true,
    },
    labelPosition: {
        type: String,
        select: true,
    },
    edgeLabelFontSize: {
        type: Number,
        select: true,
    },
    layout: {
        type: String,
        select: true,
    },
    forcePower: {
        type: Number,
        select: true,
    },
}, {
    timestamps: true
});

module.exports = model('Graphs', graphsSchema);