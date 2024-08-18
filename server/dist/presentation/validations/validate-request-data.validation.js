"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validation_exception_1 = __importDefault(require("@/application/exceptions/validation.exception"));
/**
 * Middleware to validate incoming request data using a DTO (Data Transfer Object).
 *
 * This function generates an Express request handler that validates the incoming request body,
 * and optionally any uploaded files, against the specified DTO class. If validation fails,
 * it passes a validation exception to the next middleware. Otherwise, it proceeds with the next
 * middleware or route handler.
 *
 * @template T - The type of the DTO class.
 * @param dto - The class constructor of the DTO to be used for validation.
 * @returns {RequestHandler} An Express request handler that validates the request data.
 *
 * @example
 * // Define a DTO class
 * class UserDto {
 *   @IsString()
 *   username: string;
 *
 *   @IsEmail()
 *   email: string;
 * }
 *
 * // Use the middleware in a route
 * app.post('/users', validator(UserDto), (req, res) => {
 *   res.send('User data is valid');
 * });
 *
 * @description
 * The middleware uses the `plainToInstance` function from `class-transformer` to convert the
 * request body into an instance of the provided DTO class. It then uses the `validate` function
 * from `class-validator` to validate this instance. If validation errors are found, a
 * `ValidationException` is created with the error messages and passed to the `next` function
 * to be handled by Express's error-handling middleware.
 *
 * The middleware also handles file uploads by checking if `req.files` contains any files, and
 * merges them into the request body before validation.
 */
function validateRequestData(dto) {
    return async (req, res, next) => {
        const files = req.files
            ?.imgs || null;
        const body = files ? { ...req.body, files: files } : req.body;
        const dtoInstance = (0, class_transformer_1.plainToInstance)(dto, body);
        const errors = await (0, class_validator_1.validate)(dtoInstance);
        if (errors.length > 0) {
            const message = errors
                .map((error) => {
                return Object.values(error.constraints ?? {});
            })
                .join(", ");
            next(new validation_exception_1.default(message));
        }
        next();
    };
}
;
exports.default = validateRequestData;
