"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_options_config_1 = __importDefault(require("./cookie-options.config"));
const secret = process.env.SESSION_SECRET;
const sessionOptions = {
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: cookie_options_config_1.default.secure,
        httpOnly: cookie_options_config_1.default.httpOnly,
        maxAge: cookie_options_config_1.default.maxAge,
    },
};
exports.default = sessionOptions;
