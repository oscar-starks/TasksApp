const path = require('path');
const schema = require('../schema/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
secretKey = process.env.SECRET_KEY
const {validationResult } = require('express-validator');
var nodemailer = require('nodemailer');
const { request } = require('http');


const registerUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    user = await schema.userCollection.findOne({"email": req.body.email})

    if(!user) {
        await schema.userCollection.create({
            fullName:req.body.fullName,
            password:hashedPassword,
            email:req.body.email,
        })
    
        res.status(201).json({"message":"new user created" })
    }else{
        res.status(400).json({"message":"user with that email already exists" })

    }
}

const loginController = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    user = await schema.userCollection.findOne({"email": req.body.email})

    if(!user) {
        res.status(404).json({"message":"user with that email does not exist" })

    }else{
        const passwordMatch = bcrypt.compareSync(req.body.password, user.password)

        if (passwordMatch){
            userData = (({ email, fullName, createdAt, role, id }) => ({ email, fullName, createdAt, role, id }))(user);
            const token = jwt.sign({
                email: user.email,
                id: user.id,
                fullName: user.fullName,
                role: user.role,
                createdAt: user.createdAt
            }, secretKey)

            res.status(200).json({"message":"authentication successful", token:token})
        }
        else{
            res.status(400).json({"message":"invalid credentials"})

        }

}
}


const accountRecoveryController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    user = await schema.userCollection.findOne({"email": req.body.email})

    if(!user) {
        res.status(404).json({"message":"user with that email does not exist" })

    }else{
        var transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.SMTP_PASSWORD
            }
          });
      
        var mailOptions = {
            from: process.env.USER_EMAIL,
            to: req.body.email,
            subject: 'Sending Email',
            text: 'THIS IS A TEST EMAIL'
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            res.status(500).json({message: error.message});

            }
        
        
        });
        console.log("email has been sent to " + req.body.email )
        res.status(200).json({"message":"email sent successful"})
        }
      
        
}

module.exports = {
    registerUserController, loginController, accountRecoveryController
}