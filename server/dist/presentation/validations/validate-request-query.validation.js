"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate_request_validation_1 = __importDefault(require("./validate-request.validation"));
/**
 * Middleware to validate that specified query parameters exist and are not empty.
 *
 * @param {(string | string[])} validation - Query parameter name(s) to validate.
 * @returns {RequestHandler} An Express middleware function for validation.
 *
 * @example
 * // Use the middleware in a route
 * router.get('/search', validateRequestQuery('keyword'), (req, res) => {
 *   res.send('Query parameter is valid.');
 * });
 *
 * @description
 * Utilizes `express-validator` to check if the specified query parameters exist and are not empty.
 * Uses `validateRequest` for error handling.
 */
function validateRequestQuery(validation) {
    return (0, validate_request_validation_1.default)([
        (0, express_validator_1.query)(validation)
            .exists({ checkFalsy: true })
            .notEmpty(),
    ]);
}
;
exports.default = validateRequestQuery;
