import express                        from "express";
import UserDto                        from "@/domain/dto/user.dto";
import { body }                       from "express-validator";
import AuthService                    from "@/application/services/auth/auth.service.impl";
import AsyncWrapper                   from "@/application/utils/async-wrapper.util";
import AuthController                 from "@/presentation/controllers/auth.controller";
import UserRepository                 from "@/infrastructure/repositories/user.repository.impl";
import AuthRepository                 from "@/infrastructure/repositories/auth.repository.impl";
import validateRequestData            from "../validations/validate-request-data.validation";
import validateLoginCredentials       from "../validations/validate-login-credentials.validation";
import validateEmptyRequestBodyFields from "../validations/validate-empty-request-body-fields";

const router = express.Router();
const wrap = new AsyncWrapper();

const controller: AuthController = new AuthController(
  new AuthService(
    new AuthRepository(),
    new UserRepository()
  )
);

router
  .route("/register")
  .all(
    validateEmptyRequestBodyFields(["id", "uuid"]),
    validateRequestData(UserDto)
  )
  .post(wrap.asyncErrorHandler(controller.register));

router
  .route("/login")
  .all(validateLoginCredentials)
  .post(wrap.asyncErrorHandler(controller.login));

router
  .route("/forgot-password")
  .all(
    body("email")
      .exists()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email not valid")
  )
  .post(wrap.asyncErrorHandler(controller.forgotPassword));

router
  .route("/reset-password-form")
  .all(validateEmptyRequestBodyFields("token"))
  .get(wrap.asyncErrorHandler(controller.resetPasswordForm));

router
  .route("/reset-password")
  .all(
    validateEmptyRequestBodyFields(["referenceToken"]),
    validateRequestData(UserDto),

  )
  .post(wrap.asyncErrorHandler(controller.resetPassword));

router
  .route("/logout")
  .get(wrap.asyncErrorHandler(controller.logout));

export default router;