import express from "express";
import { getUser, updateUser, searchUsers } from "../controllers/user.js"; // Import the new search function

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/", updateUser);
router.get("/", searchUsers); // New search route

export default router;






// import express from "express";
// import { getUser , updateUser} from "../controllers/user.js";

// const router = express.Router()

// router.get("/find/:userId", getUser)
// router.put("/", updateUser)


// export default router;