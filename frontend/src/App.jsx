import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeOne from "./pages/HomeOne";


function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" index element={<HomeOne />} />
        <Route path="/home1" element={<HomeOne />} />
       
      </Routes>
      
    </div>
  );
}

export default App;
