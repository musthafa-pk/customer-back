const express = require("express");
const {
  newOrder,
  getIndividualCost,
  getDistricts,
  locality_datas,
} = require("../controllers/OrderController");

const router = express.Router();

router.route("/").post(newOrder);
router.route("/get_individual_cost").post(getIndividualCost);
router.route("/getdistricts").get(getDistricts);
router.route("/get_locality").post(locality_datas);
module.exports = router;
