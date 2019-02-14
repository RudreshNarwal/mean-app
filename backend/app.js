const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

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
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post added sucessfully'
    })  //201 mena everything is ok and a resource is added
    
});
// we can also use app.get() in below mentioned function
app.use('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: "fadf12421l",
            title: "First server-side post",
            content: "This is coming from the server"
        },
        {
            id: "ksajflaj132",
            title: "Second server-side post",
            content: "This is coming from the server!"
        },
 
    ];
    res.json({
        message: 'Posts fetched successfully!',
        posts: posts
    });    
});

module.exports = app;