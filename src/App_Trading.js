// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CryptoTicker from "./components/CryptoTicker/CryptoTicker";
import Home from "./pages/Home/Home";
import Forex from "./pages/Forex/Forex";
import Crypto from "./pages/Crypto/Crypto";
import Dex from "./pages/Dex/Dex";
import Token from "./pages/Token/Token";
import "./styles.css";
import { AuthProvider } from "./hooks/AuthProvider"; // Importing AuthProvider


const App = () => {
    return (
        <AuthProvider> {/* Using AuthProvider to wrap all components */}
            <Router>
                <div className="App">
                    <Header />
                    <CryptoTicker />                        
                    <main className="main-container">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/forex" element={<Forex />} />
                            <Route path="/crypto" element={<Crypto />} />
                            <Route path="/DEX" element={<Dex />} />
                            <Route path="/token" element={<Token />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;