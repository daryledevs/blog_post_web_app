import { FieldError } from 'react-hook-form';

type FieldErrorMessageProps = {
  error: string;
  isError: FieldError | undefined;
};

function FieldErrorMessage({ error, isError }: FieldErrorMessageProps) {
  if(!isError) return null;
  const errorStyle = { color: isError ? "red" : "black" };
  return (
    <span
      className="field-error-message"
      style={errorStyle}
    >
      {error}
    </span>
  );
}

export default FieldErrorMessage
