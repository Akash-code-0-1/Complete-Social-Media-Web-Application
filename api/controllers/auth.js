import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";


export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    // ✅ Update isOnline = 1 on successful login
    db.query("UPDATE users SET isOnline = 1 WHERE id = ?", [data[0].id], (err) => {
      if (err) return res.status(500).json(err);

      // ✅ Send cookie + user data
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    });
  });
};


export const logout = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Format timestamp for SQL
    const lastSeen = moment().format("YYYY-MM-DD HH:mm:ss");

    // Update user's online status and last seen
    const q = "UPDATE users SET isOnline = 0, lastSeen = ? WHERE id = ?";
    db.query(q, [lastSeen, userInfo.id], (err, data) => {
      if (err) return res.status(500).json("Failed to update user status");

      // Clear cookie after DB update
      res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
      }).status(200).json("User has been logged out.");
    });
  });
};



// import { db } from "../connect.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const register = (req, res) => {
//   //CHECK USER IF EXISTS

//   const q = "SELECT * FROM users WHERE username = ?";

//   db.query(q, [req.body.username], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length) return res.status(409).json("User already exists!");
//     //CREATE A NEW USER
//     //Hash the password
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
//     const q =
//       "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

//     const values = [
//       req.body.username,
//       req.body.email,
//       hashedPassword,
//       req.body.name,
//     ];

//     db.query(q, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("User has been created.");
//     });
//   });
// };

// export const login = (req, res) => {
//   const q = "SELECT * FROM users WHERE username = ?";

//   db.query(q, [req.body.username], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length === 0) return res.status(404).json("User not found!");

//     const checkPassword = bcrypt.compareSync(
//       req.body.password,
//       data[0].password
//     );

//     if (!checkPassword)
//       return res.status(400).json("Wrong password or username!");

//     const token = jwt.sign({ id: data[0].id }, "secretkey");

//     const { password, ...others } = data[0];

//     res
//       .cookie("accessToken", token, {
//         httpOnly: true,
//       })
//       .status(200)
//       .json(others);
//   });
// };

// export const logout = (req, res) => {
//   res.clearCookie("accessToken",{
//     secure:true,
//     sameSite:"none"
//   }).status(200).json("User has been logged out.")
// };
