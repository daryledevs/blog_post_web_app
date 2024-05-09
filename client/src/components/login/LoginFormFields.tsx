import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import InputField from "../form-controllers/input/InputField";
import { Inputs } from "./LoginForm";

type LoginFormFieldsProps = {
  errors: FieldErrors<Inputs>;
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
};

function LoginFormFields({ watch, register, errors }: LoginFormFieldsProps) {
  return (
    <div className="login-form-fields">
      <InputField
        type="text"
        watch={watch}
        register={register}
        inputTitle="userCredential"
        placeholder="Username, or email"
        error="This field is required"
        isError={errors.userCredential}
      />

      <InputField
        type="password"
        inputTitle="password"
        watch={watch}
        register={register}
        placeholder="Password"
        error="This field is required"
        isError={errors.password}
      />
    </div>
  );
}

export default LoginFormFields;
