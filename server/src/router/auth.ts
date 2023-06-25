import express from "express";
import { register, login, logout, resetPasswordForm, forgotPassword } from "../controller/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password-form", resetPasswordForm);
router.get("/logout", logout);

export default router;