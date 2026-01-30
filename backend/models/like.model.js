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

likeSchema.index({ userId: 1, eventId: 1 }, { unique: true });


module.exports = mongoose.model('Like', likeSchema);