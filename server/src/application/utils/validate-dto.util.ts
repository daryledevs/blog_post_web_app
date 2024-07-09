import dtoMapper                           from "./dto-mapper.util";
import { plainToInstance }                 from "class-transformer";
import ValidationException                 from "@/application/exceptions/validation.exception";
import { validate, ValidationError }       from "class-validator";
import { Request, Response, NextFunction } from "express";

class ValidateDto {
  private readonly request: Request;
  private readonly response: Response;
  private readonly next: NextFunction;
  private readonly originalSend: (
    body?: any
  ) => Response<any, Record<string, any>>;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.originalSend = res.send.bind(res);
    this.next = next;
  }

  public performValidation = async () => {
    try {
      await this.requestValidation();
      this.responseValidation();
    } catch (error) {
      this.next(error);
    }
  };

  //add the requestValidation method, which will validate the request body
  public requestValidation = async () => {
    // get the DTO class based on the request path
    const dtoClass = dtoMapper(this.request.path);
    if (!dtoClass) return;

    // create an instance of the DTO class and validate it
    const dtoInstance = plainToInstance(dtoClass, this.request.body);
    const errors: ValidationError[] = await validate(dtoInstance);

    // if there are any validation errors, throw them
    if (errors.length > 0) {
      const errorsArr = this.getValidationErrors(errors);
      throw new ValidationException(errorsArr);
    }
  };

  // add the responseValidation method, which will validate the response body
  private responseValidation = (): Response<any, Record<string, any>> => {
    this.response.send = (body: any): Response<any, Record<string, any>> => {
      // Call the async handler and handle potential errors
      this.handleAsyncValidation(body).catch((err) => {
        // Handle any unexpected errors
        this.next(err);
      });

      // Add a return statement at the end of the function
      return this.response;
    };

    return this.response;
  };

  // Add the handleAsyncValidation method, which will handle the async validation
  private handleAsyncValidation = async (body: any): Promise<any> => {
    if (
      body &&
      typeof body === "object" &&
      !body.accessToken &&
      this.response.statusCode <= 300
    ) {
      const keys: string[] = Object.keys(body);
      const key = keys[0]!;
      const values = body[key];

      // check if the response body is an array or an object
      if (Array.isArray(values)) {
        // return error found in multiple response validation
        // otherwise return the original send method
        return this.multipleResponseValidation(key, values);
      } else if (values && typeof values === "object") {
        // return error found in single response validation
        // otherwise return the original send method
        return this.singleResponseValidation(values);
      } else {
        // return the original send method if no validation errors were found
        return this.originalSend(body);
      }
    }

    // call the original send method if no validation errors were found
    return this.originalSend(body);
  };

  private multipleResponseValidation = async (
    key: string,
    values: any
  ): Promise<any> => {
    let foundErr: any = { [key]: [] };
    // map over the array of values and validate each one
    const validationPromises = values.map(async (value: any, index: number) => {
      const validationErrors: ValidationError[] = await validate(value);

      // if there are any validation errors, add them to the foundErr object
      if (validationErrors.length > 0) {
        const errorsArr = this.getValidationErrors(validationErrors);

        // add the validation errors to the foundErr object
        foundErr[key].push({
          arrayIndex: index,
          errors: errorsArr,
        });
      }

      // return the value without any changes
      return value;
    });

    // wait for all validation promises to resolve
    await Promise.all(validationPromises);

    // if there are any validation errors, throw them
    if (foundErr[key].length > 0) {
      throw new ValidationException(foundErr);
    }

    // return the original send method if no validation errors were found
    return this.originalSend(values);
  };

  // add the singleResponseValidation method, which will handle the validation of a single response
  private singleResponseValidation = async (values: any): Promise<any> => {
    const validationErrors: ValidationError[] = await validate(values);

    // if there are any validation errors, throw them
    if (validationErrors.length > 0) {
      const errorsArr = this.getValidationErrors(validationErrors);
      throw new ValidationException(errorsArr);
    }

    // return the original send method if no validation errors were found
    return this.originalSend(values);
  };

  // error formatting method
  private getValidationErrors = (errors: ValidationError[]): any => {
    return Object.assign(
      {},
      ...errors.map((error: ValidationError) => ({
        [error.property]: Object.values(error.constraints || {}).join(", "),
      }))
    );
  };
}

export default ValidateDto;
