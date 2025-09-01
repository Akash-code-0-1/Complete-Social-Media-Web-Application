// import { db } from "../connect.js";
// import jwt from "jsonwebtoken";
// import moment from "moment";

// export const getPosts = (req, res) => {
//     const userId = req.query.userId;
//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("Not logged in!");

//     jwt.verify(token, "secretkey", (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         console.log(userId);
//         const q =
//       userId !== "undefined"
//         ? `SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
//         : `SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
//     LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
//     ORDER BY p.createdAt DESC`;

//     const values =
//       userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

//         // const q = `
//         //     SELECT p.*, u.id as userId, u.name, u.profilePic 
//         //     FROM posts AS p   
//         //     JOIN users AS u ON (u.id = p.userId) 
//         //     LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
//         //     ORDER BY p.createdAt DESC
//         //     `;

//         db.query(q, values, (err, data) => {
//             if (err) {
//                 console.error("Database error:", err); // Log the error
//                 return res.status(500).json(err.message || "Internal Server Error");
//             }

//             if (data.length === 0) {
//                 return res.status(404).json("No posts found!");
//             }

//             return res.status(200).json(data);
//         });
//     });
// };


// export const addPost = (req, res) => {
//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("Not logged in!");

//     jwt.verify(token, "secretkey", (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         const q =
//             "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
//         const values = [
//             req.body.desc,
//             req.body.img,
//             moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
//             userInfo.id,
//         ];

// db.query(q, [values], (err, data) => {
//   if (err) return res.status(500).json(err);
//   return res.status(200).json("Post has been created.");
// });

//     });
// };



import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId; // optional: profile userId
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    let q;
    let values = [];

    if (userId) {
      // Fetch posts for a specific profile
      q = `SELECT p.*, u.id AS userId, u.name, u.profilePic
           FROM posts AS p
           JOIN users AS u ON u.id = p.userId
           WHERE p.userId = ?
           ORDER BY p.createdAt DESC`;
      values = [userId];
    } else {
      // Feed posts: own posts + posts from followed users
      q = `SELECT DISTINCT p.*, u.id AS userId, u.name, u.profilePic
           FROM posts AS p
           JOIN users AS u ON u.id = p.userId
           LEFT JOIN relationships AS r ON p.userId = r.followedUserId
           WHERE p.userId = ? OR r.followerUserId = ?
           ORDER BY p.createdAt DESC`;
      values = [userInfo.id, userInfo.id];
    }

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json(err.message || "Internal Server Error");
      }

      res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};
