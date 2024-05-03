import { Navigate, Route } from "react-router-dom";

type RedirectRouteProps = {
  defaultPath: string;
  routePath: string[];
};

function RedirectRoute({ defaultPath, routePath }: RedirectRouteProps) {
  const Redirect = () => (
    <Navigate
      to={defaultPath}
      replace
    />
  );

  return routePath.map((path: any, index: number) => (
    <Route
      key={index}
      path={path}
      element={<Redirect />}
    />
  ));
}

export default RedirectRoute;
