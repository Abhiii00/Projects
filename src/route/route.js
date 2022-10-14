const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const productController = require('../controllers/productController')
const mid=require('../middleware/auth')

//-----------------------|| USER API ||---------------------------
router.post('/register',userController.userCreate)
router.post('/login',userController.userLogin)
router.get('/user/:userId/profile',mid.authentication,userController.getUserDetails)
router.put('/user/:userId/profile',mid.authentication,mid.authorisation,userController.updateUser)


//-----------------------|| PRODUCT API ||---------------------------
router.post('/products',productController.createProduct)
router.get('/products',productController.getProductByQuery)
router.get('/products/:productId',productController.getProductByParams)
router.put('/products/:productId',productController.updateProduct)
router.delete('/products/:productId',productController.deleteProduct)

module.exports=router 