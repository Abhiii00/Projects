const userModel=require('../models/userModel')

const userCreate=async function(req,res){
   try{
    let data=req.body
    //if(Object.keys(data)==0) return res.status(400).send({status:true,msg:"body can't be empty"})
    let userData=await userModel.create(data)
    return res.status(201).send({status:true,msg:'User created successfully',data:userData})
   }
   catch(err){
        return res.status(500).send({status:false,msg:err.message})
   }
}


module.exports={userCreate}