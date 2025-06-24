// controllers/activities.js
import { db } from "../connect.js";
import jwt from "jsonwebtoken";


export const getActivities = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = `
      SELECT * FROM (
        SELECT u.id AS userId, u.name, u.profilePic, p.createdAt, 'posted' AS type, p.desc AS content
        FROM posts p
        JOIN users u ON u.id = p.userId
        WHERE p.userId = ? OR p.userId IN (
          SELECT followedUserId FROM relationships WHERE followerUserId = ?
        )

        UNION ALL

        SELECT u.id AS userId, u.name, u.profilePic, c.createdAt, 'commented' AS type, c.desc AS content
        FROM comments c
        JOIN users u ON u.id = c.userId
        WHERE c.userId = ? OR c.userId IN (
          SELECT followedUserId FROM relationships WHERE followerUserId = ?
        )

        UNION ALL

        SELECT u.id AS userId, u.name, u.profilePic, l.createdAt, 'liked' AS type, '' AS content
        FROM likes l
        JOIN users u ON u.id = l.userId
        WHERE l.userId = ? OR l.userId IN (
          SELECT followedUserId FROM relationships WHERE followerUserId = ?
        )

        UNION ALL

        SELECT u.id AS userId, u.name, u.profilePic, s.createdAt, 'story' AS type, '' AS content
        FROM stories s
        JOIN users u ON u.id = s.userId
        WHERE s.userId = ? OR s.userId IN (
          SELECT followedUserId FROM relationships WHERE followerUserId = ?
        )
      ) AS activities
      ORDER BY createdAt DESC
      LIMIT 10
    `;

        const uid = userInfo.id;
        const values = [uid, uid, uid, uid, uid, uid, uid, uid];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

// export const getActivities = (req, res) => {
//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("Not logged in!");

//     jwt.verify(token, "secretkey", (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         const q = `
//       SELECT u.id AS userId, u.name, u.profilePic, p.createdAt, 'posted' AS type, p.desc AS content
//       FROM posts p
//       JOIN users u ON u.id = p.userId
//       WHERE p.userId = ? OR p.userId IN (
//         SELECT followedUserId FROM relationships WHERE followerUserId = ?
//       )
//       ORDER BY p.createdAt DESC
//       LIMIT 5
//     `;

//         db.query(q, [userInfo.id, userInfo.id], (err, data) => {
//             if (err) return res.status(500).json(err);
//             return res.status(200).json(data);
//         });
//     });
// };

