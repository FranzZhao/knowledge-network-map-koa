const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const usersSchema = new Schema({
    __v: {
        type: Number, select: false,
    },
    // required
    username: {
        type: String, required: true, unique: true
    },
    e_mail: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true, select: false,
    },
    // select
    avatar_url: {
        type: String, select: false,
    }
}, {
    timestamps: true //设置时间戳为true
});

module.exports = model('Users', usersSchema);