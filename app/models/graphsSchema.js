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
    // 一对一: graph所属的knm
    knm: {
        type: Schema.Types.ObjectId,
        ref: 'Maps',
        select: true,
    },
    knmId: {
        type: String,
        select: true,
    },
    nodes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Nodes',
        }],
        default: [],
        select: true,
    },
    links: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Links',
        }],
        default: [],
        select: true,
    },
    relations: {
        type: [{
            type: String,
        }],
        default: [],
        select: true
    },
    themeColor: {
        type: String,
        default: '#1b3436',
        select: true,
    },
    lineStyleType: {
        type: String,
        default: 'dashed',
        select: true,
    },
    lineStyleColor: {
        type: String,
        default: '#ffffff',
        select: true,
    },
    lineStyleWidth: {
        type: Number,
        default: 1.6,
        select: true,
    },
    lineStyleOpacity: {
        type: Number,
        default: 1,
        select: true,
    },
    lineStyleCurveness: {
        type: Number,
        default: 0.2,
        select: true,
    },
    labelFontSize: {
        type: Number,
        default: 14,
        select: true,
    },
    labelPosition: {
        type: String,
        default: 'inside',
        select: true,
    },
    edgeLabelFontSize: {
        type: Number,
        default: 12,
        select: true,
    },
    layout: {
        type: String,
        default: 'force',
        select: true,
    },
    forcePower: {
        type: Number,
        default: 40,
        select: true,
    },
}, {
    timestamps: true
});

module.exports = model('Graphs', graphsSchema);