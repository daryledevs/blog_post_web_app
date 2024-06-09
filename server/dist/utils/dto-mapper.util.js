"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dto_map_constants_1 = __importDefault(require("@/constants/dto-map.constants"));
const dtoMapper = (endpoint) => {
    const path1 = endpoint?.split("/");
    const resource = path1?.[3];
    const operation = path1?.[4];
    if (resource && operation) {
        return dto_map_constants_1.default[resource][operation];
    }
    return undefined;
};
exports.default = dtoMapper;
