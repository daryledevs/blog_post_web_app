import { validate, ValidationError }                       from "class-validator";
import { ClassConstructor, plainToInstance }               from "class-transformer";
import ValidationException, { ResponseErrorType }          from "@/application/exceptions/validation.exception";
import { RequestHandler, Request, Response, NextFunction } from "express";

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

function validateRequestData<T extends object>(dto: ClassConstructor<T>): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const files: Express.Multer.File[] =
      ((req.files as { [fieldname: string]: Express.Multer.File[] })
        ?.imgs as Express.Multer.File[]) || null;
        
    const body = files ? { ...req.body, files: files } : req.body;
    const dtoInstance = plainToInstance(dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => {
          return Object.values(error.constraints ?? {});
        })
        .join(", ");

      next(new ValidationException(message as unknown as ResponseErrorType));
    }

    next();
  };
};

export default validateRequestData;
