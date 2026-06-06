const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        enum: ["Hackathon", "Seminar", "Fest", "Workshop", "Other"],
        required: true
    },
    eventDate:{
        type: Date,
        required: true
    },
    eventTime:{
        type: String,
        required: true
    },
    collegeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    organizerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    externalLink:{
        type: String,
    },
    imageUrl:{
        type: String,
    },
    likesCount:{
        type: Number,
        default: 0
    },
    isActive:{
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

eventSchema.index({ isActive: 1, likesCount: -1, createdAt: -1 });

eventSchema.index({ collegeId: 1, isActive: 1, createdAt: -1 });



module.exports = mongoose.model('Event', eventSchema);