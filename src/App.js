import { Route, Routes } from "react-router-dom";
// components
import HomeNavigate from "./Homenavigate";
import Home from "./home";
import History from "./History";
function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<HomeNavigate />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/history" element={<History />} />
      </Routes>
    </div>
  );
}

export default App;
