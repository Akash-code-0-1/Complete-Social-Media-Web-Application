import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getStories = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = `SELECT s.*, u.name, u.profilePic FROM stories AS s
                   JOIN users AS u ON s.userId = u.id 
                   WHERE s.userId = ? OR s.userId IN (
                       SELECT followedUserId FROM relationships WHERE followerUserId = ?
                   )
                   ORDER BY s.id DESC`;

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};


export const addStory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO stories(`img`, `userId`, `createdAt`) VALUES (?)";
        const values = [
            req.body.img,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Story has been added.");
        });
    });
};

// export const addStory = (req, res) => {
//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("Not logged in!");

//     jwt.verify(token, "secretkey", (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         const q = "INSERT INTO stories(`img`, `userId`) VALUES (?)";
//         const values = [req.body.img, userInfo.id];

//         db.query(q, [values], (err, data) => {
//             if (err) return res.status(500).json(err);
//             return res.status(200).json("Story has been added.");
//         });
//     });
// };
