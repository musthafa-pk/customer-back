const express = require("express");
const router = express.Router();
const {
  addAddress,
  deleteAddress,
  getAddress,
  editAddress,
} = require("../controllers/addressbookController");


router
  .route("/:id")
  .post(addAddress)
  .delete(deleteAddress)
  .get(getAddress)
  .patch(editAddress);

  
module.exports = router;
