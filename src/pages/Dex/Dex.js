import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../hooks/AuthProvider";
import Building from "../../components/Building/Building";
import "./dex.css";

function PrivateRoute({ children, value }) {
    return value ? children : <Navigate to="/" />;
}

const Dex = () => {
    const { user } = useContext(AuthContext);

    return (
        <section>
            <main className="DEX-container">
                <PrivateRoute value={user}>
                    <Building />
                </PrivateRoute>
                {/* Other components or elements can go here */}
            </main>
        </section>
    );
};

export default Dex;
