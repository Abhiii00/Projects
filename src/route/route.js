const express = require('express')
const router = express.Router()

//--------------------|| CONTROLLERS ||----------------------

const userController = require('../Controllers/userController')
const jobController = require('../Controllers/jobController')
const loginController = require('../Controllers/loginController')


//--------------------|| MIDDLEWARE ||----------------------

const mid = require("../middleware/middleware.js")  

//--------------------|| USER API'S ||----------------------

router.post("/login/register",loginController.registerUser)
router.post("/login",loginController.loginUser)

//--------------------|| USER API'S ||----------------------

router.post("/user/:UserId/createApplication",mid.authentication,mid.Authorisation,userController.createUser)
router.get('/user/:UserId/getJobPosting',mid.authentication,mid.Authorisation,userController.getJobPostingDeatails)
router.put('/user/:UserId',mid.authentication, mid.Authorisation,userController.updateApplicationDetails)
router.delete('/user/:UserId',mid.authentication, mid.Authorisation,userController.deleteApplication)

//--------------------|| JOB API'S ||----------------------

router.post('/job/:UserId/jobPost',mid.authentication, mid.Authorisation,jobController.createJob)
router.get('/job/:jobId/:UserId',mid.authentication, mid.Authorisation,jobController.getApplicantDetails)
router.put('/job/:jobId/:UserId',mid.authentication, mid.Authorisation,jobController.updateJobDetails)
router.delete('/job/:jobId/:UserId',mid.authentication, mid.Authorisation,jobController.deleteJobPosting)

//--------------------|| FOR VALIDATE ENDPOINT ||----------------------

router.all("/*", function (req, res) {
    res.status(400).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct !!!"
    })
})


module.exports = router