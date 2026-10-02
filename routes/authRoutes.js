const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const authMiddleware = require('./../middlewares/authMiddleware')
const {registerSchema, loginSchema} = require('./../schemas/auth.schema');
const router = express.Router();

router.post('/register', authMiddleware.validate(registerSchema) , authController.register);
router.post('/login',authMiddleware.validate(loginSchema), authController.login);
router.route('/refresh').get(authController.refreshToken);
router.route('/google').get(passport.authenticate(
    'google',
    { scope : ['profile', 'email'] }
));
router.route('/google/callback').get( passport.authenticate('google', {session : false}) , authController.googleCallBack)
module.exports= router;