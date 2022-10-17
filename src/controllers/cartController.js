const cartModel = require('../models/cartModel')


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
    
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

//------------------------------|| DELETE CART ||----------------------------------

const deleteCart = async function(req, res){
    try {
    
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
    
}

module.exports = {createCart, updateCart, getCartDetails, deleteCart}