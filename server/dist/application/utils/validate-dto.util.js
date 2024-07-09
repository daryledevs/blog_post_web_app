"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dto_mapper_util_1 = __importDefault(require("./dto-mapper.util"));
const class_transformer_1 = require("class-transformer");
const validation_exception_1 = __importDefault(require("@/application/exceptions/validation.exception"));
const class_validator_1 = require("class-validator");
class ValidateDto {
    request;
    response;
    next;
    originalSend;
    constructor(req, res, next) {
        this.request = req;
        this.response = res;
        this.originalSend = res.send.bind(res);
        this.next = next;
    }
    performValidation = async () => {
        try {
            await this.requestValidation();
            this.responseValidation();
        }
        catch (error) {
            this.next(error);
        }
    };
    //add the requestValidation method, which will validate the request body
    requestValidation = async () => {
        // get the DTO class based on the request path
        const dtoClass = (0, dto_mapper_util_1.default)(this.request.path);
        if (!dtoClass)
            return;
        // create an instance of the DTO class and validate it
        const dtoInstance = (0, class_transformer_1.plainToInstance)(dtoClass, this.request.body);
        const errors = await (0, class_validator_1.validate)(dtoInstance);
        // if there are any validation errors, throw them
        if (errors.length > 0) {
            const errorsArr = this.getValidationErrors(errors);
            throw new validation_exception_1.default(errorsArr);
        }
    };
    // add the responseValidation method, which will validate the response body
    responseValidation = () => {
        this.response.send = (body) => {
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
    handleAsyncValidation = async (body) => {
        if (body &&
            typeof body === "object" &&
            !body.accessToken &&
            this.response.statusCode <= 300) {
            const keys = Object.keys(body);
            const key = keys[0];
            const values = body[key];
            // check if the response body is an array or an object
            if (Array.isArray(values)) {
                // return error found in multiple response validation
                // otherwise return the original send method
                return this.multipleResponseValidation(key, values);
            }
            else if (values && typeof values === "object") {
                // return error found in single response validation
                // otherwise return the original send method
                return this.singleResponseValidation(values);
            }
            else {
                // return the original send method if no validation errors were found
                return this.originalSend(body);
            }
        }
        // call the original send method if no validation errors were found
        return this.originalSend(body);
    };
    multipleResponseValidation = async (key, values) => {
        let foundErr = { [key]: [] };
        // map over the array of values and validate each one
        const validationPromises = values.map(async (value, index) => {
            const validationErrors = await (0, class_validator_1.validate)(value);
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
            throw new validation_exception_1.default(foundErr);
        }
        // return the original send method if no validation errors were found
        return this.originalSend(values);
    };
    // add the singleResponseValidation method, which will handle the validation of a single response
    singleResponseValidation = async (values) => {
        const validationErrors = await (0, class_validator_1.validate)(values);
        // if there are any validation errors, throw them
        if (validationErrors.length > 0) {
            const errorsArr = this.getValidationErrors(validationErrors);
            throw new validation_exception_1.default(errorsArr);
        }
        // return the original send method if no validation errors were found
        return this.originalSend(values);
    };
    // error formatting method
    getValidationErrors = (errors) => {
        return Object.assign({}, ...errors.map((error) => ({
            [error.property]: Object.values(error.constraints || {}).join(", "),
        })));
    };
}
exports.default = ValidateDto;
