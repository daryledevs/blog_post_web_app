import { param }             from "express-validator";
import validateRequest       from "./validate-request.validation";
import { RequestHandler }    from "express";

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
 *   .get(validateUUIDParams("user_uuid"), controller.getUserPosts);
 * 
 * @description
 * This middleware function generates validation chains for the specified parameter names, ensuring 
 * that each parameter exists and is a valid UUID. The generated validation chains are then passed 
 * to the `validateRequest` middleware function for processing.
 */
const validateUUIDParams = (args: string | string[]): RequestHandler => {
  const validations = [
    param(args)
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isUUID(),
  ];

  return validateRequest(validations);
};

export default validateUUIDParams;
