const reviewModel = require("../models/reviewModel.js")
const bookModel = require("../models/bookModel.js")
const mongoose=require("mongoose")


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isVAlidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId){
  return mongoose.Types.ObjectId.isValid(objectId)
}


//--------------------------|| CREATE REVIEW ||--------------------------------

const createReview = async function(req,res){
    try {
        let params = req.params.bookId
        
        let requestBody = req.body
    
            if(!isVAlidRequestBody(requestBody)){
                return res.status(400).send({status: false, msg: "please input review Details"})
            }
    
            if (!params) {
                return res.status(400).send({ status: false, message: "please provide a bookId in params" })
            };
    
            if(!isValidObjectId(params)){
                return res.status(400).send({status: false, msg: `${params} is not valid book Id`})
            }
    
            let findbookId = await bookModel.findById(params)
            
            if(!findbookId) {
            return res.status(404).send({status: false, msg: "bookId doesn't exists"})
            }
    
            const checkBookId = await bookModel.findOne({ _id: params, isDeleted: false})
    
            if (!checkBookId) {
              return res.status(404).send({ status: false, message: "this book is deleted"})
            }
    
            const {bookId, reviewedBy, reviewedAt, rating } = requestBody
    
            if (!isValid(bookId)) {
                return res.status(400).send({ status: false, msg: ' bookId is required' })
            }
    
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, msg: ' reviewedBy is required' })
            }
    
            if (!isValid(reviewedAt)) {
                return res.status(400).send({ status: false, msg: ' reviewedAt is required' })
            }
    
            if (!isValid(rating)) {
                return res.status(400).send({ status: false, msg: ' rating is required' })
            }
    
            
    
        let createReview = await reviewModel.create(requestBody)    
    
            await bookModel.findOneAndUpdate({_id: params},{$inc:{reviews:1}},{new: true})
        
              return res.status(200).send({ status: true, message: "success", createReview});
    
    
    } catch (error) {
        return res.status(500).send({status:false, msg:"error", error:error.message})  
    }
}

//--------------------------|| UPDATE REVIEW ||--------------------------------

const updateReview = async function(req,res){
    try {
        let bookId = req.params.bookId;

        if (!bookId) {
            return res.status(400).send({ status: false, message: "please provide a bookId in params" })
        };

        if(!isValidObjectId(bookId)){
            return res.status(400).send({status: false, msg: `${bookId} is not valid book Id`})
        }
        
        let findbookId = await bookModel.findById({_id:bookId, isDeleted: false})
        if(!findbookId) {
        return res.status(404).send({status: false, msg: "bookId doesn't exists"})
        }

        let reviewId = req.params.reviewId;

        if (!reviewId) {
            return res.status(400).send({ status: false, message: "please provide a reviewId in params" })
        };

        if(!isValidObjectId(reviewId)){
            return res.status(400).send({status: false, msg: `${reviewId} is not valid review Id`})
        }
        
        let findreviewId = await reviewModel.findById({ _id: reviewId, isDeleted:false})
        if(!findreviewId) {
        return res.status(404).send({status: false, msg: "reviewId doesn't exists"})
        }
        
        let updatereviewdata = req.body;

        let { review, rating, reviewedBy} = updatereviewdata;

        if(!isVAlidRequestBody(updatereviewdata)){
            return res.status(400).send({status: false, msg: "please input review Details"})
        };

        

        let reviewupdate = await reviewModel.findOneAndUpdate(
            { bookId:bookId, _id: reviewId, isDeleted:false },
            { $set: { review, rating, reviewedBy} },
            { new: true }
        );

        res.status(200).send({ status: true, message: 'Success', data: reviewupdate });
      

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

//--------------------------|| DELETE REVIEW ||--------------------------------

const deleteReview = async function(req,res){
    
}



//--------------------------|| EXPORTING MODULE TO ROUTE.JS ||--------------------------------

module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview
