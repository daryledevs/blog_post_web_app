
import { SubmitHandler, useForm } from "react-hook-form";
import LoginFormFields            from "./LoginFormFields";
import ForgotPasswordLink         from "./ForgotPasswordLink";
import LoginSubmitBtn from "./LoginSubmitBtn";
import { IPostLogin } from "@/redux/api/authApi";

type LoginFormTypes = {
  onSubmit: SubmitHandler<IPostLogin>;
};

function LoginForm({ onSubmit }: LoginFormTypes) {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IPostLogin>();

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <LoginFormFields
        errors={errors}
        watch={watch}
        register={register}
      />
      <ForgotPasswordLink />
      <LoginSubmitBtn isValid={isValid} />
    </form>
  );
}

export default LoginForm;
