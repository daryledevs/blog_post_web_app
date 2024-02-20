import { Route, Routes } from "react-router-dom";
import RouteIndex from "./routes/Index";

function App() {
  const { route } = RouteIndex();
  if (!route) return <></>;
  
  return (
    <Routes>
      {route}
      <Route path="/404" element={<div>404 Not Found Page</div>}/>
      <Route path="*" element={<div>404 Not Found Page</div>}/> 
    </Routes>
  );
}

export default App;
