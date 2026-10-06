
const bcrypt = require('bcryptjs');
const db = require('./../utils/prisma');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError');
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../utils/token');

const createSendTokens = (user, statusCode, res) => {
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly : true,
        secure : process.env.COOKIE_SECURE ==='true',
        sameSite: 'lax',
        maxAge : 7*24*60*60*1000 //7d
    })
    const {password, ...userWithoutPassword} = user;
    res.status(statusCode).json({
        status: 'success',
        accessToken,
        user : userWithoutPassword
    })

};

const setTokenAndRedirct = (user,statusCode,res) => {
  const refreshToken = signRefreshToken(user.id);
  res.cookie('refreshToken', refreshToken, {
        httpOnly : true,
        secure : process.env.COOKIE_SECURE ==='true',
        sameSite: 'lax',
        maxAge : 7*24*60*60*1000 //7d
    })
  res.status(statusCode).redirect(`http://localhost:3001/feed`);
}

exports.register = catchAsync(async (req, res, next) => {
  //validating inputs done by authMiddlewares
  const {name, email, password, userName} = req.body;
    const existingUser = await db.user.findFirst({
        where : {
            OR : [
                {email} , {userName}
            ] 
        }
    })
    if(existingUser) {
        if(existingUser.email === email) throw new AppError('This Email is taken', 409);
        else if(existingUser.userName === userName) throw new AppError('This Username is taken', 409);
    }

    const hashedPassword = await bcrypt.hash(password,12);

    //creating the user
    const newUser = await db.user.create({
      data: {
        name,
        userName,
        email,
        password: hashedPassword,
      },
    });
    
    createSendTokens(newUser, 201, res);
})


exports.login = catchAsync(async (req,res,next) => {
    const {email, password} = req.body
    const user = await db.user.findUnique({
      where: { email },
    });
    if(!user || !user.password) {
      throw new AppError('Incorrect Email or Password', 401)
    }
    const passwordMatch = await bcrypt.compare(password,user.password)
    if(!passwordMatch) throw new AppError('Incorrect Email or Password', 401)
    createSendTokens(user, 200, res);

})


exports.refreshToken = catchAsync(async (req,res,next) => {
   const refreshToken = req.cookies.refreshToken;
  //  console.log(refreshToken);
   if(!refreshToken) throw new AppError('Invalid session, please login again', 401);
   const decoded = verifyRefreshToken(refreshToken);
   const user = await db.user.findUnique({
    where : { id: decoded.id},
   })
   if(!user) throw new AppError('this user no longer exists', 401);
   
  createSendTokens(user,200,res);
})

exports.oAuthCallBack = catchAsync(async (req,res,next) => {
  // passport already assigned the Prisma user to req.user. Because we authenticate with
  // session:false, passport sets req.user WITHOUT calling req.logIn / touching req.session,
  // so this session can never become an auth session - it only ever held the state nonce.
  const user = req.user;
  setTokenAndRedirct(user,200,res);
  
})

// Landing target for passport's `failureRedirect`. Reached by a top-level browser
// navigation (a user clicking Cancel on the GitHub consent screen, or our strategy
// calling done(null,false) because the GitHub account exposes no email), so the
// same handler serves both the google and github routes.
exports.oAuthFailed = (req, res) => {
  // passport appends ?error=<message> here only because we set failureMessage:true
  const reason = req.query.error;
  const provider = req.path.startsWith('/google') ? 'Google' : 'GitHub';
  res.status(401).json({
      status: 'error',
      message: `${provider} sign in failed. Make sure your ${provider} account has a primary email address set, then try again.`,
      ...(reason ? { reason } : {}),
  });
};