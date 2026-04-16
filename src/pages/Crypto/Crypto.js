import React, { useContext } from "react";
import { AuthContext } from "../../hooks/AuthProvider";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute";
import Bots from "../../components/Bots/Bots";
import Parameters from "../../components/Parameters/Parameters";
import Indicators from "../../components/Indicators/Indicators";
import "./crypto.css";

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
