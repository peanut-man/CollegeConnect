const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        select: false,
        min: [6, "Password should atleast be 6 characters."]
    },
    role:{
        type: String,
        required: true,
        enum: ['Student', 'Organizer', 'Admin'],
    },
    collegeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'college',
    }
},{
    timestamps: true
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.TOKEN_EXPIRY});
    return token;
};

userSchema.statics.hashPassword = async(password)=>{
    return await bcrypt.hash(password, 10);
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);