const connection = require("../config/DB");
const jwt = require("jsonwebtoken");
const moment = require("moment");
/**-----------------------------------------------
 * @desc    Get Comments
 * @route   /Comment/
 * @method  GET
 * @access  private
 * @details Fetches all comments for a specific post, joining with user data.
 ------------------------------------------------*/
module.exports.getComment = (req, res) => {
  // Check if postId is provided in the query parameters
  if (!req.query.postId) {
    return res.status(400).json("postId is required");
  }

  // Query to fetch comments along with user details for a specific post
  const q = `SELECT c.*,u.id AS userId,name,profilePic FROM COMMENT AS c JOIN user AS u ON (u.id=c.userId) WHERE c.postId=? ORDER BY c.createdAt DESC`;

  // Execute the query
  connection.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) {
      return res.status(400).json("No comments found");
    }

    return res.status(200).json(data);
  });
};
/**-----------------------------------------------
 * @desc    Add Comments
 * @route   /Comment/add
 * @method  POST
 * @access  private
 * @details Adds a comment to a specific post by an authenticated user.
 ------------------------------------------------*/
module.exports.addcomment = (req, res) => {
  // Check if the user is authenticated
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not logged in! ");
  }
  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid ");

    // Query to add a comment to a specific post
    const q =
      "INSERT INTO comment (`description`,`createdAt`,`userId`,`postId`) VALUE (?)";
    const values = [
      req.body.description,
      moment(Date.now()).format("YY-MM-DD  HH:MM:SS"),
      userInfo.id,
      req.body.postId,
    ];
    // Execute the query
    connection.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created ");
    });
  });
};
/**-----------------------------------------------
 * @desc    delete Comment 
 * @route   /Comment/:id
 * @method  DELETE
 * @access  private
 * @details Deletes a comment if it belongs to the authenticated user.
 ------------------------------------------------*/
module.exports.deleteComment = (req, res) => {
  // Check if the user is authenticated
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Check if comment ID is provided
    const commentId = req.params.id;

    // Query to delete a comment by ID and user ID
    const q = "DELETE FROM comment WHERE `id` = ? AND `userId` = ?";

    // Execute the query
    connection.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) {
        return res.status(200).json("Comment has been deleted!");
      }
      return res.status(400).json("Comment not found");
    });
  });
};
