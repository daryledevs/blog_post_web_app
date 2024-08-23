import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
}                      from "class-validator";
import { SelectUsers } from "@/domain/types/table.types";

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

@ValidatorConstraint({ name: "PasswordMatch", async: false })
export class PasswordMatch implements ValidatorConstraintInterface {
  /**
   * Validates that the `confirmPassword` field matches the `password` field.
   *
   * @param {string} confirmPassword - The confirm password field to validate.
   * @param {ValidationArguments} args - Additional arguments for validation.
   * @returns {boolean} - True if the password fields match, otherwise false.
   */
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const password = (args.object as SelectUsers).password;
    return password === confirmPassword;
  }

  /**
   * Default error message to return if validation fails.
   *
   * @returns {string} - Error message.
   */
  defaultMessage(): string {
    return "Password and confirm password do not match";
  }
}

export default PasswordMatch;
