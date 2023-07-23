const express = require("express")
const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const jsConvert = require('change-case')

const neworder = (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.in',
        port: 465,
        auth: {
            user: 'support@chavie.com',
            pass: 'GWExAA8yGEnC'
        },
        secure: true,
        tls: {
            rejectUnauthorized: false,
        },
    })
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./view/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./view/'),
    };
    transporter.use('compile', hbs(handlebarOptions))

    const Email = req.body.email
    const count = req.body.count
    var Name = req.body.name;
    console.log(req.body);
    console.log(Email)
    if (count > 0) {
        var mailOptions = {
            from: 'support@chaavie.com', // sender address
            to: Email,
            subject: 'hey aswin', // Subject line
            template: "Neworder",
            context: {
                name: Name,
            },
        }
        // text: `Hello,
        // Your OTP to login to the app is `+Otp,}  
        transporter.sendMail(mailOptions, function (err, info) {
            if (info) {
                return res.status(200).json({
                    msg: "successfully sent email",
                    info: info
                })
            } else {
                return res.status(200).json({
                    Error_explanation: err
                })
            } if (err) {
                return console.log(err)
            }
            console.log('Message sent', info)
            res.status(200).json(info.res)

        })
    }
    else {
        var error = 'email doesnot exist'
        res.status(200).json(error)
    }

}

module.exports = { neworder };