const aws = require("aws-sdk");
const userModel = require('../models/userModel')
const jwt=require('jsonwebtoken')
const v = require('../validations/validation')
const {uploadFile}=require('../aws/aws')
const bcrypt = require("bcrypt")

const userCreate = async function (req, res) {
   try {
      let data = req.body
      if(!v.isValidSpace(data)) return res.status(400).send({ status: false, message: `data is mandatory` })
      const {fname,lname,email,files,phone,password}=data
      
      if(!v.isValidString(fname)) return res.status(400).send({ status: false, message: `fname is mandatory` })
      if(!v.isValidString(lname)) return res.status(400).send({ status: false, message: `lname is mandatory` })
      
      if(!v.isValidString(email)) return res.status(400).send({ status: false, message: `email is mandatory` })
      if(!v.isValidEmail(email)) return res.status(400).send({ status: false, message: `email is in valid format` })
      
      if (files.length == 0) return res.status(400).send({ status: false, message: "File is mandatory" })
      if (files && files.length > 0) var photolink = await uploadFile(files[0])
      
      if(!phone) return res.status(400).send({ status: false, message: `phone is mandatory` })
      if(!v.isValidMobile(phone)) return res.status(400).send({ status: false, message: `phone is mandatory` })

      if(!password) return res.status(400).send({ status: false, message: `password is mandatory` })
      if(!v.isValidPass(password)) return res.status(400).send({ status: false, message: `password is mandatory` })

      //hashing
      const salt = await bcrypt.genSalt(10)
      console.log(salt);
      const hashpass = await bcrypt.hash(data.password, salt)
      console.log(hashpass);

      data.password = hashpass
      data.address = JSON.parse(data.address)
      data.profileImage=photolink
      let userData = await userModel.create(data)
      return res.status(201).send({ status: true, msg: 'User created successfully', data: userData })
   }
   catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
   }
}

const userLogin = async function (req, res) {
   try {
      const requestBody = req.body
      if (!requestBody) return res.status(400).send({ status: false, msg: "please provide email ," })
      
      const {email,password}=requestBody
      
      if (!email) return res.status(400).send({ status: false, msg: "please provide email" })
      if (!v.isValidEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })

      if (!password) return res.status(400).send({ status: false, msg: "please provide password" })
      if (!v.isValidPass(password)) return res.status(400).send({ status: false, msg: "password is not in valid format" })

      let user = await userModel.findOne({ email: email});
      if (!user) return res.status(404).send({ status: false, msg: "invalid user" });

      let passCheck=await bcrypt.compare(password,user.password)
      if (!passCheck) return res.status(404).send({ status: false, msg: "invalid password" });

      //tokengeneration
      let token = jwt.sign({
         userId: user._id.toString(),
      },
         "g60bhoramp",
         { expiresIn: "60min" }
      );

      let userId = user._id
      return res.send({ status: true, msg: "success", data: { userId, token } });

   } catch (error) {
      return res.status(500).send({ status: false, msg: error.message })
   }
}

const getUserDetails = async function (req, res) {
   try {
      let userIdByparams = req.params.userId
      if(!v.isValidObjectId(userIdByparams)) return res.status(400).send({status:false, msg:`${userIdByparams} is not valid userId`})
      let findUserData = await userModel.findById({ _id: userIdByparams })
      if(!findUserData) return res.status(400).send({status:false, msg:`data isn't exist of this userid`})
      return res.status(200).send({ status: true,message: "User profile details",data: findUserData })
   } catch (err) {
      console.log(err.message)
      return res.status(500).send({ status: false, message: err.message })
   }
}



module.exports = { userCreate, getUserDetails,userLogin }
 