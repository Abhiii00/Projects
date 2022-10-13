const productModel = require('../models/productModel')
const v = require('../validations/validation')



//------------------------------|| CREATE PRODUCT ||----------------------------------

const createProduct = async function(req, res){
    try {
        let formData = req.body
        let userData = await productModel.create(formData)
      return res.status(201).send({ status: true, msg: 'User created successfully', data: userData })
        
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//------------------------------|| GET PRODUCT BY QUERY ||----------------------------------

const getProductByQuery = async function(req, res){
    try {
        let productData = req.query
         const {availableSizes, title, price } = productData
        if (availableSizes === "") return res.status(400).send({ status: false, msg: "please enter size" })
        if(!availableSizes == "S" ||availableSizes == "XS" ||availableSizes == "M" || availableSizes == "X" || availableSizes == "L" || availableSizes == "XXL" || availableSizes == "XL")
           return res.status(400).send({ status: false, msg: `choose size form this "S", "XS","M","X", "L","XXL", "XL"` })
       
        if (title === "") return res.status(400).send({ status: false, msg: "please enter productName" })   
        if (price === "") return res.status(400).send({ status: false, msg: "please enter price" })
         
        let undeletedData = await productModel.find({isDeleted: false, ...productData})
        if(undeletedData.length == 0) return res.status(404).send({status:false, msg:"no data found"})

        return res.status(200).send({ status: true, msg: "get data successfully", data: undeletedData })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//------------------------------|| GET PRODUCT BY PARAMS ||----------------------------------

const getProductByParams = async function(req, res){     // COMPLETED
    try {
        let productId = req.params.productId
        if(!v.isValidObjectId(productId)) return res.status(400).send({status:false, msg:`${productId} is not valid productId`})
        let findProductData = await productModel.findById({ _id: productId})
        if(!findProductData) return res.status(404).send({status:false, msg:`no data found by this ${productId} productId`})
        if(findProductData.isDeleted == true) return res.status(400).send({status:false, msg: "this product is deleted"})
        return res.status(200).send({ status: true,message: "getting product details succesfully",data: findProductData })
        
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//------------------------------|| UPDATE PRODUCT ||----------------------------------

const updateProduct = async function(req, res){
    try {
        let productId = req.params.productId
        let updateData = req.body
        if(!v.isValidObjectId(productId)) return res.status(400).send({status:false, msg:`${productId} is not valid productId`})
        let findProductData = await productModel.findById({_id: productId})//,{ $set: {...updateData} } )
        if(!findProductData) return res.status(404).send({status:false, msg:`no data found by this ${productId} productId`})
        if(findProductData.isDeleted == true) return res.status(400).send({status:false, msg: "this product is deleted so you can't update it"})
        let updatedProductData = await productModel.findOneAndUpdate({  _id: productId, isDeleted: false},{ $set: {...updateData} } )

        return res.status(201).send({ status: true,message: "successfully updated",data: updatedProductData})
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//------------------------------|| DELETE PRODUCT ||----------------------------------

const deleteProduct = async function(req, res){    // COMPLETED
    try {
        let productId = req.params.productId
        if(!v.isValidObjectId(productId)) return res.status(400).send({status:false, msg:`${productId} is not valid productId`})
        let ProductData = await productModel.findOne({ _id: productId})
        if(!ProductData) return res.status(404).send({status:false, msg:`no data found by this ${productId} productId`})
        if(ProductData.isDeleted == true) return res.status(400).send({status:false, msg: "this product is already deleted"})
        let deletedProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false}, { $set: { isDeleted: true } }, { new: true });

        return res.status(201).send({ status: true,message: "success",data: deletedProduct })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


//------------------------------|| EXPORTING MODULE TO ROUTE.JS ||----------------------------------

module.exports = {createProduct, getProductByQuery, getProductByParams, updateProduct, deleteProduct }