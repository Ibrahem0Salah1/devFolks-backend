const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError');
exports.getMe = catchAsync(async (req,res) => {
   const user = await req.user;
   if(!user) throw new AppError('Unauthenicated', 401);
   return res.status(200).json({
      status: 'success',
      userLogedIn: user
   })
}) 
   
