"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dto_map_constants_1 = __importDefault(require("@/constants/dto-map.constants"));
const dtoMapper = (endpoint) => {
    const path = endpoint?.split("/");
    const resource = path?.[3];
    let operation = path?.[4];
    if (!isNaN(Number(operation))) {
        operation = path?.[5];
    }
    if (resource &&
        operation &&
        dto_map_constants_1.default[resource] &&
        dto_map_constants_1.default[resource][operation]) {
        return dto_map_constants_1.default[resource][operation];
    }
    return undefined;
};
exports.default = dtoMapper;
