import { useEffect } from "react";

import PublicRoute from "@/routes/PublicRoute";
import PrivateRoute from "@/routes/PrivateRoute";

import { useLoginMutation } from "@/redux/api/authApi";
import { useGetUserDataQuery } from "@/redux/api/userApi";

type useFetchRouterProps = {
  setRoute: any;
};

function useFetchRouter({ setRoute }: useFetchRouterProps) {
  const [, loginApiData] = useLoginMutation({ fixedCacheKey: "login-api" });
  const userDataApi = useGetUserDataQuery();

  useEffect(() => {
    const LOGIN_STATUS = "Login successfully";
    const sessionToken = sessionStorage.getItem("token");

    if (loginApiData.isError) {
      console.log("LOGIN ERROR: ", loginApiData.error);
      setRoute(() => <PublicRoute />);
      return;
    }

    if (loginApiData.data?.message === LOGIN_STATUS) {
      sessionStorage.setItem("token", loginApiData.data.token);
      setRoute(() => <PrivateRoute />);
      return;
    }

    if (sessionToken || userDataApi.data) {
      setRoute(() => <PrivateRoute />);
      return;
    }

    if (!userDataApi.isLoading) {
      setRoute(() => <PublicRoute />);
    }
  }, [loginApiData, userDataApi]);
}

export default useFetchRouter;
