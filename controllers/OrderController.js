const express = require("express");
const pool = require("../db");
const { assign } = require("nodemailer/lib/shared");

const haversine = require("haversine");

/* new order --------------------------------------  */

const newOrder = async (req, res) => {

  try {

      var shipment = [];

      var icount = "";

      var booking_details = [];

      const shipmentDatas = req.body.shipment;

      const booking_IDgen = await pool.query("SELECT MAX(id) FROM booking_tables");

      // console.log("result", booking_IDgen)

      neworder = (booking_IDgen.rows[0].max + 1).toString();

      const prefix = "ST";

      const today_date = new Date();

      console.log(today_date.getDate());

      const day = ("0" + today_date.getDate()).slice(-2);

      const month = ("0" + (today_date.getMonth() + 1)).slice(-2);

      const year = today_date.getFullYear();

      // var day = "04";

      // var month = "11";

      // var year = "2022";

      const order = "000" + neworder.slice(-6);

      const booking_ID = prefix + year + month + day + order;

      // console.log("booking id>>>>>>>>>>>>>>",booking_ID);

      var product_length = {};

      var successfulInsertions = 0; // Counter for successful insertions



      for (let i = 0; i < shipmentDatas.length; i++) {

          product_length = shipmentDatas[i].products.length;

          // console.log(j);

          const booking_id = booking_ID + i;

          const from = req.body.from;

          const to = req.body.shipment[i].to;

          const date = req.body.date;

          const user = req.body.user;

          const cost = req.body.shipment[i].cost;

          const payment = req.body.payment;



          pool.query(

              "INSERT INTO booking_tables (order_id,user_name,from_location,to_location,booking_date,cost,payment_status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING  id",

              [

                  booking_id,

                  user,

                  from,

                  to,

                  date,

                  cost,

                  payment,

              ],

              (error, results) => {

                  if (error) {

                      throw error;

                  }

                  console.log("id", results);

                  for (let j = 0; j < product_length; j++) {

                      // console.log(j);

                      const booking_id = results.rows[0].id;

                      const product_name = req.body.shipment[i].products[j].product;

                      const count = req.body.shipment[i].products[j].count;

                      const product_type = req.body.shipment[i].products[j].type;

                      const size = req.body.shipment[i].products[j].size.toLowerCase();

                      var length = "";

                      var breadth = "";

                      var height = "";

                      var breadth = "";

                      var weight = "";

                      if (size == "s") {

                          length = "1";

                          breadth = "1";

                          height = "1";

                          weight = "1";

                      } else if (size == "m") {

                          length = "2";

                          breadth = "2";

                          height = "2";

                          weight = "2";

                      } else if (size == "l") {

                          length = "3";

                          breadth = "3";

                          height = "3";

                          weight = "3";

                      }



                      console.log("shipment details>>>>>>>>>", size);

                      const weight_unit = "KG";

                      const volume_unit = "CM";

                      pool.query(

                          "INSERT INTO shipment_details (booking_id,package_type,product,length,breadth,height,weight,count,weight_unit,volume_unit) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",

                          [

                              booking_id,

                              product_type,

                              product_name,

                              length,

                              breadth,

                              height,

                              weight,

                              count,

                              weight_unit,

                              volume_unit,

                          ],

                          (error, result) => {

                              if (error) {

                                  throw error;

                              }



                              successfulInsertions++; // Increment successful insertions counter



                              if (successfulInsertions === shipmentDatas.length * product_length) {

                                  // Check if all insertions are completed

                                  if (result.rowCount > 0) {

                                      return res.status(200).json({

                                          error: false,

                                          success: true,

                                          msg: "successfully inserted data ",

                                      });

                                  }

                              }

                          }

                      );

                  }

              }

          );

      }

      // console.log("booking details>>>>>>>>>", booking_details);

      // console.log("datas", booking_details);

  } catch (error) {

      console.log("err", error);

  }



  // console.log("booking table", booking_table);

};


/* individual cost -------------------------------  */
const getIndividualCost = async (req, res) => {
  const { from, to } = req.body;
  let size = req.body.size;
  size = size.toLowerCase();
  const fromDistrict = from.district;
  const fromLocality = from.locality;
  const toDistrict = to.district;
  const toLocality = to.locality;
  // const type = req.body.type;
  // console.log(type, "type>>>");
  const start = {
    latitude: from.latitude,
    longitude: from.longitude,
  };

  const end = {
    latitude: to.latitude,
    longitude: to.longitude,
  };
  // const distance = 100;
  const distance = haversine(start, end);

  try {
    const response = await pool.query(
      "SELECT * FROM short_haul_pricing WHERE origin_district=$1 AND destination_district=$2",
      [fromDistrict, toDistrict]
    );
    // let data; //need to change if type  passed as medicine from  FE
    // if (type === "medicine") {
    //   data = response.rows[1];
    // } else {
    //   data = response.rows[0];
    // }
    const data = response.rows[0];
    const distance_ceiling = data.distance_ceiling;

    if (size === "s") {
      const priceBySize = data.small;
      if (distance <= distance_ceiling) {
        res.status(200).json({
          msg: "success",
          error: false,
          success: true,
          cost: priceBySize,
        });
      } else {
        let cost = (priceBySize / distance_ceiling) * distance;
        cost = Math.round(cost);
        res.status(200).json({
          msg: "success",
          error: false,
          success: true,
          cost: cost,
        });
      }
    } else if (size === "m") {
      const priceBySize = data.medium;
      if (distance <= distance_ceiling) {
        res.status(200).json({
          msg: "success",
          error: false,
          success: true,
          cost: priceBySize,
        });
      } else {
        let cost = (priceBySize / distance_ceiling) * distance;
        cost = Math.round(cost);
        res.status(200).json({
          msg: "success",
          error: false,
          success: true,
          cost: cost,
        });
      }
    } else if (size === "l") {
      const priceBySize = data.large;
      if (distance <= distance_ceiling) {
        res.status(200).json({
          msg: "success",
          error: false,
          success: true,
          cost: priceBySize,
        });
      } else {
        let cost = (priceBySize / distance_ceiling) * distance;
        cost = Math.round(cost);
        res.status(200).json({
          msg: "success",
          error: false,
          success: true,
          cost: cost,
        });
      }
    } else if (size === "xl") {
      const priceBySize = data.extra_large;
      if (distance <= distance_ceiling) {
        res.status(200).json({
          msg: "success",
          error: false,
          success: true,
          cost: priceBySize,
        });
      } else {
        let cost = (priceBySize / distance_ceiling) * distance;
        cost = Math.round(cost);

        res.status(200).json({
          msg: "success",
          error: false,
          success: true,
          cost: cost,
        });
      }
    }
    // console.log("success")
  } catch (err) {
    throw err;
  }
};

/* individual cost -------------------------------  */


const getDistricts = async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT destination_district FROM short_haul_pricing"
    );
    console.log(response.rows);
    const uniqueDestinationDistricts = [];

    for (const row of response.rows) {
      let destinationDistrict = row.destination_district;
      destinationDistrict = destinationDistrict.toUpperCase();

      if (!uniqueDestinationDistricts.includes(destinationDistrict)) {
        uniqueDestinationDistricts.push(destinationDistrict);
      }
    }

    res.status(200).json({
      success: true,
      error: false,
      msg: "success",
      districts: uniqueDestinationDistricts,
    });
  } catch (err) {
    throw err;
  }
};

const locality_datas = async (req, res) => {
  try {
    const district_name = req.body.district.toLowerCase();
    console.log("hey");
    const localitydatas = await pool.query(
      "SELECT * FROM locality_data WHERE district=$1",
      [district_name]
    );
    console.log("locality_dataa==========>", localitydatas);

    if (localitydatas.rowCount >= 1) {
      console.log("locality_dataa==========>");

      const filter = localitydatas.rows.map((locality) => {
        return locality.locality.toUpperCase();
      });
      console.log(filter);
      if (filter) {
        return res.status(200).json({
          error: false,
          success: true,
          msg: "successfully get data",
          locality: filter,
        });
      } else {
        return res.status(200).json({
          error: true,
          success: false,
          msg: "error",
          locality: error,
        });
      }
    } else {
      return res.status(200).json({
        error: true,
        success: false,
        msg: "error",
        locality: "not get data from table",
      });
    }
  } catch (error) {
    console.log("err", error);
  }
};

module.exports = { newOrder, getIndividualCost, getDistricts, locality_datas };
