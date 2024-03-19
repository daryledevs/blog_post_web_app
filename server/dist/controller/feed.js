"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExploreFeed = exports.getUserFeed = exports.getTotalFeed = void 0;
const feed_repository_1 = __importDefault(require("../repository/feed-repository"));
const getTotalFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield feed_repository_1.default.getTotalFeed();
        res.status(200).send({ count: data });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.getTotalFeed = getTotalFeed;
const getUserFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_ids, user_id } = req.body;
        const values = post_ids.length ? post_ids : [0];
        const data = yield feed_repository_1.default.getUserFeed(values, user_id);
        res.status(200).send({ feed: data });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.getUserFeed = getUserFeed;
const getExploreFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.body;
        const data = yield feed_repository_1.default.getExploreFeed(user_id);
        res.status(200).send({ explore: data });
    }
    catch (error) {
        next(error);
    }
});
exports.getExploreFeed = getExploreFeed;
