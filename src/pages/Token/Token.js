import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../hooks/AuthProvider";
import Building from "../../components/Building/Building";
import "./token.css";

function PrivateRoute({ children, value }) {
    return value ? children : <Navigate to="/" />;
}

const Token = () => {
    const { user } = useContext(AuthContext);

    return (
        <section>
            <main className="token-container">
                <PrivateRoute value={user}>
                    <Building />
                </PrivateRoute>
                {/* Other components or elements can go here */}
            </main>
        </section>
    );
};

export default Token;
