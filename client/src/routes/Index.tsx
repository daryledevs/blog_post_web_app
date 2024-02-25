import { useEffect, useState } from "react";
import useSocket from '../hooks/useSocketIO';
import useFetchRouter from "../hooks/useFetchRouter";

function RouteIndex() {
  const [route, setRoute] = useState<any>(null);
  const socket = useSocket("ws://localhost:8900");
  const { onConnection, onDisconnect } = socket;
  
  useEffect(() => {
    onConnection();
    return () => {
      onDisconnect();
    };
  }, []);

  useFetchRouter({
    socket,
    setRoute,
  })

  return { route };
};

export default RouteIndex;