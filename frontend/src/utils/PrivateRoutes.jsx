import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ children, ...rest }) => {
  const userToken = window.localStorage.getItem("token");
  return userToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
