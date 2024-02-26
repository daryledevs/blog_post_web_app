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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv = __importStar(require("dotenv"));
const database_1 = __importDefault(require("./database/database"));
const auth_1 = __importDefault(require("./router/auth"));
const user_1 = __importDefault(require("./router/user"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_1 = __importDefault(require("./socket"));
const chat_1 = __importDefault(require("./router/chat"));
const post_1 = __importDefault(require("./router/post"));
const like_1 = __importDefault(require("./router/like"));
const feed_1 = __importDefault(require("./router/feed"));
const corsOption_1 = __importDefault(require("./config/corsOption"));
const tokenHandler_1 = __importDefault(require("./middleware/tokenHandler"));
const path_1 = __importDefault(require("./config/path"));
const responseHandler_1 = __importDefault(require("./middleware/responseHandler"));
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const API = process.env.API;
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOption_1.default));
app.use(tokenHandler_1.default);
app.use(responseHandler_1.default);
app.set("views", path_1.default); // Set the views directory
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use((0, morgan_1.default)("tiny"));
// Routes
app.use(`${API}/`, auth_1.default);
app.use(`${API}/chats`, chat_1.default);
app.use(`${API}/users`, user_1.default);
app.use(`${API}/posts`, post_1.default);
app.use(`${API}/likes`, like_1.default);
app.use(`${API}/feeds`, feed_1.default);
database_1.default.connect((error) => {
    if (error)
        throw error;
    console.log("Connected to MySQL Server!");
});
app.listen(PORT, () => {
    (0, socket_1.default)();
    console.log("Connected to", PORT, "in: ", app.settings.env);
});
