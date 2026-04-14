import React, { useContext } from "react";
import { AuthContext } from "../../hooks/AuthProvider";
import { Link } from "react-router-dom";
import logo from "../../assets/img/sonarftlogo.png";
import "./navbar.css";

const NavBar = () => {
    const { user, handleLogin, handleLogout } = useContext(AuthContext);

    return (
        <nav className="nav">
            <section className="sectionLogo">
                <img src={logo} alt="SonarFT" className="logo" />
                <Link style={{ textDecoration: "none" }} to="/">
                    <h1>
                        S<span>o</span>narFT
                    </h1>
                </Link>
            </section>
            <section className="sectionLinks">
                <Link style={{ textDecoration: "none" }} to="/forex">
                    <h1>
                        F<span>o</span>rex
                    </h1>
                </Link>
                <Link style={{ textDecoration: "none" }} to="/crypto">
                    <h1>
                        Crypt<span>o</span>
                    </h1>
                </Link>
                <Link style={{ textDecoration: "none" }} to="/DEX">
                    <h1>
                        DEX
                    </h1>
                </Link>
                <Link style={{ textDecoration: "none" }} to="/token">
                    <h1>
                        T<span>o</span>ken
                    </h1>
                </Link>
                {/* Other links can go here */}
            </section>
            
            <section className="sectionLogin">
                {user ? (
                    <button onClick={handleLogout}>Sign Out</button>
                ) : (
                    <button onClick={handleLogin}>Sign In</button>
                )}
            </section>
        </nav>
    );
}

export default NavBar;