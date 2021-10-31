const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notebooksSchema = new Schema({
    __v: {
        type: Number,
        select: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        select: true,
    },
    relationNode: {
        type: Schema.Types.ObjectId,
        ref: 'Nodes',
    },
    relationLink: {
        type: Schema.Types.ObjectId,
        ref: 'Links',
    },
    title: {
        type: String,
        required: true,
        select: true,
    },
    tags: {
        type: [{
            type: String,
        }],
        select: true,
        default: [''],
    },
    quotes: {
        type: String,
        select: true,
        default: '',
    },
    introduction: {
        type: String,
        select: true,
        default: '',
    },
    addPropertyName: {
        type: [{
            type: String,
        }],
        select: true,
        default: [''],
    },
    addPropertyContent: {
        type: [{
            type: String,
        }],
        select: true,
        default: [''],
    },
    text: {
        type: String,
        select: true,
        default: '',
    },
}, {
    timestamps: true
});

module.exports = model('Notebooks', notebooksSchema);