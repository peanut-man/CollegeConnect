const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true,
    },
    latitude:{
        type: Number,
        required: true,
    },
    longitude:{
        type: Number,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
},{
    timestamps: true,
});

// 2dsphere index for geospatial queries
collegeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('College', collegeSchema);