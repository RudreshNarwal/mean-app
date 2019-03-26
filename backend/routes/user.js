const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

router.post("/signup", ( req, res, next) => {
    bcrypt.hash(req.body.password, 10) // encrypting password
      .then(hash => {
          const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save() // to save the user to database
           .then(result => {
               res.status(201).json({
                 message:'User created!',
                 result: result
               });
           })
           .catch(err => {
               res.status(500).json({
                 error: err
               });
           });
      })
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
       .then(user => {
           if(!user){
             return res.status(401).json({
               message: "Auth failed"
             });
           }
           fetchedUser = user;
           return bcrypt.compare(req.body.password, user.password); // user.password is password stored in DB
       })
       .then(result => {
           if(!result){  // if result is false
            return res.status(401).json({  // we return here to prevent the execution of below mentioned code
              message: "Auth failed"
            });
           }
              //  jwt sign creates a new token acc. to input data of my choice
           const token = jwt.sign(
            { email: fetchedUser.email, user: fetchedUser._id },
            'secret_this_should_be_longer',
             {expiresIn: '1h'}
             ); // JWT token
             res.status(200).json({
                 token: token,
                 expiresIn: 3600
             });
       })
       .catch(err => {
           console.log(err);
           return res.status(401).json({
             message: "Auth failed"
           });
    });
});

module.exports = router;
