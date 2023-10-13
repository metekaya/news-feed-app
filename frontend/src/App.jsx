import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import PrivateRoutes from "./utils/PrivateRoutes";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoutes />}>
        <Route element={<Home />} path="/" exact></Route>
      </Route>
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}
