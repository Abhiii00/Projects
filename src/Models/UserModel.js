const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    resume:{
        type: String,
        require: true
    },
    coverLetter:{
        type: String,
        require: true
    },
    userId:{
        type: ObjectId,
        require: true
    },
    jobId:{
        type: ObjectId, 
        ref: 'job',
        require: true
    },
    isDeleted:{
        type: Boolean,
        require: true
    }

},{timestamps: true})

module.exports = mongoose.model('User',userSchema)