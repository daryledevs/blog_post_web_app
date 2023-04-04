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
const database_1 = __importDefault(require("./database"));
const User_1 = __importDefault(require("./router/User"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const JWT_1 = __importDefault(require("./middleware/JWT"));
const socket_1 = __importDefault(require("./socket"));
const ErrorHandler_1 = require("./helper/ErrorHandler");
const Chat_1 = require("./controller/Chat");
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const API = process.env.API;
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
app.use((0, JWT_1.default)());
app.use(ErrorHandler_1.ErrorHandler);
app.use((0, morgan_1.default)("tiny"));
// Routes
app.use(`${API}/check-token`, ErrorHandler_1.checkToken);
app.use(`${API}/users`, User_1.default);
app.use(`${API}/chat/:length/:sender_id`, Chat_1.getAllChats);
app.use(`${API}/chat`, Chat_1.newConversation);
app.use(`${API}/message/:conversation_id`, Chat_1.getMessage);
app.use(`${API}/message`, Chat_1.newMessage);
database_1.default.connect((error) => {
    if (error)
        throw error;
    console.log("Connected to MySQL Server!");
});
app.listen(PORT, () => {
    (0, socket_1.default)();
    console.log("Connected", PORT);
});
