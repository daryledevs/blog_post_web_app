import React, {  useState } from "react";
import useFetchRouter from "../hooks/useFetchRouter";

function RouteIndex() {
  const DummyComponent = () => <React.Fragment />;
  const [route, setRoute] = useState<any>(() => <DummyComponent />);
  useFetchRouter({ setRoute });
  return { route };
}

export default RouteIndex;
