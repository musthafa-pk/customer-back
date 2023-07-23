const express = require("express");
const {google_logout} = require("../controllers/Google_logout");
const google_log_router = express.Router()


google_log_router.route("/").get(google_logout)







module.exports = google_log_router ; 