const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const authSchema = require('../schema/user');
const { json } = require('express');


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

};

const verifyAdminMiddleware = (req, res, next) => {
    console.log(req.user.role)
    if (req.user.role !== "admin"){
        res.status(401).json({"message":"only admin is allowed"})
   }

};


const socketAuthMiddleware = async function(token, socket){

    if (token == null){
        return {
            "error": "authorization details not provided",
            "user_details": null
        }
    }

    const [tokenType, jwtkey] = token.split(" ");

    if (tokenType == "Bearer") {

        jwt_data = jwt.verify(
            jwtkey,
            process.env.SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    return {
                        "error": "authorization failed",
                        "user_id": null
                    }
                }
                else{
                    if(decoded.id){
                        id = decoded.id;  

                        return {
                            "error": null,
                            "user_id": id
                        }
                    

                    }else{
                        return {
                            "error": "authorization failed",
                            "user_id": null
                        }
                    }
                }
              
            }
        )

        if (jwt_data.user_id != null){
            user =  await authSchema.userCollection.findById(jwt_data.user_id);
            if (user){
                return {
                    "error":null,
                    "user_details":user
                }
            }else{
                return {
                    "error":"authorization failed",
                    "user_details":null
                }
            }

        }else{
            return {
                "error":"authorization failed",
                "user_details":null
            }
        }

    
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