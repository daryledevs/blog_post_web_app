"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: [
        `${process.env.CLIENT_URL_ONE}`,
        `${process.env.CLIENT_URL_TWO}`,
        `${process.env.CLIENT_URL_THREE}`,
    ],
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
};
exports.default = corsOptions;
