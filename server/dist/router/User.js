"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../controller/User");
const router = express_1.default.Router();
router.post('/register', User_1.Register);
router.post('/login', User_1.Login);
router.get('/logout', User_1.Logout);
exports.default = router;
