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
const query_1 = __importDefault(require("../database/query"));
const getTotalFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.body;
        const sql = `
      SELECT 
        COUNT(*)
      FROM
        POSTS
      WHERE
        POST_DATE > DATE_SUB(CURDATE(), INTERVAL 3 DAY)
      ORDER BY RAND() LIMIT 3;
    `;
        const [data] = yield (0, query_1.default)(sql, [user_id]);
        res.status(200).send({ count: data["COUNT(*)"] });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getTotalFeed = getTotalFeed;
const getUserFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_ids, user_id } = req.body;
        const values = post_ids.length ? post_ids : 0;
        const sql = `
      SELECT 
        F.FOLLOWED_ID, 
        F.FOLLOWER_ID, 
        P.*, 
        (SELECT 
          COUNT(*)
        FROM
          LIKES L
        WHERE
          P.POST_ID = L.POST_ID
        ) AS "COUNT"
      FROM
        FOLLOWERS F
      INNER JOIN
        POSTS P ON P.USER_ID = F.FOLLOWED_ID
      WHERE
        F.FOLLOWER_ID = (?) AND 
        P.POST_DATE > DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND
        POST_ID NOT IN (?) 
      ORDER BY RAND() LIMIT 3;
   `;
        const data = yield (0, query_1.default)(sql, [user_id, values]);
        res.status(200).send({ feed: data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getUserFeed = getUserFeed;
const getExploreFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    try {
        const sqlSelect = `
      SELECT 
        P.*,
        U.USERNAME,
        U.FIRST_NAME,
        U.LAST_NAME,
        (SELECT 
            COUNT(*)
          FROM
            LIKES L
          WHERE
            P.POST_ID = L.POST_ID AND 
            P.USER_ID = L.USER_ID
        ) AS COUNT
      FROM
        POSTS P
      INNER JOIN USERS U 
        ON P.USER_ID = U.USER_ID
      WHERE
        P.POST_DATE >= DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND P.USER_ID != (?);
    `;
        const data = yield (0, query_1.default)(sqlSelect, [user_id]);
        res.status(200).send({ feed: data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getExploreFeed = getExploreFeed;
