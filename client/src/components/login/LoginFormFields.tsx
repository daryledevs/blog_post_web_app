import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import InputField from "../form-controllers/input/InputField";
import { IPostLogin } from "@/redux/api/authApi";

type LoginFormFieldsProps = {
  errors: FieldErrors<IPostLogin>;
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
        inputTitle="userCredentials"
        placeholder="Username, or email"
        error="This field is required"
        isError={errors.userCredentials}
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
