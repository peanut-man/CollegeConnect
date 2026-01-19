const userModel = require('../models/user.model');
const authService = require('../services/auth.service')

module.exports.signUpUser = async (req, res, next) => {
    
    try {
        const isUserAlready = await userModel.findOne({email}); 
        if(isUserAlready){
            res.status(200).json({message: "User already exists."})
        }

        const user = await authService.createUser(req.body);
        const token = user.generateAuthToken()
        res.cookie("token", token)
        res.status(201).json({ token, user });
        

    } catch (error) {
        next(error);
    }
};

module.exports.loginUser = async (req, res, next) => {
    try {
        const user = await authservice.loginUser(req.body);

    } catch (error) {
        
    }
}