"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate_request_validation_1 = __importDefault(require("./validate-request.validation"));
/**
 *  A reusable middleware function that validates the incoming request body using the Express Validator library.
 *
 * @param {(string | string[])} args - Field name(s) to validate as UUID.
 * @returns {RequestHandler} An Express middleware function for validation.
 *
 * @example
 * // Use the middleware in a route
 * router.post('/create', validateUUIDRequestBody('user_id'), (req, res) => {
 *   res.send('Valid UUID received.');
 * });
 *
 * @description
 * Utilizes `express-validator` to check if the specified fields in the request body exist and are valid UUIDs.
 * Uses `validateRequest` to handle validation results and errors.
 */
const validateUUIDRequestBody = (args) => {
    return (0, validate_request_validation_1.default)([
        (0, express_validator_1.body)(args)
            .exists({ values: "falsy" })
            .isUUID(),
    ]);
};
exports.default = validateUUIDRequestBody;
