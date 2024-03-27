import express        from "express";
import AuthController from "../controller/auth.controller";

const router = express.Router();
const controller: AuthController = new AuthController();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.get("/reset-password-form", controller.resetPasswordForm);
router.post("/reset-password", controller.resetPassword);
router.get("/logout", controller.logout);

export default router;