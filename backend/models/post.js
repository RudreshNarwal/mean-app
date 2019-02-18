const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});
// with this above schema mongoose need the so called modal, to create data 

module.exports = mongoose.model('Post', postSchema);// this is constructor function which allow us constructor

// As name is Post, so moongose automatically creates a collection with name post(in lowercase)