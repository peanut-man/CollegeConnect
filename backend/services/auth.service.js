const userModel = require("../models/user.model");
const AppError = require("../utils/appError");

const PUBLIC_SIGNUP_ALLOWED_ROLES = ["Student", "Organizer"];
const ADMIN_SIGNUP_BLOCK_MESSAGE =
  "Admin accounts cannot be created via public signup";
const ROLE_NOT_ALLOWED_MESSAGE = "role not allowed";

module.exports.createUser = async (data)=>{
    const {name, email, password, role, collegeId} = data;

    if (role === "Admin") {
        throw new AppError(ADMIN_SIGNUP_BLOCK_MESSAGE, 403);
    }

    if (!PUBLIC_SIGNUP_ALLOWED_ROLES.includes(role)) {
        throw new AppError(ROLE_NOT_ALLOWED_MESSAGE, 403);
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
        throw new AppError("User already exists.", 409);
    }

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

