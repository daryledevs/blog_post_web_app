"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const router = express_1.default.Router();
router.get(`/check-token`, auth_1.checkToken);
router.post("/login", auth_1.login);
router.get("/logout", auth_1.logout);
exports.default = router;
