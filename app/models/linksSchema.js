const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const linksSchema = new Schema({
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
        select: true
    },
    introduction: {
        type: String,
        select: true,
    },
    source: {
        type: String,
        required: true,
        select: true,
    },
    target: {
        type: String,
        required: true,
        select: true,
    },
    Notebooks: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Notebooks',
        }],
        select: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        select: true,
    },
}, {
    timestamps: true
});

module.exports = model('Links', linksSchema);