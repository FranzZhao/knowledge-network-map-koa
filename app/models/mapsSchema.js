const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const mapsSchema = new Schema({
    __v: {
        type: Number, 
        select: false,
    },
    // required
    title: {
        type: String, 
        required: true,
        select: true,
    },
    tags: {
        type: [{
            type: String,
        }],
        required: true,
        select: true,
    },
    introduction: {
        type: String, 
        required: true,
        select: true,
    },
    emoji: {
        type: String, 
        required: true, 
        select: true,
    },
    graph: {
        type: Schema.Types.ObjectId,
        ref: 'Graphs',
        select: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        select: true,
    },
    state: {
        type: Number,
        default: 1,
        select: true,
    }
}, {
    timestamps: true //设置时间戳为true
});

module.exports = model('Maps', mapsSchema);