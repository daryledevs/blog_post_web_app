import { useLoginMutation } from "../redux/api/authApi";
import { SubmitHandler } from "react-hook-form";
import LoginForm from "components/LoginForm";
import LoginErrorMessage from "components/LoginErrorMessage";
import Instagram from "../assets/images/instagram-logo.svg?react";
import LoginSignUpPrompt from "components/LoginSignUpPrompt";

type Inputs = {
  userCredential: string;
  password: string;
};

function Login() {
  const [login, { isError, error }] = useLoginMutation({
    fixedCacheKey: "shared-update-post",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const userCredential = data.userCredential;
    const password = data.password;
    login({ userCredential, password });
  };

  return (
    <div className="login__container">
      <div className="login__wrapper">
        <div className="login__parent">
          <Instagram style={{ margin: "1vh 0 4vh 0" }} />
          <LoginForm onSubmit={onSubmit} />
          <LoginErrorMessage
            isError={isError}
            error={error}
          />
        </div>
        <LoginSignUpPrompt />
      </div>
    </div>
  );
}

export default Login;
