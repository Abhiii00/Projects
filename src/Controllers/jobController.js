const jobModel = require('../Models/jobModel.js')
const userModel = require('../Models/UserModel')
const v = require('../validations/validation.js')


//--------------------|| CREATE JOB POSTING ||----------------------

const createJob = async function(req,res){
    try {
        let jobData = req.body
        let userId = req.params.UserId
        let {title, discription, email, skills, experience} = jobData

        if(!v.isvalidRequest(jobData)) return res.status(400).send({ status: false, message: "please input some data" })

        if(!userId) return res.status(400).send({ status: false, message: "please provide userId in params" })
        if(!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid userId" })

        if (!v.isValidSpace(title)) return res.status(400).send({ status: false, message: `title is mandatory` })
        if (!v.isValidName(title)) return res.status(400).send({ status: false, message: `title is must in char` })
        
        if (!v.isValidSpace(discription)) return res.status(400).send({ status: false, message: `discription is mandatory` })

        if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
        if (!v.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
    
        if(await jobModel.findOne({email: email, userId: userId, title: title, discription: discription, skills: skills, experience: experience})){
         return res.status(400).send({ status: false, message: `job already posted` })
        }else{

        if (!v.isValidSpace(skills)) return res.status(400).send({ status: false, message: `skills is mandatory` })

        if (!v.isValidSpace(experience)) return res.status(400).send({ status: false, message: `experience is mandatory` })
        if(!v.isValidNumber(experience)) return res.status(400).send({status:false, message: "Exprience should be in Number"})

        jobData.userId = userId
        let Document = await jobModel.create(jobData)
        return res.status(201).send({status: true, msg: "success", data: Document})
        }
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

//--------------------|| GET JOB APPLICATIONS DETAILS ||----------------------

let getApplicantDetails = async function(req,res){
  try{
      let data = req.params.jobId

      let findApplicants = await userModel.find({jobId: data})
    
      if(!findApplicants) return res.status(404).send({status : false, msg : "no application found"})

      let page = Number(req.query.page) || 1      // PEGINATION 
      let limit = Number(req.query.limit) || 3    // bydefault in one page only 3 data showing 
      
      let applicantionRecive = await userModel.find({jobId : data}).select({name : 1, email : 1, coverLetter : 1, }).skip((page - 1)*limit).limit(limit)
    
       return res.status(200).send({status: true, msg: 'getting list successfully' ,data : applicantionRecive})
    }catch(error){
    return res.status(500).send({ status: false, error: error.message })
    }
}


//--------------------|| UPDATE JOB POSTING ||----------------------

const updateJobDetails = async function(req,res){
    try {
        let jobId = req.params.jobId
        let data = req.body

        if(!jobId) return res.status(400).send({ status: false, message: "please provide a jobId in params" })
        if(!v.isValidObjectId(jobId)) return res.status(400).send({ status: false, msg: "please enter a valid jobId" })
        let findJobPosting = await jobModel.findOne({_id: jobId, isDeleted: false})
        if (!findJobPosting) return res.status(404).send({ status: false, msg: "Job doesn't exists" })
   
        if(!v.isvalidRequest(data)) return res.status(400).send({ status: false, message: "please input data" })

        let updatedData = await jobModel.findOneAndUpdate({ _id: findJobPosting._id},{$set:{...data}},{new: true});
        return res.status(200).send({ status: true, message: "sucessfully updated", updatedData });
    
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//--------------------|| Delete JOB POSTING ||----------------------

const deleteJobPosting = async function (req, res) {    
    try {
        let jobId = req.params.jobId

        if(!jobId) return res.status(400).send({ status: false, message: "please provide a jobId in params" })
        if(!v.isValidObjectId(jobId)) return res.status(400).send({ status: false, msg: "please enter a valid jobId" })

        let findJobPosting = await jobModel.findOne({_id: jobId})
        if (findJobPosting.isDeleted == true) return res.status(404).send({ status: false, message: "job is already deleted" })
    
        let deleteJob = await jobModel.findByIdAndUpdate({ _id: jobId }, { $set: { isDeleted: true } }, { new: true });                      
        return res.status(200).send({ status: true, message: "job sucessfully deleted", deleteJob });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//--------------------|| EXPORTING MODULE TO ROUTE.JS  ||----------------------

module.exports = {createJob, getApplicantDetails, updateJobDetails, deleteJobPosting}