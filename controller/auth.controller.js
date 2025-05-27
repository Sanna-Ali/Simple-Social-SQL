const connection = require("../config/DB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/**-----------------------------------------------
 * @desc    Register A New User
 * @route   /auth/register
 * @method  POST
 * @access  public
 * @details Validates input, checks if the user already exists, 
 *          hashes the password, and inserts a new user into the database.
 ------------------------------------------------*/
module.exports.register = (req, res) => {
  // Check if all required fields are provided in the request body
  if (
    !req.body.username ||
    !req.body.email ||
    !req.body.password ||
    !req.body.name ||
    !req.body.city ||
    !req.body.coverPic ||
    !req.body.profilePic ||
    !req.body.website
  ) {
    return res.status(400).json("All required fields must be provided");
  }

  //check user if exists
  const q = `SELECT * FROM user WHERE email =?`;
  connection.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) {
      return res.status(400).json("user already exists");
    }

    // Create A New User AND Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    const q = ` INSERT INTO user (username, email,password, name,coverPic,profilePic,city,website) VALUE (?) `;
    const values = [
      req.body.username,
      req.body.email,
      hashPassword,
      req.body.name,
      req.body.coverPic,
      req.body.profilePic,
      req.body.city,
      req.body.website,
    ];

    // Execute the query to insert the new user
    connection.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("user registered successfully");
    });
  });
};
/**-----------------------------------------------
 * @desc   login User
 * @route   /auth/login
 * @method  POST
 * @access  public
 * @details Authenticates the user by verifying the email and password, 
 *          generates a JWT token, and sets it in a cookie.
 ------------------------------------------------*/
module.exports.login = (req, res) => {
  // Check if email and password are provided in the request body
  if (!req.body.email || !req.body.password) {
    return res.status(400).json("All required fields must be provided");
  }
  // Query to find the user by email
  const q = `SELECT email,password,id from user where email=?`; //
  connection.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("user not found");
    console.log(data);

    // Compare the provided password with the hashed password in the database
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword) return res.status(400).json("wrong password or email");
    const { password, ...others } = data[0];

    // Create a JWT token for the user
    const token = jwt.sign(
      { id: data[0].id, email: data[0].email },
      process.env.JWT_SECRET
    );
    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .json(token);
  });
};
/**-----------------------------------------------
 * @desc   logout User
 * @route   /auth/logout
 * @method  POST
 * @access  private
 * @details Clears the authentication cookie to log the user out.
 ------------------------------------------------*/
module.exports.logout = (req, res) => {
  // Clear the accessToken cookie to log out the user
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("user has been logged out");
};
