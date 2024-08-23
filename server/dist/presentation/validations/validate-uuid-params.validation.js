"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate_request_validation_1 = __importDefault(require("./validate-request.validation"));
/**
 * A reusable middleware function that validates the incoming request parameters using the Express Validator library.
 *
 * @param {(string | string[])} args - The parameter name or an array of parameter names to validate.
 * @returns {RequestHandler} - An Express middleware function that validates the specified request parameters.
 *
 * @example
 * // Use the middleware in a route
 * router
 *   .route("/by-user/:user_uuid")
 *   .get(validateUUIDRequestParams("user_uuid"), controller.getUserPosts);
 *
 * @description
 * This middleware function generates validation chains for the specified parameter names, ensuring
 * that each parameter exists and is a valid UUID. The generated validation chains are then passed
 * to the `validateRequest` middleware function for processing.
 */
const validateUUIDRequestParams = (args) => {
    return (0, validate_request_validation_1.default)([
        (0, express_validator_1.param)(args)
            .exists({ values: "falsy" })
            .isUUID(),
    ]);
};
exports.default = validateUUIDRequestParams;
