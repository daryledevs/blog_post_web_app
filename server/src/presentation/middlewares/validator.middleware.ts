import dtoMapper                                           from "@/application/utils/dto-mapper.util";
import ApiErrorException                                   from "@/application/exceptions/api.exception";
import { plainToInstance }                                 from "class-transformer";
import ValidationException                                 from "@/application/exceptions/validation.exception";
import { validate, ValidationError }                       from "class-validator";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validator: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dtoClass = dtoMapper(req.path)
    if (!dtoClass) return next();

    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorsArr = Object.assign({}, ...errors.map((error: ValidationError) => ({
        [error.property]: Object.values(error.constraints || {}).join(", ")
      })));
      
      return next(new ValidationException(errorsArr));
    };

    next();
  } catch (error: any) {
    next(
      ApiErrorException.HTTP500Error(
        "An error occurred while validating the request", 
        error
      )
    );
  }
};

export default validator;
