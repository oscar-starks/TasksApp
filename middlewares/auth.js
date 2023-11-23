const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const authSchema = require('../schema/user');


const verifyJWTMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    if (!authHeader) return res.status(401).json({"message": "authorization header not set"});

    const authToken = authHeader.split(' ')[1];
    jwt.verify(
        authToken,
        process.env.SECRET_KEY,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({"message":"authorization failed"});
            }
            else{
                if(decoded.id){
                    id = decoded.id;    
                    user =  authSchema.userCollection.findById(id)
                            .then(function(user) {
                                if (!user){
                                    res.status(403).json({"message":"authorization failed"})
                                }else{
                                    req.user = user
                                    next()
                                }
                        
                            })

                }else{
                    res.status(403).json({"message":"authorization failed"})
                }
            }
          
        }
    )

}

const verifyAdminMiddleware = (req, res, next) => {
    console.log(req.user.role)
    if (req.user.role !== "admin"){
        res.status(401).json({"message":"only admin is allowed"})
   }

}


const socketAuthMiddleware = (token) => {
    const [tokenType, jwtkey] = token.split(" ");

    if (tokenType == "Bearer") {

        jwt.verify(
            authToken,
            process.env.SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    return {
                        "error": "authorization failed",
                        "user_details": null
                    }
                }
                else{
                    if(decoded.id){
                        id = decoded.id;    
                        user =  authSchema.userCollection.findById(id)
                                .then(function(user) {
                                    if (!user){
                                        return {
                                            "error": "authorization failed",
                                            "user_details": null
                                        }
                                    }else{
                                        return {
                                            "error": null,
                                            "user_details": user
                                        }
                                    }
                            
                                })
    
                    }else{
                        res.status(403).json({"message":"authorization failed"})
                    }
                }
              
            }
        )
    
    }else{
        return {
            "error": "authorization details not provided",
            "user_details": null
        }
    }

}

module.exports = {
    verifyJWTMiddleware, verifyAdminMiddleware,
    socketAuthMiddleware
}