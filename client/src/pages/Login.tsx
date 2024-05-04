import { SubmitHandler }    from "react-hook-form";
import Instagram            from "@/assets/images/instagram-logo.svg?react";
import LoginForm            from "@/components/login/LoginForm";
import LoginErrorMessage    from "@/components/login/LoginErrorMessage";
import LoginSignUpPrompt    from "@/components/login/LoginSignUpPrompt";
import { useLoginMutation } from "@/redux/api/authApi";

type Inputs = {
  userCredential: string;
  password: string;
};

function Login() {
  const [login, { isError, error }] = useLoginMutation({
    fixedCacheKey: "login-api",
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
