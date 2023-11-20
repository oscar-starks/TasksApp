const path = require('path');
const schema = require('../schema/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
secretKey = process.env.SECRET_KEY
const {validationResult } = require('express-validator');
var nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');


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
        otp = Math.floor(Math.random() * Math.floor(9999));
        const salt = bcrypt.genSaltSync(10);
        const hashedOTP = bcrypt.hashSync(otp.toString(), salt);

        accountRecovery = await schema.recoverySchema.create({"user": user.id, "otp":hashedOTP})

        var transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.SMTP_PASSWORD
            }
          });

        const templateDir = path.join(__dirname, '..', 'emails');
        
        const source = fs.readFileSync(path.join(templateDir, 'recovery.hbs'), 'utf8');

        // Compile the template using Handlebars
        const template = handlebars.compile(source);

        // Set up Nodemailer to use Handlebars for HTML rendering
        transporter.use('compile', (mail, callback) => {
            if (mail.data.html) {
                // If HTML content is present, compile it using the Handlebars template
                mail.data.html = template(mail.data.context);
            }
            callback();
        });

        context = {
                'username': user.fullName,
                'otp': otp.toString()
            }

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: req.body.email,
            subject: 'Account Recovery Email',
            context: context, 
            html: template
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
         });

        res.status(200).json({"message":"email sent successful",
                              "event_id":accountRecovery.id
                            })
        }

}

const confirmOTPController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const otp_instance = await schema.recoverySchema.findOne({_id:req.body.event_id, verified:false})
    .then((instance) => {
        if (instance){
            otp = req.body.otp;

            const otpMatch = bcrypt.compareSync(otp, instance.otp);

            if (otpMatch){
                instance.verified = true;
                instance.save();
                res.status(200).send({"message":"instance verified"})

            }else {
                res.status(400).json({"message":'No matching otp found'});
      
              }
        
        } else {
          res.status(400).json({"message":'No matching otp found'});

        }
      })
      .catch((error) => {
        console.log("new error from confirmOTPController view, error: " + error.message);
        res.status(500).json({'message':"something went wrong, please contact the administrator"})
      });

}

const newPasswordController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const otp_instance = await schema.recoverySchema.find({_id:req.body.event_id, verified:true, used:false}).populate('user')
    .then((instance) => {
        if (instance.length > 0) {

            instance = instance[0]

            const user = instance.user
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            user.password = hashedPassword
            user.save();

            instance.used = true;
            instance.save();

            res.status(200).send({message: "password set successfully"});

    }else{
        res.status(400).send({message: "instance not found"});

    }}
    ).catch((error) => {
        console.log("new error from newPasswordController view, error: " + error.message);
        res.status(500).json({'message':"something went wrong, please contact the administrator"})
      });


}

module.exports = {
    registerUserController, loginController, 
    accountRecoveryController, confirmOTPController,
    newPasswordController
}