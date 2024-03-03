function LoginSignUpPrompt() {
  return (
    <div
      style={{
        marginTop: "1vh",
        padding: "2vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid rgb(219,219,219)",
      }}
    >
      <p style={{ fontSize: "0.9rem", }}
      >
        Don't have an account?{" "}
        <a style={{ fontSize: "0.9rem", fontWeight: "bold" }} href="#"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}

export default LoginSignUpPrompt
