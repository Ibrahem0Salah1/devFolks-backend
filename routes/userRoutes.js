const express = require('express');
const route = express.Router();
const userController = require('./../controllers/userController')
const authMiddlewares = require('./../middlewares/authMiddleware')
// route
//     .route('/')
//     .get(userController.getAllUsers)
//     .post(userController.createNewUser)

// route
//     .route('/:id')
//     .get(userController.getUserById)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser)


route.route('/me').get(authMiddlewares.protect ,userController.getMe);
module.exports = route;