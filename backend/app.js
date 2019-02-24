const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const postsRoutes = require("./routes/posts");

const app = express();

mongoose.connect("mongodb+srv://rudresh:UHlRyzWk3mll0PkT@mean-gitcy.mongodb.net/node-angular?retryWrites=true")
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection Failed!');
    })

app.use(bodyParser.json());  //app.use(bodyParser.json()) basically tells the system that you want json to be used. 
app.use(bodyParser.urlencoded({ extended: false })); /*basically tells the system whether you want to use a simple algorithm 
                for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).*/

//To avoid COR'S = Cross Origin Resource Sharing issue.-- 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow which domain are allow to access our resources 
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"  // the incoming request may have these extra header
  );
  res.setHeader(
    "Access-Control-Allow-Methods",           // Here we control which http verb we will use
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();         //goto next app.post() //middleware function
                  //next() call does not stop the rest of the code in your middleware function from executing
});
// using router instead of app.
// app.post("/api/posts", (req, res, next) => {
//     //const post = req.body; // body is body parser object
//   const post = new Post({  // post object that is managed by mongoose 
//     title: req.body.title,  // body is body parser object // holds parameters that are sent up from the client as part of a POST request.
//     content: req.body.content
//   });
//   post.save().then(createdPost => {  // save is provided by mongoose, then mongoose automatically write the data to database 
//       res.status(201).json({
//         message: "Post added successfully",
//         postId: createdPost._id
//       }); //201 means everything is ok and a resource is added
//   });   
// });

// // to put a new resource and to completely replace resource with the new one 
// app.put("/api/posts/:id", (req, res, next) => {
//   const post =new Post({
//     _id: req.body.id,
//     title: req.body.title,
//     content: req.body.content
//   });
//   Post.updateOne({_id: req.params.id}, post).then(result => {
//     console.log(result);
//     res.status(200).json({message: "Updated Successfully !"});
//   }); //  update data 
// });

//  // we can also use app.get() in below mentioned function
// app.get("/api/posts", (req, res, next) => {
//   Post.find().then(documents => {   // find is mongoose function which find the documents with the specified selector
//     res.status(200).json({     //result of documents
//       message: "Posts fetched successfully!",
//       posts: documents  //this documents is collection in our database
//     });
//   });
// });

// app.delete("/api/posts/:id", (req, res, next) => {
//   Post.deleteOne({ _id: req.params.id }).then(result => {  // deleteOne deletes one element from our database
//     console.log(result);
//     res.status(200).json({ message: "Post deleted!" });
//   });
// });

app.use("/api/posts", postsRoutes);  // route with url /api/posts will be forwarded to postsRoutes

module.exports = app;
