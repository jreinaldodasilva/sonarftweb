import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, value }) =>
    value ? children : <Navigate to="/" />;

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
    value: PropTypes.any,
};

PrivateRoute.defaultProps = {
    value: null,
};

export default PrivateRoute;
