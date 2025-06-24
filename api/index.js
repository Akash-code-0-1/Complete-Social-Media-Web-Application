import express from "express";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";
import postRoutes from "./routes/posts.js";
import relationshipRoutes from "./routes/relationships.js";
import storyRoutes from "./routes/stories.js";
import friendsRouter from "./routes/friends.js";
import suggestedFriendsRoutes from "./routes/suggestedFriends.js";
import activityRoutes from "./routes/activities.js";
import notificationRoutes from "./routes/notifications.js";
import onlineFriendsRoutes from "./routes/onlineFriends.js";








import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

// Middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // ✅ Needed to send cookies
  })
);

app.use(express.json());         // ✅ Parse JSON request bodies
app.use(cookieParser());         // ✅ Parse cookies from requests


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});



app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/friends", friendsRouter);
app.use("/api/suggestedFriends", suggestedFriendsRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/onlineFriends", onlineFriendsRoutes);







app.listen(8800, () => {
  console.log("Connected to Backend!");
})