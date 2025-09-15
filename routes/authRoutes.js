import { Router } from "express";
import { login, googleAuth, logout, userDetails, updateUser, sendOTP, verifyOTP, addDetails } from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/google", googleAuth);
authRouter.get("/logout", authMiddleware, logout);
authRouter.get("/user/details", authMiddleware, userDetails);
authRouter.patch("/user/update", authMiddleware, updateUser);
authRouter.post("/user/send/otp", sendOTP);
authRouter.post("/user/verify/otp", verifyOTP);
authRouter.post("/user/add", addDetails);

export default authRouter;