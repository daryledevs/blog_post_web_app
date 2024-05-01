import React, { forwardRef } from 'react'

type Ref = HTMLButtonElement;
type BaseButtonAttributes = React.ComponentPropsWithoutRef<"button">;

// extend the base button attributes
interface ButtonProps extends BaseButtonAttributes {
  type?: "button" | "submit" | "reset";
  styles?: React.CSSProperties;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string,
}

const Button = forwardRef<Ref, ButtonProps>((props, ref) => {
  const { children, type, isLoading, disabled, className, ...rest } = props;
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
});

// set default props
Button.defaultProps = {
  className: '',
  styles: {},
  isLoading: false,
  disabled: false,
};

export default Button
