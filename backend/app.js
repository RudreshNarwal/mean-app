const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://rudresh:UHlRyzWk3mll0PkT@mean-gitcy.mongodb.net/node-angular?retryWrites=true")
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection Failed!');
    })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*"); // Allow which domain are allow to access our resources 
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"// the incoming request may have these extra header
        );
    res.setHeader(
        "Access-Control-Allow-Methods",     // Here we control which http verb we will use 
        "GET, POST, PATCH, DELETE, OPTIONS"
        );    
    next();
});

app.post("/api/posts", (req, res, next) => {
    //const post = req.body; // body is body parser object
    const post = new Post({   // post object that is managed by mongoose 
        title: req.body.title,
        content: req.body.content
    });
    post.save(); // save is provided by mongoose, then mongoose automatically write the data to database 
    res.status(201).json({
        message: 'Post added sucessfully'
    })  //201 mena everything is ok and a resource is added
    
});
// we can also use app.get() in below mentioned function
app.use('/api/posts', (req, res, next) => {
    Post.find()   // find is mongoose function
     .then(documents => {            
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: documents    //this documents is collection in our database
    }); 
     });
    
});

module.exports = app;