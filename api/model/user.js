const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:String,
    password:String,
    phone:Number,
    email:String,
    userType:String
})

module.exports = mongoose.model('user',userSchema);