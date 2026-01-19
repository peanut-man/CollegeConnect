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
},{
    timestamps: true,
});



module.exports = mongoose.model('College', collegeSchema);