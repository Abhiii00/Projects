const jwt = require('jsonwebtoken')


const authentication = function (req, res, next) {
    try {
        let token = req.Authorisation
        if (!token) {
            res.status(400).send({ err: "token is not present" })
        }
        
            let decodedtoken = jwt.verify(token, "finalProject")
            User = decodedtoken.UserId

           
            
            next()
            
          } catch (err) {
            return res.status(400).send({ status: false, msg: `${err.message} please check your token` })
        }
    } 

    const authorisation = async function (req, res, next) {

        try {
            let anyId = req.params.anyId
            let findAnyData = await anyModel.find({anyId})
            if (!findAnyData) return res.status(404).send({ status: false, msg: "" })
    
            let UserId = findAnyData.anyId
            let decodedToken = User


            if (UserId != decodedToken) {
                return res.status(401).send({ status: false, msg: "you are not authorise person " })
            }
            next()
        } catch (err) {
            return res.status(500).send({msg:err.message })
        }
    
    }

module.exports.authentication = authentication
module.exports.authorisation = authorisation

