const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const linksSchema = new Schema({
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
    name: {
        type: String,
        required: true,
        select: true,
    },
    tags: {
        type: [{
            type: String,
        }],
        select: true
    },
    introduction: {
        type: String,
        select: true,
    },
    source: {
        type: Schema.Types.ObjectId,
        ref: 'Nodes',
        required: true,
        select: true,
    },
    target: {
        type: Schema.Types.ObjectId,
        ref: 'Nodes',
        required: true,
        select: true,
    },
    Notebooks: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Notebooks',
        }],
        default: [],
        select: true
    },
    state: {
        type: Number,
        default: 1,
        required: false,
        select: true,
    }
}, {
    timestamps: true
});

module.exports = model('Links', linksSchema);