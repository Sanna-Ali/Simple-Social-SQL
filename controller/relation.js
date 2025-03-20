const connection = require("../config/DB");
const jwt = require("jsonwebtoken");
const moment = require("moment");
/**-----------------------------------------------
 * @desc    get Relationships
 * @route   /Relations/
 * @method  GET
 * @access  private
 * @details Fetches the list of followers for a specific user.
 *          Requires the followedUserId as a query parameter.
 ------------------------------------------------*/
module.exports.getRelationships = (req, res) => {
  // Check if followedUserId is provided
  if (!req.query.followedUserId) {
    return res.status(400).json("followedUserId is required");
  }
  // Query to fetch followers for the specified user
  const q = "SELECT followerUserId FROM relationship WHERE followedUserId = ?";
  // Execute the query
  connection.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId));
  });
};
/**-----------------------------------------------
 * @desc    add Relationship
 * @route   /Relations/add
 * @method  Add
 * @access  private
 * @details Allows an authenticated user to follow another user.
 *          Verifies the user's token, then inserts the relationship into the database.
 ------------------------------------------------*/
module.exports.addRelationship = (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Query to insert a new relationship into the relationship table
    const q =
      "INSERT INTO relationship (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];
    // Execute the query
    connection.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following");
    });
  });
};
/**-----------------------------------------------
 * @desc    add Relationship
 * @route   /Relations/
 * @method  Delete
 * @access  private
 * @details Allows an authenticated user to unfollow another user.
 *          Verifies the user's token, then deletes the relationship from the database.
 ------------------------------------------------*/
module.exports.deleteRelationship = (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not logged in !");
  }
  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    // Query to delete the relationship from the relationship table
    const q = `DELETE FROM relationship WHERE  followerUserId= ? AND followedUserId= ? `;
    // Execute the query
    connection.query(q, [userInfo.id, req.params.id], (err, data) => {
      if (data.affectedRows === 0) {
        return res
          .status(400)
          .json("Relationship not found or already deleted");
      }

      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
//relationship //followerUserId //followedUserId
