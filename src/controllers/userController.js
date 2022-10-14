const aws = require("aws-sdk");
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const v = require('../validations/validation')
const { uploadFile } = require('../aws/aws')
const bcrypt = require("bcrypt")

const userCreate = async function (req, res) {
   try {
      let data = req.body
      const { fname, lname, email, phone, password,address } = data
      let files = req.files
      if (files.length == 0) return res.status(400).send({ status: false, message: "File is mandatory" })
      if (files && files.length > 0) {
         //if (!(v.isValidImg(files))) { return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG" }); }
         var photolink = await uploadFile(files[0])
      }
      if (!v.isvalidRequest(data)) return res.status(400).send({ status: false, message: `data is mandatory` })

      if (!v.isValidSpace(fname)) return res.status(400).send({ status: false, message: `fname is mandatory` })
      if (!v.isValidName(fname)) return res.status(400).send({ status: false, message: `fname is must in char` })

      if (!v.isValidSpace(lname)) return res.status(400).send({ status: false, message: `lname is mandatory` })
      if (!v.isValidName(lname)) return res.status(400).send({ status: false, message: `lname is must in char` })

      if (!v.isValidSpace(email)) return res.status(400).send({ status: false, message: `email is mandatory` })
      if (!v.isValidEmail(email)) return res.status(400).send({ status: false, message: `email is in valid format` })
      if (await userModel.findOne({ email: email })) return res.status(400).send({ status: false, message: `email already exist` })

      if (!v.isValidSpace(phone)) return res.status(400).send({ status: false, message: `phone is mandatory` })
      if (!v.isValidMobile(phone)) return res.status(400).send({ status: false, message: `phone is mandatory` })
      if (await userModel.findOne({ phone: phone })) return res.status(400).send({ status: false, message: `phone already exist` })

      if (!v.isValidSpace(password)) return res.status(400).send({ status: false, message: `password is mandatory` })
      if (!v.isValidPass(password)) return res.status(400).send({ status: false, message: `password is mandatory` })

      //address
      if (!v.isValidSpace(address)) { return res.status(400).send({ status: false, message: "Please provide your address" }) }
      address = JSON.parse(data.address)

      if (!address.shipping) return res.status(400).send({ status: true, message: " Shipping address is required" })
      if (!(v.isValidSpace(address.shipping.street))) return res.status(400).send({ status: true, message: " Street address is required" })
      if (!(v.isValidSpace(address.shipping.city))) return res.status(400).send({ status: true, message: "  City is required" })
      if (!(v.isValidSpace(address.shipping.pincode))) return res.status(400).send({ status: true, message: " Pincode is required" })
      if (!(v.isvalidPincode(address.shipping.pincode))) return res.status(400).send({ status: false, message: "Please provide pincode in 6 digit number" })

      if (!address.billing) return res.status(400).send({ status: true, message: " billing address is required" })
      if (!(v.isValidSpace(address.billing.street))) return res.status(400).send({ status: true, message: " Street billing address is required" })
      if (!(v.isValidSpace(address.billing.city))) return res.status(400).send({ status: true, message: " City billing address is required" })
      if (!(v.isValidSpace(address.billing.pincode))) return res.status(400).send({ status: true, message: " Billing pincode is required" })
      if (!(v.isvalidPincode(address.billing.pincode))) return res.status(400).send({ status: false, message: "Please provide pincode in 6 digit number" })

      //hashing
      const salt = await bcrypt.genSalt(10)
      console.log(salt);
      const hashpass = await bcrypt.hash(data.password, salt)
      console.log(hashpass);

      data.password = hashpass
      data.address = JSON.parse(data.address)
      data.profileImage = photolink
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

      const { email, password } = requestBody

      if (!email) return res.status(400).send({ status: false, msg: "please provide email" })
      if (!v.isValidEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })

      if (!password) return res.status(400).send({ status: false, msg: "please provide password" })
      if (!v.isValidPass(password)) return res.status(400).send({ status: false, msg: "password is not in valid format" })

      let user = await userModel.findOne({ email: email });
      if (!user) return res.status(404).send({ status: false, msg: "invalid user" });

      let passCheck = await bcrypt.compare(password, user.password)
      if (!passCheck) return res.status(404).send({ status: false, msg: "invalid password" });

      //tokengeneration
      let token = jwt.sign({
         userId: user._id.toString(),
      },
         "g60bhoramp",
         { expiresIn: "60min" }
      );

      let userId = user._id
      res.setHeader("Authorization", "Bearer " + token);
      return res.send({ status: true, msg: "success", data: { userId, token } });

   } catch (error) {
      return res.status(500).send({ status: false, msg: error.message })
   }
}

const getUserDetails = async function (req, res) {
   try {
      let userIdByparams = req.params.userId
      if (!v.isValidObjectId(userIdByparams)) return res.status(400).send({ status: false, msg: `${userIdByparams} is not valid userId` })
      let findUserData = await userModel.findById({ _id: userIdByparams })
      if (!findUserData) return res.status(400).send({ status: false, msg: `data isn't exist of this userid` })
      return res.status(200).send({ status: true, message: "User profile details", data: findUserData })
   } catch (err) {
      console.log(err.message)
      return res.status(500).send({ status: false, message: err.message })
   }

}

const updateUser = async function (req, res) {
   try {
      const userId = req.params.userId

      if (!v.isValidObjectId(userId)) return res.status(404).send({ status: false, message: `user not found with this UserId ${userId}` })
      const user = await userModel.findById({ _id: userId })
      if (!user) return res.status(404).send({ status: false, message: `user not found with this UserId ${userId}` })

      let data = req.body
      if (!v.isvalidRequest(data)) return res.status(400).send({ status: false, message: "please Enter data inside request body" })

      const { fname, lname, email, phone, password, address } = data
      let updateData = {}
      if (fname) {
         if (!v.isValidName(fname)) {
            return res.status(400).send({ status: false, message: "fname should be in character" });
         }
         updateData['fname'] = fname
      }
      if (lname) {
         if (!v.isValidName(lname)) return res.status(400).send({ status: false, message: "lname should be in character" })
         updateData['lname'] = lname
      }

      if (email) {
         if (!v.isValidEmail(email)) return res.status(400).send({ status: false, message: "Provide Email in Proper format" })
         const ExistEmail = await userModel.findOne({ email: email })
         if (ExistEmail) res.status(400).send({ status: false, message: 'give another email to update' })
         updateData['email'] = email
      }
      if (phone) {
         if (!v.isValidMobile(phone)) return res.status(400).send({ status: false, message: "Provide Phone number in Proper format" })
         const ExistPhone = await userModel.findOne({ phone: phone })
         if (ExistPhone) res.status(400).send({ status: false, message: 'give another phone to update' })
         updateData['phone'] = phone
      }

      if (password) {
         if (!v.isValidPass(password)) return res.status(400).send({ status: false, message: "Enter password in valid format " })
         const salt = await bcrypt.genSalt(10)
         const hashed = await bcrypt.hash(password, salt)
         updateData['password'] = hashed
      }
      if (address) {
         address = JSON.parse(address)
         if (Object.keys(address).length == 0) return res.status(400).send({ status: false, message: "Please Enter the address in object form" })
         if (address.shipping) {
            let { street, city, pincode } = address.shipping
            if (street) {
               if (!v.isValidString(street)) return res.status(400).send({ status: false, message: "Please Enter valid Street" })
               address['shipping.street'] = street
            }
            if (city) {
               if (!v.isValidString(city)) return res.status(400).send({ status: flase, message: "Please Enter valid city" })
               address['shipping.city'] = city
            }
            if (pincode) {
               if (!v.isvalidPincode(pincode)) return res.status(400).send({ status: false, message: "Please Enter Six digit Pincode" })
               address['shipping.pincode'] = pincode
            }
         }

         if (address.billing) {
            let { street, city, pincode } = address.billing
            if (street) {
               if (!v.isValidString(street)) return res.status(400).send({ status: false, message: "Please Enter valid Street" })
               address['billing.street'] = street
            }
            if (city) {
               if (!v.isValidString(city)) return res.status(400).send({ status: false, message: "Please Enter valid city" })
               address['billing.city'] = city
            }
            if (pincode) {
               if (!v.isvalidPincode(pincode)) return res.status(400).send({ status: false, message: "Please Enter Six digit Pincode" })
               address['billing.pincode'] = pincode
            }
         }
         updateData[address] = address
      }
      const files = req.files
      if (files.length != 0) {
         const uploadedFileURL = await aws.uploadFile(files[0])
         updateData['profileImage'] = uploadedFileURL;
      }
      const updateduserprofile = await userModel.findOneAndUpdate({ _id: userId }, updateData, { new: true })
      return res.status(200).send({ status: true, message: "updated user data", data: updateduserprofile })

   }
   catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
   }
}

module.exports = { userCreate, getUserDetails, userLogin, updateUser }
