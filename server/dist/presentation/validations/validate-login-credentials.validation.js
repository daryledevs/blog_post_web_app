"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_request_validation_1 = __importDefault(require("./validate-request.validation"));
const express_validator_1 = require("express-validator");
/**
 * Middleware to validate login credentials.
 *
 * Validation rules:
 * - `userCredentials`: Must exist and either be a valid email or a string with a minimum length of 3 characters.
 * - `password`: Must be a string.
 *
 * @returns {RequestHandler} An Express middleware function that validates the request.
 *
 * This function returns an Express middleware that validates the login credentials provided in the request body.
 * The credentials can either be an email or a string with a minimum length of 3 characters.
 * Additionally, it ensures that the password is a string.
*/
function validateLoginCredentials() {
    const validations = [
        (0, express_validator_1.oneOf)([
            (0, express_validator_1.check)("userCredentials")
                .exists()
                .withMessage("user's credential is required")
                .isLength({ min: 3 })
                .withMessage("wrong user's credential length"),
            (0, express_validator_1.check)("userCredentials")
                .exists()
                .withMessage("user's credential is required")
                .isEmail()
                .withMessage("user's credential not valid"),
        ]),
        (0, express_validator_1.body)("password").isString().withMessage("Password must be a string"),
    ];
    return (0, validate_request_validation_1.default)(validations);
}
;
exports.default = validateLoginCredentials;
