import { RequestHandler } from "express";
import validateRequestQuery from "./validate-request-query.validation";
import validateUUIDRequestParams from "./validate-uuid-params.validation";
import ApiErrorException from "@/application/exceptions/api.exception";

function validateParamOrQuery(
  routeParam: string | string[],
  routeQuery: string | string[]
): RequestHandler {
  return (req, res, next) => {
    // Get the query and route keys
    const queryArray = Object.keys(req.query);
    const paramArray = Object.keys(req.params);

    if (queryArray.length && paramArray.length) {
      return ApiErrorException.HTTP400Error(
        "only one of query or route param must be provided"
      );
    }

    // If the query param exists, validate it as a string
    if (routeQuery.length && queryArray.length) {
      return validateRequestQuery(routeQuery)(req, res, next);
    }

    // Else, validate the route param as a UUID
    if (routeParam.length && paramArray.length) {
      return validateUUIDRequestParams(routeParam)(req, res, next);
    }

    // If neither is present, return an error
    return ApiErrorException.HTTP400Error(
      "either query or route param must be provided"
    );
  };
}

export default validateParamOrQuery;
