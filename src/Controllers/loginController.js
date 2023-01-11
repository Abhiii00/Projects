const loginModel = require('../Models/loginModel.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const v = require('../validations/validation.js')


//--------------------|| CREATE USER ||----------------------

const registerUser = async function(req,res){
    try{
       let userData = req.body
       let {name, email, password, mobile} = userData
      
       if(!v.isvalidRequest(userData)) return res.status(400).send({ status: false, message: "please input some data" })
 
       if (!v.isValidSpace(name)) return res.status(400).send({ status: false, message: `name is mandatory` })
       if (!v.isValidName(name)) return res.status(400).send({ status: false, message: `name is must in char` })         
     
       if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
       if (!v.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
       if (await loginModel.findOne({ email: email })) return res.status(400).send({ status: false, message: `email already exist` })

       if (!mobile) return res.status(400).send({ status: false, message: "mobile number is mandatory" })
       if (!v.isValidMobile(mobile)) return res.status(400).send({ status: false, message: `enter a valid mobile number` })
       if (await loginModel.findOne({mobile: mobile })) return res.status(400).send({ status: false, message: `mobile already exist` })
 
       if (!password) return res.status(400).send({ status: false, message: "password is mandatory" })
       if (!v.isValidPass(password)) return res.status(400).send({ status: false, message: `enter a valid password-"password length should be 8 min - 15 max"` })

       //hashing password
       const salt = await bcrypt.genSalt(10)
       const hashpass = await bcrypt.hash(userData.password, salt)
       userData.password = hashpass
       
       let Document = await loginModel.create(userData)
       res.status(201).send({ status: true, msg: "success", data: Document })
     }catch(error){
        return res.status(500).send({ status: false, error: error.message })
     }
}


//--------------------|| LOGIN USER ||----------------------

const loginUser = async function(req,res){
    try {
        const requestBody = req.body
        if (!v.isvalidRequest(requestBody)) return res.status(400).send({ status: false, message: `data is mandatory` })
  
        const { email, password } = requestBody
  
        if (!email) return res.status(400).send({ status: false, message: "please provide email" })
        if (!v.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
  
        if (!password) return res.status(400).send({ status: false, message: "please provide password" })
        if (!v.isValidPass(password)) return res.status(400).send({ status: false, message: `enter a valid password-"password length should be 8 min - 15 max"` })
  
        let user = await loginModel.findOne({ email: email });
        if (!user) return res.status(404).send({ status: false, message: "no user found-invalid user" });
  
        let passCheck = await bcrypt.compare(password, user.password)
        if (!passCheck) return res.status(400).send({ status: false, message: "invalid password" });
  
        let token = jwt.sign({userId: user._id.toString()},"xhipment-Assignment",{ expiresIn: "12h" });
  
        return res.send({ status: true, message: "Success", data: token});
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}


//--------------------|| EXPORTING MODULE TO ROUTE.JS ||----------------------

module.exports = {registerUser, loginUser}