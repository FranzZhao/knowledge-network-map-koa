const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const nodesSchema = new Schema({
    __v: {
        type: Number,
        select: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        select: true,
    },
    graph: {
        type: Schema.Types.ObjectId,
        ref: 'Graphs',
        select: true,
    },
    Notebooks: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Notebooks',
        }],
        default: [],
        required: false,
        select: true,
    },
    name: {
        type: String,
        required: true,
        select: true,
    },
    tags: {
        type: [{
            type: String,
        }],
        required: false,
        select: true
    },
    introduction: {
        type: String,
        required: false,
        select: true,
    },
    size: {
        type: Number,
        required: false,
        select: true,
    },
    color: {
        type: String,
        required: false,
        select: true,
    },
    state: {
        type: Number,
        required: false,
        default: 1,
        select: true,
    }
}, {
    timestamps: true
});

module.exports = model('Nodes', nodesSchema);