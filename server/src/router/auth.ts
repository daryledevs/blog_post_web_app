import express from "express";
import { login, logout, checkToken } from "../controller/auth";

const router = express.Router();

router.get(`/check-token`, checkToken);
router.post("/login", login);
router.get("/logout", logout);

export default router;