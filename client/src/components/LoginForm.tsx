import InputField from "./FormControllers/InputField";
import SubmitBtn from "./FormControllers/SubmitBtn";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";

type LoginFormTypes = {
  onSubmit: SubmitHandler<any>;
};

type Inputs = {
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
      className="login-form__container"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <InputField
          type="text"
          watch={watch}
          register={register}
          inputTitle="userCredential"
          placeholder="Username, or email"
          error="This field is required"
          isError={errors.userCredential as FieldError | undefined}
        />

        <InputField
          type="password"
          inputTitle="password"
          watch={watch}
          register={register}
          placeholder="Password"
          error="This field is required"
          isError={errors.password as FieldError | undefined}
        />
      </div>
      <a href="#">Forgot password?</a>
      <SubmitBtn
        text="Log In"
        isValid={isValid}
        bgValidColor="rgb(0,149,246)"
        bgInvalidColor="rgb(76,181,249)"
        cursor="pointer"
        styles={{
          border: "none",
          borderRadius: "5px",
          width: "100%",
          height: "2rem",
          color: "white",
          marginTop: "auto"
        }}
      />
    </form>
  );
}

export default LoginForm;
