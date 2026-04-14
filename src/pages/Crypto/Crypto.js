import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../hooks/AuthProvider";
import Bots from "../../components/Bots/Bots";
import Parameters from "../../components/Parameters/Parameters";
import Indicators from "../../components/Indicators/Indicators";
import "./crypto.css";

function PrivateRoute({ children, value }) {
    return value ? children : <Navigate to="/" />;
}

const Crypto = () => {
    const { user } = useContext(AuthContext);

    return (
        <section>
            <main className="crypto">
                <PrivateRoute value={user}>
                    <div className="parameters-container">
                        <Parameters clientId={user.id} />
                        <Indicators clientId={user.id} />
                    </div>
                    <div className="bots-container">
                        <Bots user={user} />
                    </div>
                </PrivateRoute>
            </main>
        </section>
    );
};

export default Crypto;
