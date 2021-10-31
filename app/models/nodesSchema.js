const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const nodesSchema = new Schema({
    __v: {
        type: Number,
        select: false,
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
        type: String,
        required: true,
        select: true,
    },
    color: {
        type: String,
        required: true,
        select: true,
    },
    Notebooks: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Notebooks',
        }],
        required: false,
        select: true
    },
    graph: {
        type: Schema.Types.ObjectId,
        ref: 'Graphs',
        select: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        select: true,
    },
}, {
    timestamps: true
});

module.exports = model('Nodes', nodesSchema);