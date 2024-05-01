import React, { forwardRef, InputHTMLAttributes } from "react";

type InputType = "text" | "email";
type Ref = HTMLInputElement;
type BaseInputAttributes = InputHTMLAttributes<HTMLInputElement>;

interface InputProps extends BaseInputAttributes {
  id?: string;
  type?: InputType;
  name?: string;
  className?: string;
  value?: string;
  styles?: React.CSSProperties;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<Ref, InputProps>((props, ref) => {
  const { id, type, name, value, styles, className, onChange, ...rest } = props;
  return (
    <input
      id={id}
      ref={ref}
      type={type}
      style={styles}
      value={value}
      className={className}
      onChange={onChange}
      {...rest}
    />
  );
});

// set default props
Input.defaultProps = {
  className: "",
  styles: {},
};

export default Input;
