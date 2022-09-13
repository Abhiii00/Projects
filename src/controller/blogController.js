const {  default: mongoose } = require("mongoose");
const authorModel = require("../models/authorModel.js");
const blogModel = require("../models/BlogModel.js");

const isValid = function(value){
  if(typeof value === 'undefined' || value === null) return false
  if(typeof value == 'string' && value.trim().length === 0) return false
  return true
}

const isVAlidRequestBody = function(requestBody){
  return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId){
  return mongoose.Types.ObjectId.isValid(objectId)
}

// create Blog |----------------------------------------------------------------
const createBlog = async function (req, res) {
  try {
   const requestBody = req.body

   if(!isVAlidRequestBody(requestBody)){
    return res.status(400).send({status: false, msg: "please input blog Details"})
  }

  // Extract params
  const{title, body, authorId, category} = requestBody

  // validation check
  if(!isValid(title)){
    return res.status(400).send({status: false, msg: "title is required"})
  }

  if(!isValid(body)){
    return res.status(400).send({status: false, msg: "body is required"})
  }

  if(!isValid(authorId)){
    return res.status(400).send({status: false, msg: "authorId is required"})
  }

  if(!isValidObjectId(authorId)){
    return res.status(400).send({status: false, msg: `${authorId} is not a valid authorId`})
  }

  if(!isValid(category)){
    return res.status(400).send({status: false, msg: "category title is required"})
  }

  const author = await authorModel.findById(authorId)

  if(!author){
    return res.status(400).send({status: false, msg: "author does not exist"})
  }

  const savedData = await blogModel.create(requestBody);
      res.status(201).send({ msg: savedData });
    
  } catch (error) {
    res.status(500).send( error.message);
  }
};



// get Blogs |----------------------------------------------------------------
let getAllBlog = async function (req, res) {
  try {
    let data = req.query;
    // finding the values in Db and populating document with author details
    let getBlogs = await blogModel.find({ isPublished: true, isDeleted: false, ...data }).populate("authorId");
    res.status(201).send({ msg: getBlogs });
    //checking if we are getting some documents from the database in response
    if (getBlogs.length == 0)
      return res.status(404).send({ msg: "no such blog exist" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// put Blogs |----------------------------------------------------------------

let UpdateBlog = async function (req, res) {
  try {
    let data = req.body;

    if(!isVAlidRequestBody(data)){
      return res.status(400).send({status: false, msg: "please input some Details"})
    }
    if(!data.tags){
      return res.status(400).send({status: false, msg: "tags is required in the request body"})
    }

    if(!data.subcategory){
      return res.status(400).send({status: false, msg: "subcategory is required in the request body"})
    }
     // taking blogId as input and saving it inside a variable
      let blogId = req.params.blogId
      if (!blogId)
        return res
          .status(404)
          .send({ status: false, msg: "no such BlogId exists" });
    
        //going to blogmodel and updating data
        let updatedBlog = await blogModel.findByIdAndUpdate(blogId, data, {
          new: true,

        });
       return res.status(201).send({ status: true, data: updatedBlog });
       }
       catch (error) {
    return res.status(500).send(error.message);
  }
};

// DELETE /blogs/:blogId ----------------------------------------------------------
let deleteBlog = async function (req, res) {
  try {
    //taking blogId in params and saving in variable id
    let id = req.params.blogId;
    let blogId = await blogModel.findById(id);
    // 
    // CHECKING BLOG ID iS EXIST OR NOT
    if (!blogId)
      return res.status(404).send({ status: false, msg: "blog id doesn't exists" });
    let timestamps = new Date();
    await blogModel.findOneAndUpdate(
      { _id: blogId },
      { isDeleted: true, isPublished: false, deletedAt: timestamps }
    );
    res.status(201).send({ status: true, msg: "blog Deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// DELETE /blogs?queryParams --------------------------------------------------

let deleteBlogs = async function (req, res) {
  try {
    const queryParams = req.query;
  
    if (Object.keys(queryParams).length == 0)
        return res.status(400).send({ status: false, msg: "please input some key and value in query params" });

    const updatedBlog = await blogModel.updateMany(queryParams, { $set: { isDeleted: true, isPublished: false } }, { new: true });
    return res.status(200).send({ status: true, data: updatedBlog })
}
catch (error) {
     res.status(500).send(error.message)
}
}


// ------------------- EXPORTING MODULE TO ROUTE.JS -----------------------------------------------------

module.exports.createBlog = createBlog;   // CREATE BLOG
module.exports.getAllBlog = getAllBlog;   // GET BLOGS
module.exports.UpdateBlog = UpdateBlog;   // UPDATE BLOGS
module.exports.deleteBlog = deleteBlog;   // DELETE BLOG BY PARAMS
module.exports.deleteBlogs = deleteBlogs; // DELETE BLOG BY QUERY PARAMS
