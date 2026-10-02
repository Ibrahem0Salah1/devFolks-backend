// const express = require('express');
// const router = express.Router();
// const postController = require('./../controllers/postController')
// //creating middleware in a sepcific route only applies to those routes only!
// //getting the parameter from the url, here we getting the id paramenter coming from url request

// // USE MIDDLEWARES
// // route.param('id', postController.checkExistingPostWithId)

// //agrregation route for trending topics
// router.route('/getTrendingTopics').get(postController.getTrendingTopics);
// //search route
// router.route('/search').get(postController.searchPosts);
// //creating alias route
// router
// .route('/newest').get(postController.getAliasNewestPosts, postController.getAllPosts);

// router
//     .route('/')
//     .get(postController.getAllPosts)
//     .post(postController.createNewPost)

// router
//     .route('/:id')
//     .get(postController.getPostById)
//     .patch(postController.updatePost)
//     .delete(postController.deletePost)




// module.exports = router;