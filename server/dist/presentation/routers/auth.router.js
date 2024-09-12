"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const express_validator_1 = require("express-validator");
const auth_service_impl_1 = __importDefault(require("@/application/services/auth/auth.service.impl"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const auth_controller_1 = __importDefault(require("@/presentation/controllers/auth.controller"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const auth_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/auth.repository.impl"));
const validate_request_data_validation_1 = __importDefault(require("../validations/validate-request-data.validation"));
const validate_login_credentials_validation_1 = __importDefault(require("../validations/validate-login-credentials.validation"));
const validate_empty_request_body_fields_1 = __importDefault(require("../validations/validate-empty-request-body-fields"));
const router = express_1.default.Router();
const wrap = new async_wrapper_util_1.default();
const controller = new auth_controller_1.default(new auth_service_impl_1.default(new auth_repository_impl_1.default(), new user_repository_impl_1.default()));
router
    .route("/register")
    .all((0, validate_empty_request_body_fields_1.default)(["id", "uuid"]), (0, validate_request_data_validation_1.default)(user_dto_1.default))
    .post(wrap.asyncErrorHandler(controller.register));
router
    .route("/login")
    .all((0, validate_login_credentials_validation_1.default)())
    .post(wrap.asyncErrorHandler(controller.login));
router
    .route("/forgot-password")
    .all((0, express_validator_1.body)("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email not valid"))
    .post(wrap.asyncErrorHandler(controller.forgotPassword));
router
    .route("/reset-password-form")
    .all((0, validate_empty_request_body_fields_1.default)("token"))
    .get(wrap.asyncErrorHandler(controller.resetPasswordForm));
router
    .route("/reset-password")
    .all((0, validate_empty_request_body_fields_1.default)(["referenceToken"]), (0, validate_request_data_validation_1.default)(user_dto_1.default))
    .post(wrap.asyncErrorHandler(controller.resetPassword));
router
    .route("/logout")
    .get(wrap.asyncErrorHandler(controller.logout));
exports.default = router;
