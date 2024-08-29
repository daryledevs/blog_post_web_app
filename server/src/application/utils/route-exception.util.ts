const routeException = (path: any) => {
  const paths = [
    "/api/v1/auth/register",
    "/api/v1/auth/login",
    "/api/v1/auth/forgot-password",
    "/api/v1/auth/reset-password",
    "/api/v1/auth/reset-password-form",
    "/api/v1/auth/logout",
  ];
  return paths.includes(path);
};

export default routeException;