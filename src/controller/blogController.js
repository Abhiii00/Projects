const { isValidObjectId, default: mongoose } = require("mongoose");
const authorModel = require("../models/authorModel.js");
const blogModel = require("../models/BlogModel.js");

const isValid = function(value){
  if(typeof value === 'undefined' || value === null) return false
  if(typeof value == 'string' && value.trim().length === 0) return false
  return true
}

// const isValidObjectId = function(objectId){
//   return mongoose.Types.ObjectId.isValid(objectId)
// }

const isVAlidRequestBody = function(requestBody){
  return Object.keys(requestBody).length > 0
}


// create Blog |----------------------------------------------------------------
const createBlog = async function (req, res) {
  try {
  

    let data = req.body;
    if (!isValidData(data)) {
      res.status(400).send({status:false,message:'Invalid Input Details'})

    }
     
const {title,body,tags,authorId,category,subcategory,isPublished}= data
if(!isValid(title)){
  res.status(400).send({status:false,message:'Blog title is required'})
}

if(!isValid(body)){
  res.status(400).send({status:false,message:'Blog body is required'})
}
if(!isValid(category)){
  res.status(400).send({status:false,message:'Blog category is required'})
}

if(!isValid(authorId)){
  res.status(400).send({status:false,message:'title is required'})
}
if(!isValidObjectId(authorId)){
  res.status(400).send({status:false,message:`${authorId} is not a valid authorId`})
}
     
        //Executes when objectId is valid but author not found
        let validAuthor = await authorModel.findOne({ _id: authorId }); 
        if (!validAuthor) return res.status(400).send({ status:false,msg: " authorId doesnt Exists" });
      
const blogData={
  title,body,category,authorId,
  isPublished:isPublished?isPublished:false,
  publishedat:isPublished?new Date():null
}
if(tags){
  if(Array.isArray(tags)){
    blogData['tags']=[...tags]
  }
  if(Object.prototype.toString.call(tags)===['object String']){
    blogData['tags']=[tags]
  }
}
if(subcategory){
  if(Array.isArray(subcategory)){
    blogData['subcategory']=[...subcategory]
  }
  if(Object.prototype.toString.call(subcategory)===['object String']){
    blogData['subcategory']=[subcategory]
  }


  let savedData = await blogModel.create(blogData);
      res.status(201).send({ status:true, message: "Blog Created Successfully" ,data:savedData});
}
  } catch (error) {
    res.status(500).send( error);
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
   const requestBody = req.body
   const params = req.params
   const blogId = params.blogId
   const authorIdFromToken = req.authorId

   // validation check
   if(!isValidObjectId(blogId)){
    return res.status(400).send({status: false, msg: `${blogId} is not valid blod Id`})
   }

   if(!isValidObjectId(authorIdFromToken)){
    return res.status(400).send({status: false, msg: `${authorIdFromToken} is not valid token Id`})
   }

   const blog = await blogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null})
   if(!blog){
    return res.status(404).send({status: false, msg: "blog not found"})
   }

   if(blog.authorId.toString() !== authorIdFromToken){
    return res.status(401).send({status: false, msg: "unauthorized access! owner info doesn't match"})
   }

   if(!isVAlidRequestBody(requestBody)){
    return res.status(400).send({status: false, msg: "blog unmodified", data: blog})
   }

   // Extract params
   const {title, body, tags, category, subcategory, isPublished} = requestBody
   const updatedBlogData = {}

   if(isValid(title)){

   }

  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// DELETE /blogs/:blogId ----------------------------------------------------------


let deleteBlog = async function (req, res) {
  try {

    const requestBody = req.body;
    const queryParams = req.query;
    const blogId = req.params.blogId;

    if (isValidRequest(queryParams)) {
      return res.status(400).send({ status: false, message: "invalid Request" });
    }

    if (isValidRequest(requestBody)) {
      return res.status(400).send({ status: false, message: "invalid Request" });
    }

    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ status: false, message: `${id} is not a valid blogID` });
    }

    const blogByBlogId = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null})

    if (!blogByBlogId) {
      return res.status(404).send({ status: false, message: `no blog found by ${blogId}` })}

    await blogModel.findByIdAndUpdate({ _id: blogId },{ $set: { isDeleted: true, deletedAt: Date.now() } },{ new: true });

    res.status(200).send({ status: true, message: "blog sucessfully deleted" });

  } catch (error) {

    res.status(500).status({ status: false, message: error.message })

  }
};

// DELETE /blogs?queryParams --------------------------------------------------

let deleteBlogs = async function (req, res) {
  try {
    const queryParams = req.query;
  
    if (Object.keys(queryParams).length == 0)
        return res.status(400).send({ status: false, msg: "Input is missing" });

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
