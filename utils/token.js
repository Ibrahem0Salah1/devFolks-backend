const jwt = require('jsonwebtoken');

const signAccessToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn : process.env.JWT_ACCESS_EXPIRES_IN || '15m'}
    )
};

const signRefreshToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn : process.env.JWT_REFRESH_EXPIRES_IN || '7d'}
    )
}
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}
const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    )
}
module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyToken,
    verifyRefreshToken
}