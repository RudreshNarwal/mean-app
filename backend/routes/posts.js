// organising routes for complex websites
const express = require("express");

const Post = require("../models/post");


const router = express.Router();


router.post("", (req, res, next) => {
    //const post = req.body; // body is body parser object
  const post = new Post({  // post object that is managed by mongoose 
    title: req.body.title,  // body is body parser object // holds parameters that are sent up from the client as part of a POST request.
    content: req.body.content
  });
  post.save().then(createdPost => {  // save is provided by mongoose, then mongoose automatically write the data to database 
      res.status(201).json({
        message: "Post added successfully",
        postId: createdPost._id
      }); //201 means everything is ok and a resource is added
  });   
});

// to put a new resource and to completely replace resource with the new one 
router.put("/:id", (req, res, next) => {
  const post =new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Updated Successfully !"});
  }); //  update data 
});

 // we can also use router.get() in below mentioned function
router.get("", (req, res, next) => {
  Post.find().then(documents => {   // find is mongoose function which find the documents with the specified selector
    res.status(200).json({     //result of documents
      message: "Posts fetched successfully!",
      posts: documents  //this documents is collection in our database
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => { //finById is mongoose function
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'})
    }
  })
})

//Deleteing Post from DB
router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {  // deleteOne deletes one element from our database
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;