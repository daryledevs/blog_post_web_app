import { FieldError } from 'react-hook-form';

type ErrorMessageProps = {
  error: string;
  isError: FieldError | undefined;
};

function ErrorMessage({ error, isError }: ErrorMessageProps) {
  if(!isError) return null;
  const errorStyle = { color: isError ? "red" : "black", fontSize: "0.7rem" };
  return <span style={errorStyle}>{error}</span>;
}

export default ErrorMessage
