const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const v = require('../validations/validation')


const authentication = function (req, res, next) {
    try {
        const token = req.headers['authorization'].split(" ").pop()
        if (!token) { res.status(400).send("Please Enter Token") }

        let decodedtoken = jwt.verify(token, "g60bhoramp");

        if (!decodedtoken) {
            return res.status(401).send({ status: false, message: "This Token Is Invalid" });
        }

        req.userId = decodedtoken.userId;  //for using globally
        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const authorisation = async function (req, res, next) {

    try {
        const userId = req.params.userId
        if (userId) {
            if (!v.isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: "Please Enter Valid User Id" })
            }

            const User = await userModel.findById({ _id: userId })
            if (!User) {
                return res.status(404).send({ status: false, message: "User Not Found" })
            }
            if (userId !== req.userId) {
                return res.status(403).send({ status: false, message: "Access Denied" })
            }

            next()
        }
    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }

}


module.exports= {authentication,authorisation}

