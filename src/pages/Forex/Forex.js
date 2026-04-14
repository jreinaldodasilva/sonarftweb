import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../hooks/AuthProvider";
import Building from "../../components/Building/Building";
import "./forex.css";

function PrivateRoute({ children, value }) {
    return value ? children : <Navigate to="/" />;
}

const Forex = () => {
    const { user } = useContext(AuthContext);

    return (
        <section>
            <main className="forex-container">
                <PrivateRoute value={user}>
                    <Building />
                </PrivateRoute>
                {/* Other components or elements can go here */}
            </main>
        </section>
    );
};

export default Forex;
