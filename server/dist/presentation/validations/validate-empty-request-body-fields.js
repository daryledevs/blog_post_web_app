"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate_request_validation_1 = __importDefault(require("./validate-request.validation"));
/**
 * Middleware to ensure specified request body fields are empty.
 *
 * @param {(string | string[])} validation - Field name(s) to validate as empty.
 * @returns {RequestHandler} An Express middleware function for validation.
 *
 * @example
 * // Use the middleware in a route
 * router.post('/submit', validateEmptyRequestBodyFields('optionalField'), (req, res) => {
 *   res.send('Field is empty as expected.');
 * });
 *
 * @description
 * Uses `express-validator` to check if the specified fields in the request body are empty.
 * Delegates validation to `validateRequest` for error handling.
 */
function validateEmptyRequestBodyFields(validation) {
    return (0, validate_request_validation_1.default)([(0, express_validator_1.body)(validation).isEmpty()]);
}
exports.default = validateEmptyRequestBodyFields;
