"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_util_1 = __importDefault(require("@/application/utils/multer.util"));
const upload_option_constants_1 = require("@/constants/upload-option.constants");
/**
 * Middleware for handling single/multiple image uploads with specified field options.
 *
 * This module configures a Multer middleware to handle the uploading of multiple image files
 * to a specified directory. It uses predefined field options to determine how many files can
 * be uploaded per field and the names of those fields.
 *
 * @constant {Multer.Instance} uploadOption - A Multer instance configured to store files
 *                                           in the `./uploads/post` directory.
 *
 * @constant {Multer.Fields} uploadImageHelper - A Multer middleware that allows handling multiple
 *                                              file uploads using specific field options defined
 *                                              in `uploadOptionField`.
 *
 * @example
 * // Use the middleware in a route
 * app.post('/upload-images', uploadImageHelper, (req, res) => {
 *   res.send('Images uploaded successfully');
 * });
 *
 * @description
 * - The `uploadImage` utility is used to create a Multer instance that stores uploaded files
 *   in the `./uploads/post` directory and will be deleted once uploaded in the cloud.
 * - `uploadOptionField` is an array of field options that defines the name of each field
 *   and the maximum number of files allowed per field.
 * - `uploadImageHelper` uses the `fields` method from Multer to create middleware that handles
 *   the specified fields for uploading multiple images.
 */
const uploadOption = (0, multer_util_1.default)("./uploads/post");
const uploadImageHelper = uploadOption.fields(upload_option_constants_1.uploadOptionField);
exports.default = uploadImageHelper;