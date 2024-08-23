"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Middleware to validate incoming request parameters using the Express Validator library.
 *
 * @param {ContextRunner[]} validations - An array of validation chains created by Express Validator.
 *
 * @returns {RequestHandler} - An Express middleware function that validates the request parameters.
 *
 * @example
 * // Define the validation chains
 * const validations = [
 *   param("user_uuid")
 *     .exists({ checkFalsy: true, checkNull: true })
 *     .isUUID(),
 * ];
 *
 * // Use the middleware in a route
 * router
 *   .route("/by-user/:user_uuid")
 *   .get(validateRequest(validations), controller.getUserPosts);
 *
 * @example
 * // For reusable validation chains
 * const validateUUIDRequestParams = (args: string | string[]): RequestHandler => {
 *
 * const validations = [
 *   param(args)
 *     .exists({
 *       checkFalsy: true,
 *       checkNull: true,
 *     })
 *     .isUUID(),
 * ];
 *
 *  // perform validation
 *  return validateRequest(validations);
 * };
 *
 * @description
 * This middleware function validates the incoming request parameters using the provided
 * validation chains. If any validation fails, it sends a 400 status response with the
 * validation errors. If all validations pass, the request is forwarded to the next
 * middleware or route handler.
 */
const validateRequest = (validations) => {
    return async (req, res, next) => {
        // Process validations sequentially, stopping if any validation fails
        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
        }
        next();
    };
};
exports.default = validateRequest;
