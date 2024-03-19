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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserLikeForPost = exports.checkUserLikeStatusForPost = exports.getLikesCountForPost = exports.deletePost = exports.editPost = exports.getUserTotalPosts = exports.getUserPost = exports.newPost = void 0;
const path_1 = require("path");
const exception_1 = __importDefault(require("../exception/exception"));
const dotenv = __importStar(require("dotenv"));
const post_repository_1 = __importDefault(require("../repository/post-repository"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
dotenv.config();
const getUserPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.query;
        const data = yield post_repository_1.default.getUserPosts(user_id);
        res.status(200).send({ post: data });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.getUserPost = getUserPost;
const getUserTotalPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.query;
        const data = yield post_repository_1.default.getUserTotalPosts(user_id);
        res.status(200).send({ totalPost: data });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.getUserTotalPosts = getUserTotalPosts;
const newPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { user_id, caption } = req.body;
        const img = (_a = req.files) === null || _a === void 0 ? void 0 : _a.img;
        if (!req.files || !img)
            return next(exception_1.default.badRequest("No image uploaded"));
        const path = (0, path_1.join)(img[0].destination, img[0].filename);
        const { image_id, image_url } = yield (0, cloudinary_1.default)(path);
        const post = { user_id, caption, image_id, image_url };
        const data = yield post_repository_1.default.newPost(post);
        res.status(200).send({ message: data });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.newPost = newPost;
const editPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id } = req.params;
        const _b = req.body, { user_id, roles, cookieOptions } = _b, rest = __rest(_b, ["user_id", "roles", "cookieOptions"]);
        const image_url = "Image url is not allowed to be changed";
        if (rest.image_url)
            return next(exception_1.default.badRequest(image_url));
        const data = yield post_repository_1.default.editPost(post_id, rest);
        res.status(200).send({ message: data });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.editPost = editPost;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id } = req.params;
        const data = yield post_repository_1.default.deletePost(post_id);
        res.status(200).send({ message: data });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.deletePost = deletePost;
const getLikesCountForPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id } = req.params;
        const data = yield post_repository_1.default.getLikesCountForPost(post_id);
        res.status(200).send({ count: data });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.getLikesCountForPost = getLikesCountForPost;
const checkUserLikeStatusForPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const args = req.params;
        const data = yield post_repository_1.default.isUserLikePost(args);
        res.status(200).send({ status: data ? true : false });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.checkUserLikeStatusForPost = checkUserLikeStatusForPost;
const toggleUserLikeForPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const args = req.params;
        // Check to see if the user already likes the post.
        const data = yield post_repository_1.default.isUserLikePost(args);
        if (!data) {
            // If the user hasn't liked the post yet, then create or insert.
            const data = yield post_repository_1.default.toggleUserLikeForPost(args);
            return res.status(200).send({ message: data });
        }
        else {
            // If the user has already liked the post, then delete or remove.
            const data = yield post_repository_1.default.removeUserLikeForPost(args);
            return res.status(200).send({ message: data });
        }
        ;
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.toggleUserLikeForPost = toggleUserLikeForPost;
