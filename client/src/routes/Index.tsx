import { useEffect, useState } from "react";
import SocketService from "../services/SocketServices";
import useFetchRouter from "../hooks/useFetchRouter";
import { useGetUserDataQuery } from "../redux/api/userApi";

function RouteIndex() {
  const [route, setRoute] = useState<any>(null);
  const socketService = new SocketService("ws://localhost:8900");
  const userDataApi = useGetUserDataQuery({ person: "" });

  useEffect(() => {
    if (userDataApi.data) {
      socketService.addUserId(userDataApi.data.user.user_id);
      socketService.onConnection();
    }
    return () => {
      socketService.onDisconnect();
    };
  }, [userDataApi.data]);

  useFetchRouter({
    socketService,
    setRoute,
  });

  return { route };
}

export default RouteIndex;
