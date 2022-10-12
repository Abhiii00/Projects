const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')

router.post('/register',userController.userCreate)
router.post('/login',userController.userLogin)
router.get('/user/:userId/profile',userController.getUserDetails)
router.put('/user/:userId/profile',userController.updateUser)

module.exports=router