import express from "express";
import { register, userData } from "../controller/user";
import checkTkn from "../middleware/checkTkn";
const router = express.Router();

router.post("/register", register);

router.use(checkTkn);
router.get(`/`, userData);

export default router;
