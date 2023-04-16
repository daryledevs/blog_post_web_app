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
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const basePath = __importStar(require("path"));
const uploadImage = (path) => {
    const root = basePath.resolve("./dist");
    path = basePath.join(root, path);
    if (!fs.existsSync(path))
        fs.mkdirSync(path, { recursive: true });
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, destinationCallBack) {
            destinationCallBack(null, path);
        },
        filename: function (req, file, fileNameCallback) {
            const whitespace = /\s/g;
            fileNameCallback(null, file.originalname.replace(whitespace, "_"));
        },
    });
    return (0, multer_1.default)({ storage: storage });
};
exports.default = uploadImage;
