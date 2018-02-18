const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name:String,
    email:String,
    password:String,
    summary:String,
    imagUrl:String,
    company:String,
    jobTitle:String
});


module.exports = mongoose.model("User", userSchema);