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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv = __importStar(require("dotenv"));
const query_1 = __importDefault(require("./database/query"));
const database_1 = __importDefault(require("./database/database"));
const auth_1 = __importDefault(require("./router/auth"));
const user_1 = __importDefault(require("./router/user"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_1 = __importDefault(require("./socket"));
const chat_1 = __importDefault(require("./router/chat"));
const post_1 = __importDefault(require("./router/post"));
const feed_1 = __importDefault(require("./router/feed"));
const corsOption_1 = __importDefault(require("./config/corsOption"));
const token_handler_1 = __importDefault(require("./middleware/token-handler"));
const path_1 = __importDefault(require("./config/path"));
const response_handler_1 = __importDefault(require("./middleware/response-handler"));
const cookie_options_1 = __importDefault(require("./middleware/cookie-options"));
const error_handler_1 = require("./helper/error-handler");
dotenv.config();
const app = (0, express_1.default)();
const PORT = parseInt((_a = process.env.SERVER_PORT) !== null && _a !== void 0 ? _a : "5000");
const HOST = process.env.SERVER_HOST || "localhost";
const API = process.env.API;
app.disable("x-powered-by");
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(cookie_options_1.default);
app.use((0, cors_1.default)(corsOption_1.default));
app.use(token_handler_1.default);
app.use(response_handler_1.default);
app.set("views", path_1.default); // Set the views directory
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use((0, morgan_1.default)("tiny"));
// Routes
app.use(`${API}/`, auth_1.default);
app.use(`${API}/chats`, chat_1.default);
app.use(`${API}/users`, user_1.default);
app.use(`${API}/posts`, post_1.default);
app.use(`${API}/feeds`, feed_1.default);
app.use(error_handler_1.errorHandler);
database_1.default.getConnection((error) => __awaiter(void 0, void 0, void 0, function* () {
    if (error)
        throw error;
    console.log("Connected to MySQL Server!");
    // force mysql not to lose connection
    // https://github.com/sidorares/node-mysql2/issues/836
    yield (0, query_1.default)("SELECT 1 + 1 AS solution", []);
}));
app.listen(PORT, HOST, () => {
    (0, socket_1.default)();
    console.log("Connected to", PORT, HOST, "in: ", app.settings.env);
});
