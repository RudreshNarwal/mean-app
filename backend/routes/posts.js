// organising routes for complex websites
const express = require("express");
const multer = require("multer");  // multer allow us to extract incoming files

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP ={  //MIME TYPE supported in this
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({ //To configure where multer should put file
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type"); // throughing error if we don't have specified mime type
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); // cb is callback . here first argument is for any errors, all set to null here and second is a string, which
                                   // is the path of folder where it should be stored
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split('').join('-'); // anywhite space will be replaced with -
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext); // cb to pass info to multer
  }
});

router.post("", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {   // multer will now try to handle single post request
    //const post = req.body; // body is body parser object
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({  // post object that is managed by mongoose
    title: req.body.title,  // body is body parser object // holds parameters that are sent up from the client as part of a POST request.
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename  //accessing image through image path
  });
  post.save().then(createdPost => {  // save is provided by mongoose, then mongoose automatically write the data to database
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost, // this will create all the property of created post
          id: createdPost._id
        }
      }); //201 means everything is ok and a resource is added
  });
});

// to put a new resource and to completely replace resource with the new one
router.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post =new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath
  });
  console.log(post);
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Updated Successfully !"});
  }); //  update data
});

 // we can also use router.get() in below mentioned function
router.get("", (req, res, next) => {
  //console.log(req.query);  //For page and page size using query parameters
  const pageSize = +req.query.pagesize;  //by default query parameters will return string
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
       .skip(pageSize * (currentPage - 1))
       .limit(pageSize);  //limit the amounts of documents we return
  }
  postQuery.then(documents => {   // find is mongoose function which find the documents with the specified selector
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({     //result of documents
      message: "Posts fetched successfully!",
      posts: fetchedPosts,  //this documents is collection in our database
      maxPosts: count
    });
  })
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
router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {  // deleteOne deletes one element from our database
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
