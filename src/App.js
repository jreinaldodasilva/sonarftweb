// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CryptoTicker from "./components/CryptoTicker/CryptoTicker";
import Home from "./pages/Home/Home";
import Crypto from "./pages/Crypto/Crypto";
import CryptoChatGPT from "./pages/CryptoChatGPT/CryptoChatGPT";
import Doggy from "./pages/Doggy/Doggy";
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
                            <Route path="/crypto" element={<Crypto />} />
                            <Route path="/cryptochatgpt" element={<CryptoChatGPT />} />
                            <Route path="/doggy" element={<Doggy />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;