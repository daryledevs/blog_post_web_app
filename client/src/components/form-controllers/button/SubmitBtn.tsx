import React from "react";

type ButtonTypes = {
  text?: string;
  styles?: React.CSSProperties | undefined;
  isValid?: boolean | undefined;
  defaultBgColor?: string;
  bgValidColor?: string | undefined;
  bgInvalidColor?: string | undefined;
  className?: string | undefined;
  onClick?: () => void;
};

function Button({
  text,
  isValid,
  styles,
  className,
  defaultBgColor,
  bgValidColor,
  bgInvalidColor,
  onClick,
}: ButtonTypes) {
  // Set default values
  const bgColor = isValid
    ? bgValidColor
    : bgInvalidColor
    ? bgInvalidColor
    : defaultBgColor;

  return (
    <button
      disabled={isValid === true}
      className={className}
      onClick={onClick}
      style={{
        ...styles,
        backgroundColor: bgColor,
      }}
    >
      {text}
    </button>
  );
}

export default Button;
