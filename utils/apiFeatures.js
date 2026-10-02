// //class
// class APIfeatures {
//     constructor(query, queryString) {
//         this.query = query;
//         this.queryString = queryString;
//     }
//     //1- filter
//     filter() {
//         //1 get the query params and remove the meta params
//         const queries = {...this.queryString};
//         const excludedFields = ['page', 'limit', 'sort', 'fields', 'q'];
//         excludedFields.forEach(el => delete queries[el])
//         //2-multiple topics splitter 
//         if(queries.topics) queries.topics = {$in: queries.topics.split(',')};
//         //3-regex converter => [gte] --> [$gte];
//         const finalizedQueries = regexReplacer(queries);
//         this.query = this.query.find(finalizedQueries);
//         return this;
//     }
//     //2- sort
//     sort() {
//         if(this.queryString.sort) {
//             const sortBy = this.queryString.sort.split(',').join(' ');
//             this.query.sort(sortBy);
//         } else {
//             this.query.sort('-createdAt');
//         }
//         return this;
//     }

//     //3- select fields
//     select() {
//         if(this.queryString.fields) {
//             const fields = this.queryString.fields.split(',').join(' ');
//             this.query.select(fields);
//         } else {
//             const fields = '-__v';
//             this.query.select(fields);
//         }
//         return this;
//     }
//     paginate() {
//         const page = this.queryString.page * 1 || 1;
//         const limit = this.queryString.limit * 1 || 10;
//         const skip = (page - 1) * limit;
//         this.query = this.query.skip(skip).limit(limit);
//         return this;
//     }
// }
// function regexReplacer (queries)  { 
//     let queryStr = JSON.stringify(queries).replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//     return JSON.parse(queryStr);
// }


// module.exports = APIfeatures;