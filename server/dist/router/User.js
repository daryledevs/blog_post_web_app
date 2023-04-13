"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const checkTkn_1 = __importDefault(require("../middleware/checkTkn"));
const router = express_1.default.Router();
router.post("/register", user_1.register);
router.use(checkTkn_1.default);
router.get(`/`, user_1.userData);
exports.default = router;
