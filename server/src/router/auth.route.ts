import express        from "express";
import AuthController from "@/controller/auth.controller";
import AuthService from "@/service/auth/auth.service.impl";
import UserRepository from "@/repository/user/user.repository.impl";
import AuthRepository from "@/repository/auth/auth.repository.impl";

const router = express.Router();

const controller: AuthController = new AuthController(
  new AuthService(
    new AuthRepository(),
    new UserRepository()
  )
);

router.post("/register",           controller.register);
router.post("/login",              controller.login);
router.post("/forgot-password",    controller.forgotPassword);
router.get("/reset-password-form", controller.resetPasswordForm);
router.post("/reset-password",     controller.resetPassword);
router.get("/logout",              controller.logout);

export default router;