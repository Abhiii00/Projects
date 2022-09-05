const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        trim:true
    },
    body: {
        type: String,
        required: true,
        trim:true
    },
    authorId: {
        type: ObjectId,
        ref: "NewAuthor",
        required: true
    },

    tags: [String],
    category: {
    type: String,
    required: true,
    trim:true
    },
    subcategory: {
        type:[String],
        required:true,
        trim:true
    },

    deletedAt: {
    type:"String",
    default: Date,
    trim:true
},

    isDeleted: {
        type: Boolean,
    default: false,
    trim:true
},
    publishedAt: {
        type:String,
    default: Date,
    trim:true
},
    isPublished: {
        type: Boolean
    , default: false,
    trim:true
},


}, { timestamps: true });


module.exports = mongoose.model('BookCollection', bookSchema)
