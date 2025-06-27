const mongoose = require ('mongoose');

const studentSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    gender:String,
    course:String,
    city:String,
    age:Number,
    imagePath: String

})

module.exports = mongoose.model('Student',studentSchema);