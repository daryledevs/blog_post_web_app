"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const checkTkn_1 = __importDefault(require("../middleware/checkTkn"));
const router = express_1.default.Router();
router.use(checkTkn_1.default);
router.post("/register", user_1.register);
router.get("/", user_1.userData);
router.get("/follow/:followed_id/:follower_id", user_1.followUser);
router.get("/followers/:user_id", user_1.getFollowers);
exports.default = router;
