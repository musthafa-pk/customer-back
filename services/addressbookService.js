const getAddress = "SELECT * from address_book WHERE user_id=$1";
const postAddress =
  "INSERT INTO address_book (address, contact, user_id, address_label,district,locality,category,latitude,longitude) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)";
const updateAddress =
  "UPDATE address_book SET address=$1,contact=$2,address_label=$3 WHERE id=$4";
const deleteAddress = "DELETE from address_book WHERE id=$1";

module.exports = {
  getAddress,
  postAddress,
  updateAddress,
  deleteAddress,
};
