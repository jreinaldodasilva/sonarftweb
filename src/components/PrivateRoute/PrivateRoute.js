import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, value }) =>
    value ? children : <Navigate to="/" />;

export default PrivateRoute;
