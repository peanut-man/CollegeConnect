const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const validateMiddleware = require('../middlewares/validate.middleware')
const {signupValidation, loginValidation} = require('../validations/auth.validations');
const {signUpUser, loginUser, getUser, logoutUser} = require('../controllers/auth.controller');

router.post('/signup', signupValidation, validateMiddleware, signUpUser);

router.post('/login', loginValidation, validateMiddleware, loginUser);

router.get('/me', authMiddleware.getUser, getUser);

router.post('/logout', authMiddleware.getUser, logoutUser);
module.exports = router;