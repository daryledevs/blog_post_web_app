"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const auth_service_impl_1 = __importDefault(require("@/application/services/auth/auth.service.impl"));
const auth_controller_1 = __importDefault(require("@/presentation/controllers/auth.controller"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const auth_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/auth.repository.impl"));
const validate_request_data_validation_1 = __importDefault(require("../validations/validate-request-data.validation"));
const validate_login_credentials_validation_1 = __importDefault(require("../validations/validate-login-credentials.validation"));
const validate_empty_request_body_fields_1 = __importDefault(require("../validations/validate-empty-request-body-fields"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const controller = new auth_controller_1.default(new auth_service_impl_1.default(new auth_repository_impl_1.default(), new user_repository_impl_1.default()));
router
    .route("/register")
    .all((0, validate_empty_request_body_fields_1.default)(["id", "uuid"]), (0, validate_request_data_validation_1.default)(user_dto_1.default))
    .post(controller.register);
router
    .route("/login")
    .all(validate_login_credentials_validation_1.default)
    .post(controller.login);
router
    .route("/forgot-password")
    .all((0, express_validator_1.body)("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email not valid"))
    .post(controller.forgotPassword);
router.get("/reset-password-form", controller.resetPasswordForm);
router.post("/reset-password", controller.resetPassword);
router.get("/logout", controller.logout);
exports.default = router;
