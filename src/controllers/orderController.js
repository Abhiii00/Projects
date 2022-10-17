const orderModel = require('../models/orderModel')
const userModel = require('../models/userModel')
const v = require('../validations/validation')
const cartModel = require('../models/cartModel')


//------------------------------|| CREATE ORDER ||----------------------------------

const createOrder = async function(req, res){
    try {
        let userId = req.params.userId
        if(!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: `${userId} is not valid userid`})
        let findUserData = await userModel.findById({ _id: userId })
        if (!findUserData) return res.status(404).send({ status: false, msg: `no user found by this ${userId}`})

        let cartData = req.body
        let {cartId} = cartData
        if(req.body.length == 0)  return res.status(400).send({ status: false, message: "Please give some data to create an order" })
        if(!cartId) return res.status(400).send({ status: false, message: "cartId is required" })
        if(!v.isValidObjectId(cartId)) return res.status(400).send({ status: false, msg: `${cartId} is not valid cartId`})
        let findCartData = await cartModel.findById({ _id: cartId })
        if (!findCartData) return res.status(404).send({ status: false, msg: `no data found by this cartId ${cartId}`})
    
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}


//------------------------------|| UPDATE ORDER ||----------------------------------

const updateOrder = async function(req, res){
    try {
    
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}


module.exports = {createOrder, updateOrder}








