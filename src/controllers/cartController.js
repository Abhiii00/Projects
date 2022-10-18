const cartModel = require('../models/cartModel')
const v = require('../validations/validation')


//------------------------------|| CREATE CART ||----------------------------------

const createCart = async function (req, res) {
    try {

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

//------------------------------|| UPDATE CART ||----------------------------------

const updateCart = async function (req, res) {
    try {
        let data = req.body;
        let userId = req.params.userId;
        let { cartId, productId, removeProduct } = data;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter data" }) 
        if (!v.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please Enter Valid User Id" })
        let userExist = await userModel.findById(userId);
        if (!userExist) return res.status(404).send({ status: false, message: "User not Found" })

        if (!productId) return res.status(400).send({ status: false, message: "Please Enter Product Id" })
        if (!v.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Please Enter valid Product Id" })
        let product = await productModel.findById(productId);
        if (!product) return res.status(404).send({ status: false, message: "Product not found" })

        if (!(removeProduct || removeProduct == 0)) {
            return res.status(400).send({ status: false, message: "Provide the removeProduct Key" })
        }
        if (!(typeof removeProduct == "number")) {
            return res.status(400).send({ status: false, message: "RemoveProduct should be Number" })
        }
        if (!(removeProduct == 1 || removeProduct == 0))
            return res.status(400).send({ status: false, message: "Please Enter RemoveProduct Key 0 Or 1" })


        if (!cartId) return res.status(400).send({ status: false, message: "Please Enter Cart Id" })
        if (!v.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Please Enter valid cart Id" })
        let cartExist = await cartModel.findById(cartId);

        let flag = false; //using flag variable 
        if (cartExist) {
            if (cartExist.items.length == 0) { return res.status(400).send({ status: false, message: "NO Items Present In Cart" }) }
            for (let i = 0; i < cartExist.items.length; i++) {
                if (cartExist.items[i].productId == productId && cartExist.items[i].quantity > 0) {
                    if (removeProduct == 1) {
                        cartExist.items[i].quantity -= 1;
                        cartExist.totalPrice -= product.price;
                        if (cartExist.items[i].quantity == 0) {
                            cartExist.items.splice(i, 1)
                        }
                    } else if (removeProduct == 0) {
                        cartExist.totalPrice = cartExist.totalPrice - cartExist.items[i].quantity * product.price;
                        cartExist.items.splice(i, 1)
                    }

                    flag = true;
                    //updating the cart data 
                    cartExist.totalItems = cartExist.items.length;
                    let final = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: cartExist }, { new: true })
                    return res.status(200).send({ status: true, message: "Cart is updated successfully", data: final });
                }
            }
            if (flag == false) {
                return res.status(404).send({ status: false, message: "No Product with this productId" })
            }
        } else { return res.status(404).send({ status: false, message: "Cart Not Found With This CartId" }) }
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}

//------------------------------|| GET CART ||----------------------------------

const getCartDetails = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: `${userId} is not valid userid` })
        let findUserData = await userModel.findById({ _id: userId })
        if (!findUserData) return res.status(400).send({ status: false, msg: `no user found by this ${userId}` })
        const data = await cartModel.findOne({ userId }).populate('items.product')
        if (!data) return res.status(404).send({ status: false, msg: "no data exist" })
        return res.status(200).send({ status: true, message: 'success', data })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

//------------------------------|| DELETE CART ||----------------------------------

const deleteCart = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: `${userId} is not valid userid` })
        let findUserData = await userModel.findById({ _id: userId })
        if (!findUserData) return res.status(400).send({ status: false, msg: `no user found by this ${userId}` })
        const cartdata = await cartModel.findOne({ userId })
        if (!cartdata) return res.status(404).send({ status: false, msg: "no data exist" })

        const updateData = { items: [], totalPrice: 0, totalItems: 0 }
        const data = await cartModel.findOneAndUpdate({ userId }, { $set: { updateData } }, { new: true })
        return res.status(200).send({ status: true, message: "success", data: data })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

module.exports = { createCart, updateCart, getCartDetails, deleteCart }