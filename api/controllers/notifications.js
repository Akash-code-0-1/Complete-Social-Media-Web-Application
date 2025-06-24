import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getNotifications = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token invalid!");

    const q = `
      SELECT u.id AS fromUserId, u.name AS fromName, u.profilePic AS fromPic,
             'liked' AS type, l.createdAt, l.postId, p.img AS postImg
      FROM likes l
      JOIN users u ON u.id = l.userId
      JOIN posts p ON p.id = l.postId
      WHERE p.userId = ?

      UNION

      SELECT u.id AS fromUserId, u.name AS fromName, u.profilePic AS fromPic,
             'commented' AS type, c.createdAt, c.postId, p.img AS postImg
      FROM comments c
      JOIN users u ON u.id = c.userId
      JOIN posts p ON p.id = c.postId
      WHERE p.userId = ?

      ORDER BY createdAt DESC
      LIMIT 10
    `;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
