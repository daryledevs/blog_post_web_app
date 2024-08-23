import { body }           from "express-validator";
import validateRequest    from "./validate-request.validation";
import { RequestHandler } from "express";

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

const validateUUIDRequestBody = (args: string | string[]): RequestHandler => {
  return validateRequest([
    body(args)
      .exists({ values: "falsy" })
      .isUUID(),
  ]);
};

export default validateUUIDRequestBody;
