const express = require("express");
const sentemail = express.Router()

const { neworder } = require("../controllers/SentemailController")
sentemail
    .route("/")
    .post(neworder);


module.exports = sentemail