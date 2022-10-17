const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')

const mid=require('../middleware/auth')

//-----------------------|| USER API'S ||---------------------------
router.post('/register',userController.userCreate)
router.post('/login',userController.userLogin)
router.get('/user/:userId/profile',mid.authentication,userController.getUserDetails)
router.put('/user/:userId/profile',mid.authentication,mid.authorisation,userController.updateUser)


//-----------------------|| PRODUCT API'S ||---------------------------
router.post('/products',productController.createProduct)
router.get('/products',productController.getProductByQuery)
router.get('/products/:productId',productController.getProductByParams)
router.put('/products/:productId',productController.updateProduct)
router.delete('/products/:productId',productController.deleteProduct)


//-----------------------|| CART API'S ||---------------------------
router.post('/users/:userId/cart',cartController.createCart)
router.put('/users/:userId/cart',cartController.updateCart)
router.get('/users/:userId/cart',cartController.getCartDetails)
router.delete('/users/:userId/cart',cartController.deleteCart)


//-----------------------|| ORDER API'S ||---------------------------
router.post('/users/:userId/orders',orderController.createOrder)
router.put('/users/:userId/orders',orderController.updateOrder)

module.exports=router 