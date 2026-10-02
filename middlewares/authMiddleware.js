const tokUtil = require('../utils/token');
const db = require('../utils/prisma');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.validate = (schema) => {
    return (req,res,next) => {
        const parsed = schema.safeParse(req.body);
        if(!parsed.success){
            const firstErrorMessage = parsed.error.issues[0].message;
            return next(new AppError(firstErrorMessage, 400))
    };
    next();
    }
} 

exports.protect = catchAsync( async (req,res,next) => {
    const authHeaders = req.headers.authorization;
    if(!authHeaders) throw new AppError('You are not logged in, please login and try again', 401);
    const parts = authHeaders.split(' '); //bearear and token
    if(parts.length !==2 || parts[0] !== "Bearer" ) {
        throw new AppError('Invalid authorization header', 401);
    }
    const token = parts[1];
    const decoded = tokUtil.verifyToken(token);
    const user = await db.user.findUnique({
        where : {
            id : decoded.id
        },
        select: {
        id: true,
        name: true,
        userName: true,
        email: true,
        createdAt: true,
        updatedAt: true
    }
    })
    if(!user) {
        throw new AppError('The user does not exist', 401 )
    }
    req.user = user;
    next();
})