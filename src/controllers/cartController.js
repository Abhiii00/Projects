const cartModel = require('../models/cartModel')
const v = require('../validations/validation')


//------------------------------|| CREATE CART ||----------------------------------

const createCart = async function(req, res){
    try {
    
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

//------------------------------|| UPDATE CART ||----------------------------------

const updateCart = async function(req, res){
    try {
    
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

//------------------------------|| GET CART ||----------------------------------

const getCartDetails = async function(req, res){
    try {
        let userId = req.params.userId
        if(!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: `${userId} is not valid userid`})
        let findUserData = await userModel.findById({ _id: userId })
        if (!findUserData) return res.status(400).send({ status: false, msg: `no user found by this ${userId}`})
        const data = await cartModel.findOne({ userId }).populate('items.product')
        if(!data) return res.status(404).send({status: false, msg: "no data exist"})
        return res.status(200).send({ status: true, message: 'success', data })
    
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

//------------------------------|| DELETE CART ||----------------------------------

const deleteCart = async function(req, res){
    try {
        let userId = req.params.userId
        if(!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: `${userId} is not valid userid`})
        let findUserData = await userModel.findById({ _id: userId })
        if (!findUserData) return res.status(400).send({ status: false, msg: `no user found by this ${userId}`})
        const cartdata = await cartModel.findOne({ userId })
        if(!cartdata) return res.status(404).send({status: false, msg: "no data exist"})

        const updateData = {items:[], totalPrice:0, totalItems:0}
        const data = await cartModel.findOneAndUpdate({userId},{ $set: {updateData} },{new:true}) 
        return res.status(200).send({ status: true, message: "success", data: data })
    
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
    
}

module.exports = {createCart, updateCart, getCartDetails, deleteCart}