import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import netlifyIdentity from "netlify-identity-widget";
import useIdleTimeout from "./useIdleTimeout";

export const AuthContext = createContext();

// Default: 30 minutes. Override with REACT_APP_IDLE_TIMEOUT_MS env var.
const IDLE_TIMEOUT_MS = parseInt(
    process.env.REACT_APP_IDLE_TIMEOUT_MS || "1800000",
    10
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Stable references — never recreated, so context consumers don't re-render
    // when AuthProvider re-renders for reasons unrelated to user state.
    const handleLogin = useCallback(() => {
        netlifyIdentity.open();
    }, []);

    const handleLogout = useCallback(() => {
        netlifyIdentity.logout();
    }, []);

    const handleLoginSuccess = useCallback((loggedInUser) => {
        setUser(loggedInUser);
    }, []);

    const handleLogoutSuccess = useCallback(() => {
        setUser(null);
    }, []);

    useEffect(() => {
        netlifyIdentity.init({ locale: "en" });

        netlifyIdentity.on("login", handleLoginSuccess);
        netlifyIdentity.on("logout", handleLogoutSuccess);

        const currentUser = netlifyIdentity.currentUser();
        if (currentUser) {
            setUser(currentUser);
        }

        return () => {
            netlifyIdentity.off("login", handleLoginSuccess);
            netlifyIdentity.off("logout", handleLogoutSuccess);
        };
    }, [handleLoginSuccess, handleLogoutSuccess]);

    // Auto-logout after IDLE_TIMEOUT_MS of inactivity — only when logged in.
    useIdleTimeout(handleLogout, IDLE_TIMEOUT_MS, !!user);

    // Context value only changes when user changes — prevents re-renders on all
    // 5 consumers (NavBar, Crypto, Dex, Forex, Token) on unrelated AuthProvider renders.
    const contextValue = useMemo(
        () => ({ user, handleLogin, handleLogout }),
        [user, handleLogin, handleLogout]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
