"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("@/controller/auth.controller"));
const auth_service_impl_1 = __importDefault(require("@/service/auth/auth.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/repository/user/user.repository.impl"));
const auth_repository_impl_1 = __importDefault(require("@/repository/auth/auth.repository.impl"));
const router = express_1.default.Router();
const controller = new auth_controller_1.default(new auth_service_impl_1.default(new auth_repository_impl_1.default(), new user_repository_impl_1.default()));
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.get("/reset-password-form", controller.resetPasswordForm);
router.post("/reset-password", controller.resetPassword);
router.get("/logout", controller.logout);
exports.default = router;
