import { useEffect, useState } from "react";
import SocketService from "../services/SocketServices";
import useFetchRouter from "../hooks/useFetchRouter";

function RouteIndex() {
  const [route, setRoute] = useState<any>(null);
  const socketService = new SocketService("ws://localhost:8900");
  
  useEffect(() => {
    socketService.onConnection();
    return () => {
     socketService.onDisconnect();
    };
  }, []);

  useFetchRouter({
    socketService,
    setRoute,
  });

  return { route };
};

export default RouteIndex;