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
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("./config/path"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_route_1 = __importDefault(require("./router/auth.route"));
const user_router_1 = __importDefault(require("./router/user.router"));
const chat_router_1 = __importDefault(require("./router/chat.router"));
const post_router_1 = __importDefault(require("./router/post.router"));
const feed_router_1 = __importDefault(require("./router/feed.router"));
const dotenv = __importStar(require("dotenv"));
const corsOption_1 = __importDefault(require("./config/corsOption"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_handler_1 = __importDefault(require("./helper/error-handler"));
const token_handler_1 = __importDefault(require("./middleware/token-handler"));
const cookie_options_1 = __importDefault(require("./middleware/cookie-options"));
const socket_1 = __importDefault(require("./socket"));
const http_1 = require("http");
dotenv.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = parseInt(process.env.SERVER_PORT ?? "5000");
const HOST = process.env.SERVER_HOST || "localhost";
const API = process.env.API;
app.disable("x-powered-by");
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(cookie_options_1.default);
app.use((0, cors_1.default)(corsOption_1.default));
app.use(token_handler_1.default);
app.set("views", path_1.default); // Set the views directory
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use((0, morgan_1.default)("tiny"));
// Routes
app.use(`${API}/`, auth_route_1.default);
app.use(`${API}/chats`, chat_router_1.default);
app.use(`${API}/users`, user_router_1.default);
app.use(`${API}/posts`, post_router_1.default);
app.use(`${API}/feeds`, feed_router_1.default);
app.use(error_handler_1.default);
server.listen(PORT, HOST, () => {
    (0, socket_1.default)();
    console.log("Connected to", PORT, HOST, "in: ", app.settings.env);
});
exports.default = server;
