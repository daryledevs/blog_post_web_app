"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const path_util_1 = __importDefault(require("./application/utils/path.util"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_router_1 = __importDefault(require("./presentation/routers/auth.router"));
const user_router_1 = __importDefault(require("./presentation/routers/user.router"));
const chat_router_1 = __importDefault(require("./presentation/routers/chat.router"));
const post_router_1 = __importDefault(require("./presentation/routers/post.router"));
const feed_router_1 = __importDefault(require("./presentation/routers/feed.router"));
const compression_1 = __importDefault(require("compression"));
const dotenv = __importStar(require("dotenv"));
const rate_limiter_middleware_1 = __importDefault(require("./presentation/middlewares/rate-limiter.middleware"));
const cors_option_config_1 = __importDefault(require("./config/cors-option.config"));
const helmet_config_1 = __importDefault(require("./config/helmet.config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_handler_helper_1 = __importDefault(require("./presentation/helpers/error-handler.helper"));
const token_handler_middleware_1 = __importDefault(require("./presentation/middlewares/token-handler.middleware"));
const cookie_options_middleware_1 = __importDefault(require("./presentation/middlewares/cookie-options.middleware"));
dotenv.config();
const app = (0, express_1.default)();
const API = process.env.API;
app.disable("x-powered-by");
app.use((0, helmet_1.default)(helmet_config_1.default));
app.use(rate_limiter_middleware_1.default);
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(cookie_options_middleware_1.default);
app.use((0, cors_1.default)(cors_option_config_1.default));
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json({ limit: "50kb" }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(token_handler_middleware_1.default);
app.set("views", path_util_1.default); // Set the views directory
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use((0, morgan_1.default)("tiny"));
// Routes
app.use(`${API}/auth`, auth_router_1.default);
app.use(`${API}/chats`, chat_router_1.default);
app.use(`${API}/users`, user_router_1.default);
app.use(`${API}/posts`, post_router_1.default);
app.use(`${API}/feeds`, feed_router_1.default);
app.use(error_handler_helper_1.default);
exports.default = app;
