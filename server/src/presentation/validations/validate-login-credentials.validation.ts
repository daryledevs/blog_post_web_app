import validateRequest        from "./validate-request.validation";
import { RequestHandler }     from "express";
import { body, check, oneOf } from "express-validator";

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

function validateLoginCredentials(): RequestHandler  {
  const validations = [
    oneOf([
      check("userCredentials")
        .exists()
        .withMessage("user's credential is required")
        .isLength({ min: 3 })
        .withMessage("wrong user's credential length"),

      check("userCredentials")
        .exists()
        .withMessage("user's credential is required")
        .isEmail()
        .withMessage("user's credential not valid"),
    ]),
    body("password").isString().withMessage("Password must be a string"),
  ];

  return validateRequest(validations);
};

export default validateLoginCredentials;
