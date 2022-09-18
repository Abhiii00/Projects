
const collageModel = require("../models/collageModel.js")
const validUrl = require('valid-url')
const internModel = require("../models/internModel.js")



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isVAlidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}


// ------------------------------------|| CREATE COLLEGE API ||--------------------------------------


const createCollage = async function (req, res) {

    try {

        const requestBody = req.body
        const nameRegex = /^[a-z\s]+$/i

        if(!isVAlidRequestBody(requestBody)){
            return res.status(400).send({status: false, msg: "please input collage Details"})
          }

        // extract
        const { name, fullName, logoLink } = requestBody

        //validations

        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: 'first name is required' })
        }

        if(!requestBody.name.match(nameRegex)) {
        return res.status(400).send({status : false, msg : "Invalid format of name"})
        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, msg: 'fullname is required' })
        }

        
        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, msg: 'logoLink is required' })
        }

        if (!validUrl.isUri(logoLink)){
            return res.status(400).send({ status: false, msg: 'URL is not valid' })
        } 

        const nameAlreadyUse = await collageModel.findOne({name})
      if(nameAlreadyUse){
        return res.status(400).send({status: false, msg: "name already registered"})
      }

        const newCollage = await collageModel.create(requestBody)
        return res.status(201).send({ status: true, msg: 'file created succesfully', data: newCollage })

    }
    catch (err) {
        return  res.status(500).send({ status: false, error: err.message });
    }
};

// ------------------------------------|| GET COLLEGE DETAILS API ||--------------------------------------

 let getCollegeDetails = async function(req,res){
  try{
    let data = req.query

          if(!data.collegeName){
             return res.status(400).send({status: false, msg: 'please input college Name is query params'})
         }
          if(Object.keys(data).length > 1){
             return res.status(400).send({status: false, msg: 'user only allow to input collegeName in query params'})
        }
    
    let findCollege = await collageModel.findOne({name : data.collegeName})
    
    if(!findCollege) {
    return res.status(404).send({status : false, msg : "no College found"})
    }
    const {name, fullName, logoLink} = findCollege
    let CollegeId = findCollege._id
    let findIntern = await internModel.find({collegeId : CollegeId}).select({name : 1, email : 1, mobile : 1, })
    
    let obj = {
        name : name,
        fullName : fullName,
        logoLink : logoLink,
        interns : findIntern
    }

    return res.status(200).send({status: true, msg: 'getting list successfully' ,data : obj})
}
catch(err){
    res.status(500).send({status : false, error : err.message})
}
}

// ----------------------------|| EXPROTING MODULE TO ROUTE.JS ||------------------------------------

module.exports.createCollage = createCollage           // EXPORT CREATE COLLEGE
module.exports.getCollegeDetails = getCollegeDetails   // EXPORT GET COLLEGE