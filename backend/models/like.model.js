const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    eventId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Like', likeSchema);