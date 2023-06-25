"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const router = express_1.default.Router();
router.post("/register", auth_1.register);
router.post("/login", auth_1.login);
router.post("/forgot-password", auth_1.forgotPassword);
router.get("/reset-password-form", auth_1.resetPasswordForm);
router.get("/logout", auth_1.logout);
exports.default = router;
