import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// Existing getUser function
export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";
  
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

// Controller to search users by name (case-insensitive)
export const searchUsers = (req, res) => {
  // Get the search query from the request and convert it to lowercase
  const searchQuery = req.query.search.toLowerCase();

  // SQL query with LOWER() function to make it case-insensitive
  const query = "SELECT * FROM users WHERE LOWER(name) LIKE ?";

  // Execute the query with the search term
  db.query(query, [`%${searchQuery}%`], (err, data) => {
    if (err) {
      console.error('Error executing query', err);
      return res.status(500).json(err);
    }

    // If no results found
    if (data.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Send back the search results
    return res.json(data);
  });
};


// Existing updateUser function
export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your profile!");
      }
    );
  });
};





// import { db } from "../connect.js";
// import jwt from "jsonwebtoken";

// export const getUser = (req, res) => {
//   const userId = req.params.userId;
//   const q = "SELECT * FROM users WHERE id=?";

//   db.query(q, [userId], (err, data) => {
//     if (err) return res.status(500).json(err);
//     const { password, ...info } = data[0];
//     return res.json(info);
//   });
// };

// // Example of your updateUser function to handle image files
// export const updateUser = (req, res) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, "secretkey", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");

//     const q =
//       "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";

//     db.query(
//       q,
//       [
//         req.body.name,
//         req.body.city,
//         req.body.website,
//         req.body.profilePic,  // Profile picture URL
//         req.body.coverPic,    // Cover picture URL
//         userInfo.id,         // The user's ID
//       ],
//       (err, data) => {
//         if (err) res.status(500).json(err);
//         if (data.affectedRows > 0) return res.json("Updated!");
//         return res.status(403).json("You can update only your profile!");
//       }
//     );
//   });
// };
