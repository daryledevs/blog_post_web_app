"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordMatch = void 0;
const class_validator_1 = require("class-validator");
/**
 * Custom validator to check if the password and confirm password fields match.
 *
 * @export
 * @class PasswordMatch
 * @implements {ValidatorConstraintInterface}
 *
 * @description
 * Validates that the `confirmPassword` field matches the `password` field in a given object.
 * Intended for use with DTOs that have both a password and confirmPassword property.
 *
 * @example
 * // Apply the validator in a DTO
 * @Validate(PasswordMatch)
 * confirmPassword: string;
 */
let PasswordMatch = class PasswordMatch {
    /**
     * Validates that the `confirmPassword` field matches the `password` field.
     *
     * @param {string} confirmPassword - The confirm password field to validate.
     * @param {ValidationArguments} args - Additional arguments for validation.
     * @returns {boolean} - True if the password fields match, otherwise false.
     */
    validate(confirmPassword, args) {
        const password = args.object.password;
        return password === confirmPassword;
    }
    /**
     * Default error message to return if validation fails.
     *
     * @returns {string} - Error message.
     */
    defaultMessage() {
        return "Password and confirm password do not match";
    }
};
exports.PasswordMatch = PasswordMatch;
exports.PasswordMatch = PasswordMatch = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: "PasswordMatch", async: false })
], PasswordMatch);
exports.default = PasswordMatch;
