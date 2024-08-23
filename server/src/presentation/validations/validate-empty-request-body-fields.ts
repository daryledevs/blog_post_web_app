import { body }           from "express-validator";
import validateRequest    from "./validate-request.validation";
import { RequestHandler } from "express";

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

function validateEmptyRequestBodyFields(
  validation: string | string[]
): RequestHandler {
  return validateRequest([body(validation).isEmpty()]);
}

export default validateEmptyRequestBodyFields;
