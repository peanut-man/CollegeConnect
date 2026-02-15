const userModel = require("../models/user.model");
const AppError = require("../utils/appError");

module.exports.createUser = async (data)=>{
    const {name, email, password, role, collegeId} = data;
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
        collegeId
    });
    user.password = undefined;
    return user;
    
}

module.exports.loginUser = async (data) => {
    const {email, password} = data;
    if(!email || !password){
        throw new AppError("Email and password are required", 400);
    }

    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        throw new AppError("Email or password incorrect.", 401);
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        throw new AppError("Email or password incorrect.", 401);
    }
    user.password = undefined; 
    return user;
}

