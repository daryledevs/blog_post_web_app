import SubmitBtn from "../form-controllers/button/SubmitBtn";

function LoginSubmitBtn({ isValid }: { isValid: boolean }) {
  return (
    <SubmitBtn
      text="Log In"
      isValid={isValid}
      bgValidColor="rgb(0,149,246)"
      bgInvalidColor="rgb(76,181,249)"
      className="login-form-submit-btn"
    />
  );
}

export default LoginSubmitBtn;
