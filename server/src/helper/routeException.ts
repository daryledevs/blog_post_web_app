const routeException = (path: any) => {
  if (path === "/api/v1/register") return true;
  if (path === "/api/v1/login") return true;
  if (path === "/api/v1/forgot-password") return true;
  if (path === "/api/v1/logout") return true;
  return false;
};

export default routeException;