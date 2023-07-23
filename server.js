const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const PORT = 3000;
const { hostname } = require("os");
const app = express();
const addressbookRoutes = require("./routes/addressbookRoutes");
const sentemail = require("./routes/Sentemail");
const orderroute = require("./routes/OrdreRouter");
const passport = require('passport');
const session = require('express-session');
const authRouter = require("./routes/Google_Authentification");
require('./models/googleAuth'); // Import the authentication logic


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: 'YOUR_SESSION_SECRET',
    resave: false,
    saveUninitialized: false,
  })
);


// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Mount authentication router
app.use('/', authRouter);


app.use("/addressbook", addressbookRoutes);
app.use("/sentemail", sentemail)
app.use("/orders", orderroute)
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}:${hostname}`);
});
