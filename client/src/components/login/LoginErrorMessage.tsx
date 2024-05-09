import { useEffect, useState } from "react";

type LoginErrorMessageProps = {
  isError: boolean;
  error: any;
};

function LoginErrorMessage({ isError, error }: LoginErrorMessageProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    switch (error?.data?.message) {
      case "User not found":
        setErrorMessage(
          "The email or username you entered isn't connected to an account."
        );
        break;
      case "Invalid password":
        setErrorMessage("The password you’ve entered is incorrect.");
        break;
      default:
        break;
    }
  }, [isError]);

  if (!isError) return null;
  return (
    <p
      className="login-error-message"
    >
      {errorMessage}
    </p>
  );
}

export default LoginErrorMessage;
