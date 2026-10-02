// const Post = require('./../models/postModel')
// const APIfeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/AppError')
// exports.getAliasNewestPosts = (req,res,next) => {
//      req.query.limit =  '5';
//     req.query.sort =  '-createdAt';
//     req.query.fields=  'title,topics,createdAt';
//     next();
// }


// exports.getAllPosts = async (req, res) => {
//     try {
//         const features = new APIfeatures(Post.find(), req.query)
//         .filter()
//         .sort()
//         .select()
//         .paginate();
//         const posts = await features.query;
//         //6-return response
//         res.status(200).json({
//             status: "success",
//             results: posts.length,
//             data: {
//                 posts : posts
//             }
//     })
//     } catch (err) {
//        res.status(400).json({
//         status: 'fail',
//         message: err.message
//        })
//     }
    
// }
// //aggregations => grouping sorting unwind 
// //Break every post's topic list into individual entries,
// //  count how many times each topic shows up,
// //  sort so the most common topic is first, 
// // and only keep the top 10." That's your trending-topics widget in four lines.
// exports.getTrendingTopics = async (req,res) => {
//     try {
//         const trendingTopics = await Post.aggregate([
//             { $unwind : '$topics'}, //three dcouments has react => duplicate these three documents each with the topic react
//             { 
//                 $group : {
//                     _id : '$topics', 
//                     count : { $sum : 1} ,
//                     posts : {$push : '$_id'} // or by title $title
//                 }
//             },
//             {$sort : {count : -1}},
//             // {
//             //     $project : { //what fields should shown from the grop stage
//                     // _id : 1 => 1 ya3ny shows it
//                     // _count : 0 => 0 do not shows it
//             //     }
//             // }
//             // {$limit : 15}
//         ])
//          res
//         .status(200)
//         .json({
//             status: "success",
//             data: {
//                 trendingTopics
//             }
//     })
//     } catch (err) {
//         res.status(400).json({
//         status: 'fail',
//         message: err.message
//        })
//     }
// }
// //serach endpoint
// exports.searchPosts = async (req,res) => {
//     try {
//         const {q} = req.query;
//         console.log(q);
//         if(!q || q.trim().length < 2) return res.status(200).json({ status: 'success', results: 0 ,data: [] });
//         const posts = await Post.aggregate([
//             {
//                 $search : {
//                     index: 'default',
//                     compound: {
//                         should : [
//                             {
//                                 autocomplete: {
//                                     query: q,
//                                     path: 'title'
//                                 }
//                             },
//                             {
//                                  autocomplete: {
//                                     query: q,
//                                     path: 'topics'
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             },
//             {$limit : 6},
//             {
//                 $sort : {
//                     score: {$meta : 'searchScore'}
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     title: 1,
//                     topics: 1,
//                 }
//             }
            
//         ])
//         return res.status(200).json({
//             status: 'success',
//             results : posts.length,
//             data: posts
//         })
//     } catch (err) {
//         console.log(err);
//         return res.status(404).json({
//             status: 'fail',
//             message: 'No posts found'
//         })
//     }
// }
// exports.getPostById = catchAsync(async (req, res, next) => {

//         const id = req.params.id
//         const post = await Post.findById(id);
//        res.status(200).json({
//             status: "success",
//             data: {
//                 post
//             }
//     })
//     } )

// exports.createNewPost = async (req,res) => {
//     try {
//         const newPost = await Post.create(req.body)
//         res.status(201).json({
//         status: "success",
//         message: "post created succesfully",
//         data : {
//             post : newPost
//         }
//         })
//     } catch(err) {
//         return res.status(400).json({
//             status: 'fail',
//             message : err.message
//         })
//     }
   
// }
// exports.updatePost = async(req,res)=> {
//     try {
//         const id = req.params.id
//         const post = await Post.findByIdAndUpdate(id, req.body, {
//             returnDocument : 'after',

//             runValidators: true
//         })
//         return res.status(200).json({
//             status: 'success',
//             data : {
//                 post
//             }
//         })
//     } catch (err) {
//          return res.status(400).json({
//             status: 'fail',
//             message : err.message
//         })
//     }
// };
// exports.deletePost = async (req,res)=> {
//    try {
//         const id = req.params.id
//         await Post.findByIdAndDelete(id)
//         return res.status(204).json({
//             status: 'success',
//             data :null
//         })
//     } catch (err) {
//          return res.status(400).json({
//             status: 'fail',
//             message : err.message
//         })
//     }
// }

// // 4. Post engagement summary per topic —
// //  "which topic gets the most likes on average" 


// // javascript
// // [
// //   { $unwind: '$topics' },
// //   { $group: { _id: '$topics', avgLikes: { $avg: { $size: '$likes' } } } }
// // ]