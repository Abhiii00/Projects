const userModel=require('../models/userModel')
const validation = require('../validations/validation')
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

const userLogin = async function(req,res){
   try{ 

      const requestBody = req.body

      if(!requestBody){
         return res.status(400).send({status:false,msg : "please provide email ,"})
      }
    const email = requestBody.email

      if(!email){
         return res.status(400).send({status:false,msg:"please provide email"})
      }
      if(!validation.email(email)){
         return res.status(400).send({status:false,msg:"email is not valid"})
      }

      const password = requestBody.password
      if(!password){
         return res.status(400).send({status:false,msg:"please provide password"})
      }

      if(!validation.password(password)){
         return res.status(400).send({status:false,msg:"password is not valid"})
      }
      let User = await userModel.findOne({email: email, password: password});

      if (!User)
      return res.status(404).send({ status: false, msg: "No user Found" });

      let token = jwt.sign({ UserId: User._id.toString(), iat: Math.floor(Date.now() / 1000) - 30, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, "final project");

      let userId = User._id


      return res.send({ status: true, msg: "success", data: {userId, token }});

   } catch(error){
      return res.status(500).send({ status: false, msg: error.message }) 

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

module.exports.userLogin = userLogin 