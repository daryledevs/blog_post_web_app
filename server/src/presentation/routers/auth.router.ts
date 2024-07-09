import express        from "express";
import AuthService    from "@/application/services/auth/auth.service.impl";
import AuthController from "@/presentation/controllers/auth.controller";
import UserRepository from "@/infrastructure/repositories/user.repository.impl";
import AuthRepository from "@/infrastructure/repositories/auth.repository.impl";

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