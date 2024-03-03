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
      case "Password is incorrect":
        setErrorMessage("The password you’ve entered is incorrect.");
        break;
      default:
        break;
    }
  }, [isError]);

  if (!isError) return null;
  return (
    <p
      style={{
        textAlign: "center",
        marginTop: "0.88vh",
        marginBottom: "1.5vh",
        fontSize: "0.8rem",
        width: "80%",
        color: "red",
      }}
    >
      {errorMessage}
    </p>
  );
}

export default LoginErrorMessage;
