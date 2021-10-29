const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notebooksSchema = new Schema({
    __v: {
        type: Number,
        select: false,
    },
    title: {
        type: String,
        required: true,
        select: true,
    },
    relation: {
        type: Schema.Types.ObjectId,
        ref: 'Nodes' | 'Links',
    },
    tags: {
        type: [{
            type: String,
        }],
        select: true
    },
    quotes: {
        type: String,
        select: true,
    },
    introduction: {
        type: String,
        select: true,
    },
    addPropertyName: {
        type: [{
            type: String,
        }],
        select: true
    },
    addPropertyContent: {
        type: [{
            type: String,
        }],
        select: true
    },
    text: {
        type: String,
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

module.exports = model('Notebooks', notebooksSchema);