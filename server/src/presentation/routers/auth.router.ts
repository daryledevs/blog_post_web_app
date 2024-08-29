import express                        from "express";
import UserDto                        from "@/domain/dto/user.dto";
import AuthService                    from "@/application/services/auth/auth.service.impl";
import AuthController                 from "@/presentation/controllers/auth.controller";
import UserRepository                 from "@/infrastructure/repositories/user.repository.impl";
import AuthRepository                 from "@/infrastructure/repositories/auth.repository.impl";
import validateRequestData            from "../validations/validate-request-data.validation";
import validateLoginCredentials       from "../validations/validate-login-credentials.validation";
import validateEmptyRequestBodyFields from "../validations/validate-empty-request-body-fields";
import { body } from "express-validator";

const router = express.Router();

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
  .post(controller.register);

router
  .route("/login")
  .all(validateLoginCredentials)
  .post(controller.login);

router
  .route("/forgot-password")
  .all(
    body("email")
      .exists()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email not valid")
  )
  .post(controller.forgotPassword);

router.get("/reset-password-form", controller.resetPasswordForm);
router.post("/reset-password",     controller.resetPassword);
router.get("/logout",              controller.logout);

export default router;