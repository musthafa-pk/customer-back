const pool = require("../db");
const queries = require("../services/addressbookService");
// Add new Address----------------------------------------------------
//route post /addressbook
const addAddress = async (req, res) => {
  const { id } = req.params;
  const {
    address,
    contact,
    address_label,
    district,
    locality,
    category,
    latitude,
    longitude,
  } = req.body;

  try {
    const response = await pool.query(queries.postAddress, [
      address,
      contact,
      id,
      address_label,
      district,
      locality,
      category,
      latitude,
      longitude,
    ]);
    if (response.rowCount === 1) {
      res.status(201).json({
        success: true,
        error: false,
        message: "address added successfully",
      });
    }
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
};
//get address--------------------------------------------------
const getAddress = async (req, res) => {
  const user_id = req.params.id;
  try {
    const response = await pool.query(queries.getAddress, [user_id]);
    if (response.rowCount > 0) {
      res.status(200).json(response.rows);
    } else {
      res.status(404).send("no user found");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//edit addressbook--------------------------------------------------
const editAddress = async (req, res) => {
  const { address, contact, address_label } = req.body;
  const { id } = req.params;
  try {
    const response = await pool.query(queries.updateAddress, [
      address,
      contact,
      address_label,
      id,
    ]);

    if (response.rowCount === 1) {
      res.status(200).json({ message: "address updates" });
    } else {
      res.status(400).json({ error: "could not update address" });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
/*delete address------------------------------------------------*/
// route delete /addressbook
const deleteAddress = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await pool.query(queries.deleteAddress, [id]);
    if (response.rowCount > 0) {
      res.status(200).json({ message: "address deleted successfully" });
    } else {
      res.status(404).json({ error: "no address found" });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { addAddress, deleteAddress, getAddress, editAddress };
