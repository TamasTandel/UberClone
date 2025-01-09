const express = require('express');
const router = express.Router();

const {body} = require('express-validator');
const userControllers = require('../controllers/user.controllers');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register',[
    body("email").isEmail().withMessage('Invalid Email'),
    body("fullname.firsname"),
    body("password")
],
    userControllers.registerUser
)
router.post('/login',[
    body("email").isEmail().withMessage('Invalid Email'),
    body("password")
],
    userControllers.loginUser
)

router.get('/profile',authMiddleware.authUser,userControllers.getUserProfile);

router.get('/logout',authMiddleware.authUser,userControllers.logoutUser);

module.exports = router;