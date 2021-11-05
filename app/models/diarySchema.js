const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const diarySchema = new Schema({
    __v: {
        type: Number,
        select: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        select: true,
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
    text: {
        type: String,
        select: true,
        default: '',
    },
    state: {
        type: Number,
        select: true,
        default: 1,
    }
}, {
    timestamps: true
});

module.exports = model('Diary', diarySchema);