"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dto_mapper_util_1 = __importDefault(require("@/utils/dto-mapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
const validation_exception_1 = __importDefault(require("@/exceptions/validation.exception"));
const class_validator_1 = require("class-validator");
const validator = async (req, res, next) => {
    try {
        const dtoClass = (0, dto_mapper_util_1.default)(req.path);
        if (!dtoClass)
            return next();
        const dtoInstance = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(dtoInstance);
        if (errors.length > 0) {
            const errorsArr = Object.assign({}, ...errors.map((error) => ({
                [error.property]: Object.values(error.constraints || {}).join(", ")
            })));
            return next(new validation_exception_1.default(errorsArr));
        }
        ;
        next();
    }
    catch (error) {
        next(api_exception_1.default.HTTP500Error("An error occurred while validating the request", error));
    }
};
exports.default = validator;
