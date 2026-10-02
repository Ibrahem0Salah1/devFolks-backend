const {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
    PrismaClientUnknownRequestError,
} = require('@prisma/client/runtime/library');
const AppError = require('./../utils/AppError');
const jwt = require('jsonwebtoken');
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
// ===== Production error response (safe) =====
const sendErrosProduction = (err, res) => {
    if(err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message : err.message
        })
    } else {
        console.error('Error!', err);
        res.status(500).json({
            status: 'error',
            message : 'Something went wrong!'
        })
    }
};


const handleDuplicateFieldsDB = (err) => {
    const target = err.meta?.target;
    const fields = Array.isArray(target)
        ? target.join(', ')
        : target || 'field';
    return new AppError(
        `A record with this ${fields} already exists.`,
        409
    );
};
const handleRecordNotFound = (err) => {
    return new AppError('The request resoruce is not found', 404)
}
const handleJWTError = () => {
    return new AppError('invalid token, please log in again', 401);
}

const handleJWTExpiredError = () =>{
    return new AppError('Your token has expired. Please log in again.', 401);
}
  
const handleValidationErrorDB = (err) => {
    return new AppError(
        'Invalid data.',
        400
    );
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    let error = err;
    //auth errors
    if (err instanceof jwt.JsonWebTokenError) {
    error = handleJWTError();
    }

    if (err instanceof jwt.TokenExpiredError) {
    error = handleJWTExpiredError();
    }
    //prisma errors
    if (err instanceof PrismaClientKnownRequestError) {

        if (err.code === 'P2002') {
            error = handleDuplicateFieldsDB(err);
        }

        if (err.code === 'P2025') {
            error = handleRecordNotFound(err);
        }
    }
    if (err instanceof PrismaClientValidationError) {
        error = handleValidationErrorDB(err);
    }
   if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(error, res);
    }

    if (process.env.NODE_ENV === 'production') {
        return sendErrosProduction(error, res);
    }

    // fallback: unknown NODE_ENV must still respond
    return sendErrosProduction(error, res);
}