import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        console.log(userId);
        const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
    ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

        // const q = `
        //     SELECT p.*, u.id as userId, u.name, u.profilePic 
        //     FROM posts AS p   
        //     JOIN users AS u ON (u.id = p.userId) 
        //     LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
        //     ORDER BY p.createdAt DESC
        //     `;

        db.query(q, values, (err, data) => {
            if (err) {
                console.error("Database error:", err); // Log the error
                return res.status(500).json(err.message || "Internal Server Error");
            }

            if (data.length === 0) {
                return res.status(404).json("No posts found!");
            }

            return res.status(200).json(data);
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

        db.query(q, [userInfo.id,userInfo.id], (err, data) => {
            db.query(q, [values], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("Post has been created.");
            });
        });
    });
};


// import { db } from "../connect.js";
// import jwt from "jsonwebtoken";
// // import moment from "moment";

// export const getPosts = (req, res) => {

//     const token = req.cookies.accessToken;
//     if (!token) return res.status( 401).json("Not logged in!");

//     jwt.verify(token, "secretkey", (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         const q = `SELECT p.*, u.id as userId, u.name, u.profilePic 
//         FROM posts AS p 
//         JOIN users AS u ON (u.id = p.userId) JOIN relationships AS r ON (p.userId=r.followedUser AND r.followerUserId=? )`;
//         db.query(q, [userInfo.id], (err, data) => {
//             if (err) return res.status(500).json(arr);
//             return res.status(200).json(data);
    
//         });
//     });


    // const q = `SELECT p.* u.id as userId, name, profilePic FROM posts AS p JOIN users AS u ON(u.id=p.userId)`;

    //     // const userId = req.query.userId;
    //     // const token = req.cookies.accessToken;
    //     // if (!token) return res.status( 401).json("Not logged in!");

    //     // jwt.verify(token, "secretkey", (err, userInfo) => {
    //     //     if (err) return res.status(403).json("Token is not valid!");

    //     //     console.log(userId);

    //     //     const q =
    //     //         userId !== "undefined"
    //     //             ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
    //     //             : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    //     // LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
    //     //  `;

    //     //     const values =
    //     //         userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    //     //     db.query(q, values, (err, data) => {
    //     //         if (err) return res.status(500).json(err);
    //     //         return res.status(200).json(data);
    //     //     });
    //     // });

    //     const q=`SELECT p.*, u.id AS uesrId, name, profilePic FROM posts AS p JOIN users AS u ON(u.id=p.userId)`;
    //     db.query(q,(err,data)=>{
    //         if(err) return res.status(500).json(err);
    //         return res.status(200).json(data)
    //     })
// };

// export const addPost = (req, res) => {
//     // const token = req.cookies.accessToken;
//     // if (!token) return res.status(401).json("Not logged in!");

//     // jwt.verify(token, "secretkey", (err, userInfo) => {
//     //     if (err) return res.status(403).json("Token is not valid!");

//     //     const q =
//     //         "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
//     //     const values = [
//     //         req.body.desc,
//     //         req.body.img,
//     //         moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
//     //         userInfo.id,
//     //     ];

//     //     db.query(q, [values], (err, data) => {
//     //         if (err) return res.status(500).json(err);
//     //         return res.status(200).json("Post has been created.");
//     //     });
//     // });
// };
// // export const deletePost = (req, res) => {
// //   const token = req.cookies.accessToken;
// //   if (!token) return res.status(401).json("Not logged in!");

// //   jwt.verify(token, "secretkey", (err, userInfo) => {
// //     if (err) return res.status(403).json("Token is not valid!");

// //     const q =
// //       "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

// //     db.query(q, [req.params.id, userInfo.id], (err, data) => {
// //       if (err) return res.status(500).json(err);
// //       if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
// //       return res.status(403).json("You can delete only your post")
// //     });
// //   });
// // };
