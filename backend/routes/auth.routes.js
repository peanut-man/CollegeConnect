const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {validateMiddleware} = require('../middlewares/validate.middleware')
const {signupValidation, loginValidation} = require('../validations/auth.validations');
const {signUpUser, loginUser, getUser, logoutUser} = require('../controllers/auth.controller');

router.get('/me', authMiddleware.getOptionalUser, getUser);

router.post('/signup', signupValidation, validateMiddleware, signUpUser);

router.post('/login', loginValidation, validateMiddleware, loginUser);


router.post('/logout', authMiddleware.getUser, logoutUser);
module.exports = router;
