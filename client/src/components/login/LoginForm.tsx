
import { SubmitHandler, useForm } from "react-hook-form";
import LoginFormFields            from "./LoginFormFields";
import ForgotPasswordLink         from "./ForgotPasswordLink";
import LoginSubmitBtn from "./LoginSubmitBtn";

type LoginFormTypes = {
  onSubmit: SubmitHandler<any>;
};

export type Inputs = {
  userCredential: string;
  password: string;
};

function LoginForm({ onSubmit }: LoginFormTypes) {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>();

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
