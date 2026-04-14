import React from "react";
import Welcome from "./Welcome/Welcome";
import "./home.css";

const Home = () => {
    return (
        <main className="home-container">
            <main className="welcome-container">
                <Welcome />
            </main>
            {/*
            <div className="welcome2-container">
                <Welcome/>
            </div>
            */}
            {/* Other components or elements can go here */}
        </main>
    );
};

export default Home;
