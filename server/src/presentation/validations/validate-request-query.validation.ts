import { query }          from "express-validator";
import validateRequest    from "./validate-request.validation";
import { RequestHandler } from "express";

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

function validateRequestQuery(validation: string | string[]): RequestHandler {
  return validateRequest([
    query(validation)
      .exists({ checkFalsy: true })
      .notEmpty(),
  ]);
};

export default validateRequestQuery;
