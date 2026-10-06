const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const authMiddleware = require('./../middlewares/authMiddleware')
const {registerSchema, loginSchema} = require('./../schemas/auth.schema');
const router = express.Router();

router.post('/register', authMiddleware.validate(registerSchema) , authController.register);
router.post('/login',authMiddleware.validate(loginSchema), authController.login);
router.route('/refresh').get(authController.refreshToken);

//google routes
router.route('/google').get(passport.authenticate(
    'google',
    { scope : ['profile', 'email'] }
));
// failureMessage:true => when our strategy calls done(new AppError(...)) passport appends
// ?error=<message> to the redirect instead of discarding the reason.
router.route('/google/callback').get(
  passport.authenticate('google', { session : false, failureRedirect: '/api/v1/auth/google/failed', failureMessage: true }),
  authController.oAuthCallBack
);
router.route('/google/failed').get(authController.oAuthFailed);


//github routes
const oAuthFailurePath = '/api/v1/auth/github/failed';
router.route('/github').get(passport.authenticate('github', {
  session: false,
}));
router.route('/github/callback').get(
  passport.authenticate('github', {
    session: false, // REQUIRED: without it passport tries to write req.session and 500s
    failureRedirect: oAuthFailurePath,
    failureMessage: true,
  }),
  authController.oAuthCallBack
);
// leading slash REQUIRED: 'github/failed' (no slash) registers a route that silently never
// matches anything in Express 5 - no warning, just a 404
router.route('/github/failed').get(authController.oAuthFailed);
//exports
module.exports= router;
