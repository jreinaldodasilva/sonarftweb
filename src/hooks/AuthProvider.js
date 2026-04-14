import React, { createContext, useState, useEffect } from "react";
import netlifyIdentity from "netlify-identity-widget";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        netlifyIdentity.open();
    };

    const handleLogout = () => {
        netlifyIdentity.logout();
    };

    const handleLoginSuccess = (user) => {
        setUser(user);
    };

    const handleLogoutSuccess = () => {
        setUser(null);
    };

    useEffect(() => {
        // Initialize Netlify Identity
        netlifyIdentity.init({ locale: "en" });

        // Event listeners
        netlifyIdentity.on("login", handleLoginSuccess);
        netlifyIdentity.on("logout", handleLogoutSuccess);

        // Check for the already logged-in user
        const currentUser = netlifyIdentity.currentUser();
        if (currentUser) {
            setUser(currentUser);
        }

        // Cleanup event listeners
        return () => {
            netlifyIdentity.off("login", handleLoginSuccess);
            netlifyIdentity.off("logout", handleLogoutSuccess);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
