"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_request_query_validation_1 = __importDefault(require("./validate-request-query.validation"));
const validate_uuid_params_validation_1 = __importDefault(require("./validate-uuid-params.validation"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
function validateParamOrQuery(routeParam, routeQuery) {
    return (req, res, next) => {
        // Get the query and route keys
        const queryArray = Object.keys(req.query);
        const paramArray = Object.keys(req.params);
        if (queryArray.length && paramArray.length) {
            return api_exception_1.default.HTTP400Error("only one of query or route param must be provided");
        }
        // If the query param exists, validate it as a string
        if (routeQuery.length && queryArray.length) {
            return (0, validate_request_query_validation_1.default)(routeQuery)(req, res, next);
        }
        // Else, validate the route param as a UUID
        if (routeParam.length && paramArray.length) {
            return (0, validate_uuid_params_validation_1.default)(routeParam)(req, res, next);
        }
        // If neither is present, return an error
        return api_exception_1.default.HTTP400Error("either query or route param must be provided");
    };
}
exports.default = validateParamOrQuery;
