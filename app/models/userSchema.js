const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    __v: {
        type: Number, select: false
    },

});

module.exports = model('User', userSchema);