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
const cloudinary_config_1 = __importDefault(require("@/config/cloudinary.config"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs = __importStar(require("fs"));
cloudinary_1.default.v2.config(cloudinary_config_1.default);
class CloudinaryService {
    uploadAndDeleteLocal = async (path) => {
        const result = await cloudinary_1.default.v2.uploader.upload(path, {
            UNIQUE_FILENAME: true,
            folder: process.env.STORAGE_FOLDER,
        });
        fs.unlink(path, (err) => {
            if (err)
                throw err;
            console.log("Delete File successfully.");
        });
        return { image_id: result.public_id, image_url: result.url };
    };
}
exports.default = CloudinaryService;
