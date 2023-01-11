const userModel = require('../Models/UserModel.js')
const jobModel = require('../Models/jobModel.js')
const { uploadFile } = require('../aws/aws')
const v = require('../validations/validation.js')


//--------------------|| CREATE USER ||----------------------

const createUser = async function(req,res){
    try{
       let userData = req.body
       let userId = req.params.UserId
       let {name, email, jobId} = userData
      
       if(!v.isvalidRequest(userData)) return res.status(400).send({ status: false, message: "please input some data" })

       if(!userId) return res.status(400).send({ status: false, message: "please input userId" })
       if(!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid userId" })
 
       if (!v.isValidSpace(name)) return res.status(400).send({ status: false, message: `name is mandatory` })
       if (!v.isValidName(name)) return res.status(400).send({ status: false, message: `name is must in char` })         
     
       if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
       if (!v.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })

       if(await userModel.findOne({email: email, jobId: jobId})){
        return res.status(400).send({ status: false, message: `already applied || email already exist` })
       }else{

       if(!jobId) return res.status(400).send({ status: false, message: "jobId is mandatory" })
       if(!v.isValidObjectId(jobId)) return res.status(400).send({ status: false, msg: "please enter a valid jobId" })

       let files = req.files
       if (files.length == 0) return res.status(400).send({ status: false, message: "resume is mandatory" })
       if (files && files.length > 0) {
          if (!(v.isValidImg(files[0].mimetype))) { return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG/ PDF0" }); }
          var resume = await uploadFile(files[0])
       }

       let letter = req.files
       if (letter.length == 0) return res.status(400).send({ status: false, message: "coverLetter is mandatory" })
       if (letter && letter.length > 0) {
          if (!(v.isValidImg(letter[1].mimetype))) { return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG/ PDF0" }); }
          var coverLetter = await uploadFile(letter[1])
       }

       userData.resume = resume
       userData.coverLetter = coverLetter
       userData.userId = userId
       let Document = await userModel.create(userData)
       res.status(201).send({ status: true, msg: "success", data: Document })
    }
     }catch(error){
        return res.status(500).send({ status: false, error: error.message })
     }
}


//--------------------|| GETTING JOBS BY FILTER ||----------------------

const getJobPostingDeatails = async function(req, res){
    try{
        let data = req.query
 
        if(!data) return res.status(400).send({status: false, msg: "please input some data to filter"})
        if (data.skills === "")  return res.status(400).send({ status: false, msg: "please enter skills to filter" })
        if (data.experience === "")  return res.status(400).send({ status: false, msg: "please enter experience to filter" })
        if(data.jobId === "") return res.status(400).send({ status: false, msg: "please enter JobId to filter" })

        let page = Number(req.query.page) || 1     // PEGINATION 
        let limit = Number(req.query.limit) || 3
 
        let jobPostingData = await jobModel.find({isDeleted: false, ...data }).skip((page - 1)*limit).limit(limit)
        return res.status(200).send({status: true, msg: "success", data: jobPostingData})
     }catch(err){
        return res.status(500).send({ status: false, message: err.message })
     }
}


//--------------------|| UPDATE USER APPLICATION ||----------------------

const updateApplicationDetails = async function(req,res){
    try {
        let userId = req.params.UserId
        let data = req.body

        if(!userId) return res.status(400).send({ status: false, message: "please provide userId in params" })
        if(!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid userId" })
        let findApplicant = await userModel.findOne({userId: userId, isDeleted: false})
        if (!findApplicant) return res.status(404).send({ status: false, msg: "Applicantion doesn't exists" })
   
        if(!v.isvalidRequest(data)) return res.status(400).send({ status: false, message: "please input data" })

        let updatedData = await userModel.findOneAndUpdate({userId: userId},{$set:{...data}},{new: true});
        return res.status(200).send({ status: true, message: "sucessfully updated", updatedData });
    
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




//--------------------|| DELETE USER APPLICATION ||----------------------

const deleteApplication = async function (req, res) {    // COMPLETED
    try {
        let userId = req.params.UserId

        if(!userId) return res.status(400).send({ status: false, message: "please provide a UserId in params" })
        if(!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid UserId" })

        let findApplication = await userModel.findOne({userId: userId})
        if (findApplication.isDeleted == true) return res.status(404).send({ status: false, message: "Application is already deleted" })
    
        let deleteApplication = await userModel.findOneAndUpdate({userId: userId }, { $set: { isDeleted: true } }, { new: true });                      
        return res.status(200).send({ status: true, message: "Application sucessfully deleted", deleteApplication });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




//--------------------|| EXPORTING MODULE TO ROUTE.JS  ||----------------------

module.exports = {createUser, deleteApplication, getJobPostingDeatails, updateApplicationDetails}