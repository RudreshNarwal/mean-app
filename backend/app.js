const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user")

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

app.use("/images", express.static(path.join("backend/images")));     // aloowing access to images for any request

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

app.use("/api/posts", postsRoutes);  // route with url /api/posts will be forwarded to postsRoutes
app.use("/api/user", userRoutes)

module.exports = app;
