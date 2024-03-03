import React from "react";

type ButtonTypes = {
  text: string;
  cursor?: string;
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
  cursor,
  styles,
  className,
  defaultBgColor,
  bgValidColor,
  bgInvalidColor,
}: ButtonTypes) {
  const bgColor = isValid
    ? bgValidColor
    : bgInvalidColor
    ? bgInvalidColor
    : defaultBgColor;

  const cursorStyle = isValid ? cursor : "default";

  return (
    <button
      disabled={!isValid}
      className={className}
      style={{
        ...styles,
        backgroundColor: bgColor,
        cursor: cursorStyle,
      }}
    >
      {text}
    </button>
  );
}

export default Button;
