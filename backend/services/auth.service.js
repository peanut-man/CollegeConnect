const userModel = require("../models/user.model");

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
        throw new Error("Both are required");
    }

    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        throw new Error("Email or password incorrect.");
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        throw new Error("Email or password incorrect.")
    }
    user.password = undefined; 
    return user;
}