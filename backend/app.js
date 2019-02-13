const express = require('express');

const app = express();

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