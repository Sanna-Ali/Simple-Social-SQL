const connection = require("../config/DB");
const jwt = require("jsonwebtoken");
/**-----------------------------------------------
 * @desc    get user 
 * @route   /user/:id
 * @method  GET
 * @access  private
 * @details Retrieves a user's information from the database
 *          using their unique user ID.
 ------------------------------------------------*/
module.exports.getUser = (req, res) => {
  // Extract the user ID
  const userId = req.params.userId;

  // Query to fetch the user details from the database
  const q = "SELECT * FROM user WHERE id=?";

  // Execute the query
  connection.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};
/**-----------------------------------------------
 * @desc    delete Comment 
 * @route   /user/:id
 * @method  PUT
 * @access  private
 * @details Allows a user to update their profile information.
 *          Verifies the user's identity using a JWT token
 ------------------------------------------------*/
module.exports.updateUser = (req, res) => {
  // Extract the user ID and updated fields
  const userId = req.params.id;
  const updates = req.body;

  // Check if there are any updates provided in the request body
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }
  // Extract the token from cookies
  const token = req.cookies.accessToken;

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Check if the logged-in user matches the user being updated
    if (userInfo.id != userId)
      return res.status(403).json("user himself only can updates his data");

    // Dynamically prepare fields and values for the SQL update query.
    const fields = Object.keys(updates).map((key) => `${key}=?`);
    const values = Object.values(updates);
    const q = `update user set ${fields} where id =?`;

    // Execute the query
    connection.query(q, [...values, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows === 0) {
        return res.status(404).json({ message: "user not found " });
      }
      return res.status(200).json({ message: "update successfully ", data });
    });
  });
};
