import express from "express";
import { register, login, logout, resetPasswordForm, forgotPassword, resetPassword } from "../controller/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password-form", resetPasswordForm);
router.post("/reset-password", resetPassword);
router.get("/logout", logout);

export default router;