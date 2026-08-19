import {Router} from "express";
import { registerUser,login,logoutUser, verifyEmail, refreshAccessToken, forgotPasswordRequest} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator , userLoginValidator,} from "../validators/index.js";
import{verifyJWT} from "../middlewares/auth.middleware.js";


const router = Router()
//unsecured routes
//router.post("/register",registerUser)
router.route("/register").post(userRegisterValidator(),validate , registerUser);
router.route("/login").post(userLoginValidator(),validate,login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPasswordRequest)



//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
export default router;