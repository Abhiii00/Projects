const userModel=require('../models/userModel')
const bcrypt = require("bcrypt")

const userCreate=async function(req,res){
   try{
    let data=req.body
    //hashing
    const salt = await bcrypt.genSalt(10)
    console.log(salt);
    const hashpass = await bcrypt.hash(data.password, salt)
    console.log(hashpass);

    data.password = hashpass   
    let userData=await userModel.create(data)
    return res.status(201).send({status:true,msg:'User created successfully',data:userData})
   }
   catch(err){
        return res.status(500).send({status:false,msg:err.message})
   }
}




const getUserDetails = async function(req,res){
try {
   let userIdByparams = req.params.userId
   let findUserData = await userModel.findById({_id: userIdByparams})
   return res.status(201).send({status:true, msg:'User created successfully', data:findUserData})

} catch (err) {
   return res.status(500).send({status:false,msg:err.message})
}
}


module.exports={userCreate, getUserDetails}
