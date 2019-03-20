const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // to check wheather the user credentials are unique or not

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },  // unique does not act as a validator, rather than that unique allow mongoDB and mongoose to do some internal optimization
    password: { type: String, required: true },
});
// with this above schema mongoose need the so called modal, to create data

userSchema.plugin(uniqueValidator); // using mongoose-unique-validator

module.exports = mongoose.model('User', userSchema);// this is constructor function which allow us constructor

// As name is Post, so moongose automatically creates a collection  name post(in lowercase)
