import React, { useState }                           from "react";
import { UseFormRegister, FieldError, UseFormWatch } from "react-hook-form";
import ShowPassword                                  from "./ShowPassword";
import InputFieldLabel                               from "./InputFieldLabel";
import FieldErrorMessage                             from "./FieldErrorMessage";

export type TextInputProps = {
  inputTitle: string;
  type: string;
  placeholder: string;
  error: string;
  isError: FieldError | undefined;
  style?: React.CSSProperties;
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
};

function TextInput({
  inputTitle,
  type,
  placeholder,
  error,
  isError,
  watch,
  register,
}: TextInputProps) {
  const formValue = watch(inputTitle);
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isTypePassword = isPasswordVisible ? "text" : "password";

  const inputType = type === "password" ? isTypePassword : type;

  const inputStyle = { paddingRight: type === "password" ? "2.5vw" : "0" };

  const showPasswordHandler = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <React.Fragment>
      <div className="text-input__container">
        <input
          style={inputStyle}
          type={inputType}
          required
          {...register(inputTitle, { required: true })}
        />
        <InputFieldLabel placeholder={placeholder} />
        <ShowPassword
          title={inputTitle}
          value={formValue}
          isVisible={isPasswordVisible}
          onClick={showPasswordHandler}
        />
      </div>
      <FieldErrorMessage
        error={error}
        isError={isError}
      />
    </React.Fragment>
  );
}

export default TextInput;
